import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface FinancialProfile {
  annualIncome: number;
  currentSavings: number;
  retirementAge: number;
  riskTolerance: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  public client: SupabaseClient;
  private currentUser = new BehaviorSubject<User | null>(null);

  constructor() {
    this.client = createClient(
      environment.supabase.url,
      environment.supabase.publicKey
    );

    // Initialize user from session
    this.client.auth.getSession().then(({ data: { session } }) => {
      this.currentUser.next(session?.user ?? null);
    });

    // Listen for auth changes
    this.client.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      this.currentUser.next(session?.user ?? null);
    });
  }

  get currentUser$(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  async signUp(email: string, password: string) {
    const { data, error } = await this.client.auth.signUp({
      email,
      password
    });
    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  }

  async signInWithGoogle() {
    const { data, error } = await this.client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) throw error;
    return data;
  }

  async signInWithApple() {
    const { data, error } = await this.client.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await this.client.auth.signOut();
    if (error) throw error;
  }

  async resetPassword(email: string) {
    const { error } = await this.client.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }

  async updatePassword(newPassword: string) {
    const { error } = await this.client.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
  }

  async resendVerificationEmail() {
    const { data: { user } } = await this.client.auth.getUser();
    if (!user?.email) throw new Error('No user email found');
    
    const { error } = await this.client.auth.resend({
      type: 'signup',
      email: user.email
    });
    if (error) throw error;
  }

  async getCurrentUser() {
    const { data: { user }, error } = await this.client.auth.getUser();
    if (error) throw error;
    return user;
  }

  async getSession() {
    const { data: { session }, error } = await this.client.auth.getSession();
    if (error) throw error;
    return session;
  }

  async saveFinancialProfile(profile: FinancialProfile) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not found');

    const { error } = await this.client
      .from('financial_profiles')
      .upsert({
        user_id: user.id,
        ...profile,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
  }
} 