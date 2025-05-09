import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="forgot-password-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Reset Password</mat-card-title>
          <mat-card-subtitle>Enter your email to receive a password reset link</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="Enter your email">
              <mat-error *ngIf="forgotPasswordForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="forgotPasswordForm.get('email')?.hasError('email')">
                Please enter a valid email address
              </mat-error>
            </mat-form-field>

            <div class="error-message" *ngIf="error">
              {{ error }}
            </div>

            <div class="success-message" *ngIf="success">
              {{ success }}
            </div>

            <button mat-raised-button color="primary" type="submit" [disabled]="forgotPasswordForm.invalid || loading" class="full-width">
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              <span *ngIf="!loading">Send Reset Link</span>
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <p class="login-link">
            Remember your password? <a routerLink="/auth/login">Sign in</a>
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .forgot-password-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      background-color: #f8f9fa;
    }

    mat-card {
      max-width: 400px;
      width: 100%;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    mat-card-header {
      margin-bottom: 20px;
      text-align: center;
    }

    mat-card-title {
      font-size: 24px;
      color: #3273DC;
      margin-bottom: 8px;
    }

    mat-card-subtitle {
      color: #666;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .error-message {
      color: #FF3860;
      margin: 16px 0;
      text-align: center;
    }

    .success-message {
      color: #23D160;
      margin: 16px 0;
      text-align: center;
    }

    button[type="submit"] {
      height: 48px;
      font-size: 16px;
    }

    .login-link {
      text-align: center;
      margin-top: 16px;
      color: #666;

      a {
        color: #3273DC;
        text-decoration: none;
        font-weight: 500;
        &:hover {
          text-decoration: underline;
        }
      }
    }

    mat-spinner {
      display: inline-block;
      margin-right: 8px;
    }
  `]
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      try {
        const { email } = this.forgotPasswordForm.value;
        await this.authService.resetPassword(email).toPromise();
        this.success = 'Password reset link has been sent to your email';
        this.forgotPasswordForm.reset();
      } catch (err: any) {
        this.error = err.message || 'Error sending reset link';
      } finally {
        this.loading = false;
      }
    }
  }
} 