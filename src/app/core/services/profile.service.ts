import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
}

export interface FinancialGoals {
  retirementAge: number;
  targetIncome: number;
  currentIncome: number;
  riskTolerance: number;
  investmentStrategy: string;
  expectedReturn: number;
  currentSavings: number;
  monthlyContribution: number;
  employerMatch: number;
}

export interface ProfileVersion {
  id: string;
  createdAt: Date;
  type: 'personal' | 'financial';
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private personalInfoSubject = new BehaviorSubject<PersonalInfo | null>(null);
  private financialGoalsSubject = new BehaviorSubject<FinancialGoals | null>(null);
  private profileCompletenessSubject = new BehaviorSubject<number>(0);

  personalInfo$ = this.personalInfoSubject.asObservable();
  financialGoals$ = this.financialGoalsSubject.asObservable();
  profileCompleteness$ = this.profileCompletenessSubject.asObservable();

  constructor(private supabase: SupabaseService) {
    this.loadProfileData();
  }

  private async loadProfileData() {
    try {
      const user = await this.supabase.getCurrentUser();
      if (!user?.id) throw new Error('User not authenticated');

      const { data: personalInfo, error: personalError } = await this.supabase.client
        .from('personal_info')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (personalError) throw personalError;
      this.personalInfoSubject.next(personalInfo);

      const { data: financialGoals, error: financialError } = await this.supabase.client
        .from('financial_goals')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (financialError) throw financialError;
      this.financialGoalsSubject.next(financialGoals);

      this.updateProfileCompleteness();
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  }

  private updateProfileCompleteness() {
    const personalInfo = this.personalInfoSubject.value as any;
    const financialGoals = this.financialGoalsSubject.value as any;

    let completeness = 0;
    let totalFields = 0;

    if (personalInfo) {
      const requiredPersonalFields = ['first_name', 'last_name', 'date_of_birth', 'email', 'address', 'city', 'state', 'zip_code'];
      totalFields += requiredPersonalFields.length;
      completeness += requiredPersonalFields.filter(field => personalInfo[field]).length;
    }

    if (financialGoals) {
      const requiredFinancialFields = ['retirement_age', 'target_income', 'current_income', 'risk_tolerance', 'investment_strategy', 'current_savings', 'monthly_contribution'];
      totalFields += requiredFinancialFields.length;
      completeness += requiredFinancialFields.filter(field => financialGoals[field]).length;
    }

    const percentage = totalFields > 0 ? (completeness / totalFields) * 100 : 0;
    this.profileCompletenessSubject.next(Math.round(percentage));
  }

  async updatePersonalInfo(info: any): Promise<void> {
    try {
      // Get current user
      const user = await this.supabase.getCurrentUser();
      if (!user?.id) throw new Error('User not authenticated');

      // Map form fields to DB columns (snake_case)
      const payload = {
        user_id: user.id,
        first_name: info.first_name,
        last_name: info.last_name,
        date_of_birth: info.date_of_birth,
        gender: info.gender,
        email: info.email,
        phone: info.phone,
        address: info.address,
        city: info.city,
        state: info.state,
        zip_code: info.zip_code,
        email_notifications: info.email_notifications,
        sms_notifications: info.sms_notifications,
        marketing_emails: info.marketing_emails
      };

      console.log('Saving personal info payload:', payload);

      const { error } = await this.supabase.client
        .from('personal_info')
        .upsert([payload], { onConflict: 'user_id' });

      if (error) throw error;

      this.personalInfoSubject.next(info);
      this.updateProfileCompleteness();
      await this.createVersionHistory('personal', info);
    } catch (error) {
      console.error('Error updating personal info:', error);
      throw error;
    }
  }

  async updateFinancialGoals(goals: any): Promise<void> {
    try {
      const user = await this.supabase.getCurrentUser();
      if (!user?.id) throw new Error('User not authenticated');
      const payload = {
        user_id: user.id,
        ...goals
      };
      const { error } = await this.supabase.client
        .from('financial_goals')
        .upsert([payload], { onConflict: 'user_id' });

      if (error) throw error;

      this.financialGoalsSubject.next(goals);
      this.updateProfileCompleteness();
      await this.createVersionHistory('financial', goals);
    } catch (error) {
      console.error('Error updating financial goals:', error);
      throw error;
    }
  }

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const { error } = await this.supabase.client.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }

  async exportProfileData(): Promise<Blob> {
    try {
      const personalInfo = this.personalInfoSubject.value;
      const financialGoals = this.financialGoalsSubject.value;

      const exportData = {
        personalInfo,
        financialGoals,
        exportDate: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      return blob;
    } catch (error) {
      console.error('Error exporting profile data:', error);
      throw error;
    }
  }

  async getVersionHistory(): Promise<ProfileVersion[]> {
    try {
      const { data, error } = await this.supabase.client
        .from('profile_versions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting version history:', error);
      throw error;
    }
  }

  private async createVersionHistory(type: 'personal' | 'financial', data: any): Promise<void> {
    try {
      const user = await this.supabase.getCurrentUser();
      if (!user?.id) throw new Error('User not authenticated');
      const payload = {
        user_id: user.id,
        type,
        data
      };
      const { error } = await this.supabase.client
        .from('profile_versions')
        .insert(payload);

      if (error) throw error;
    } catch (error) {
      console.error('Error creating version history:', error);
      throw error;
    }
  }

  async deleteAccount(): Promise<void> {
    try {
      const { error } = await this.supabase.client.auth.admin.deleteUser(
        (await this.supabase.client.auth.getUser()).data.user?.id || ''
      );

      if (error) throw error;

      // Delete associated data
      await this.supabase.client.from('personal_info').delete().neq('id', 0);
      await this.supabase.client.from('financial_goals').delete().neq('id', 0);
      await this.supabase.client.from('profile_versions').delete().neq('id', 0);
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }
} 