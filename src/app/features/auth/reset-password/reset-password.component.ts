import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-reset-password',
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
    <div class="reset-password-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Set New Password</mat-card-title>
          <mat-card-subtitle>Enter your new password below</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="resetPasswordForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>New Password</mat-label>
              <input matInput formControlName="password" [type]="hidePassword ? 'password' : 'text'" placeholder="Enter new password">
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="resetPasswordForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
              <mat-error *ngIf="resetPasswordForm.get('password')?.hasError('pattern')">
                Password must be at least 8 characters long and include uppercase, lowercase, number, and special character
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirm Password</mat-label>
              <input matInput formControlName="confirmPassword" [type]="hidePassword ? 'password' : 'text'" placeholder="Confirm new password">
              <mat-error *ngIf="resetPasswordForm.get('confirmPassword')?.hasError('required')">
                Please confirm your password
              </mat-error>
              <mat-error *ngIf="resetPasswordForm.get('confirmPassword')?.hasError('passwordMismatch')">
                Passwords do not match
              </mat-error>
            </mat-form-field>

            <div class="error-message" *ngIf="error">
              {{ error }}
            </div>

            <div class="success-message" *ngIf="success">
              {{ success }}
            </div>

            <button mat-raised-button color="primary" type="submit" [disabled]="resetPasswordForm.invalid || loading" class="full-width">
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              <span *ngIf="!loading">Reset Password</span>
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
    .reset-password-container {
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
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  loading = false;
  error = '';
  success = '';
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    // Check if we have a valid reset token in the URL
    const token = this.route.snapshot.queryParams['token'];
    if (!token) {
      this.error = 'Invalid or missing reset token';
      this.resetPasswordForm.disable();
    }
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { passwordMismatch: true };
  }

  async onSubmit() {
    if (this.resetPasswordForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      try {
        const { password } = this.resetPasswordForm.value;
        await this.authService.updatePassword(password).toPromise();
        this.success = 'Password has been reset successfully';
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      } catch (err: any) {
        this.error = err.message || 'Error resetting password';
      } finally {
        this.loading = false;
      }
    }
  }
} 