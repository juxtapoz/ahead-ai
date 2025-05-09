import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-financial-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="financial-profile-container">
      <h1>Complete Your Financial Profile</h1>
      <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline">
          <mat-label>Annual Income</mat-label>
          <input matInput type="number" formControlName="annualIncome" placeholder="Enter your annual income">
          <mat-error *ngIf="profileForm.get('annualIncome')?.hasError('required')">
            Annual income is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Current Savings</mat-label>
          <input matInput type="number" formControlName="currentSavings" placeholder="Enter your current savings">
          <mat-error *ngIf="profileForm.get('currentSavings')?.hasError('required')">
            Current savings is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Retirement Age</mat-label>
          <input matInput type="number" formControlName="retirementAge" placeholder="Enter your target retirement age">
          <mat-error *ngIf="profileForm.get('retirementAge')?.hasError('required')">
            Retirement age is required
          </mat-error>
          <mat-error *ngIf="profileForm.get('retirementAge')?.hasError('min') || profileForm.get('retirementAge')?.hasError('max')">
            Retirement age must be between 55 and 75
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Risk Tolerance</mat-label>
          <mat-select formControlName="riskTolerance">
            <mat-option value="conservative">Conservative</mat-option>
            <mat-option value="moderate">Moderate</mat-option>
            <mat-option value="aggressive">Aggressive</mat-option>
          </mat-select>
          <mat-error *ngIf="profileForm.get('riskTolerance')?.hasError('required')">
            Risk tolerance is required
          </mat-error>
        </mat-form-field>

        <div class="form-actions">
          <button mat-raised-button color="primary" type="submit" [disabled]="profileForm.invalid || loading">
            Save Profile
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .financial-profile-container {
      max-width: 600px;
      margin: 40px auto;
      padding: 20px;
    }
    h1 {
      text-align: center;
      margin-bottom: 30px;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    mat-form-field {
      width: 100%;
    }
    .form-actions {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
    button {
      min-width: 200px;
    }
  `]
})
export class FinancialProfileComponent implements OnInit {
  profileForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      annualIncome: ['', [Validators.required, Validators.min(0)]],
      currentSavings: ['', [Validators.required, Validators.min(0)]],
      retirementAge: ['', [Validators.required, Validators.min(55), Validators.max(75)]],
      riskTolerance: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Check if user is authenticated
    this.supabaseService.currentUser$.subscribe(user => {
      if (!user) {
        this.router.navigate(['/auth/login']);
      }
    });
  }

  async onSubmit() {
    if (this.profileForm.valid) {
      this.loading = true;
      try {
        await this.supabaseService.saveFinancialProfile(this.profileForm.value);
        this.router.navigate(['/dashboard']);
      } catch (error: any) {
        alert(error.message || 'Error saving financial profile');
      } finally {
        this.loading = false;
      }
    }
  }
} 