import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Welcome Back</mat-card-title>
          <mat-card-subtitle>Sign in to continue your retirement planning</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="Enter your email">
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                Please enter a valid email address
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" [type]="hidePassword ? 'password' : 'text'" placeholder="Enter your password">
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
            </mat-form-field>

            <div class="form-options">
              <mat-checkbox formControlName="rememberMe">Remember me</mat-checkbox>
              <a routerLink="/auth/forgot-password" class="forgot-password">Forgot password?</a>
            </div>

            <div class="error-message" *ngIf="error">
              {{ error }}
            </div>

            <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid || loading" class="full-width">
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              <span *ngIf="!loading">Sign In</span>
            </button>

            <div class="social-divider">
              <span>or continue with</span>
            </div>

            <div class="social-buttons">
              <button mat-stroked-button type="button" class="google-btn" (click)="loginWithGoogle()">
                <img src="assets/icons/google.svg" alt="Google icon"> Google
              </button>
              <button mat-stroked-button type="button" class="apple-btn" (click)="loginWithApple()">
                <img src="assets/icons/apple.svg" alt="Apple icon"> Apple
              </button>
            </div>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <p class="register-link">
            Don't have an account? <a routerLink="/auth/register">Create one</a>
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
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

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .forgot-password {
        color: #3273DC;
        text-decoration: none;
        font-size: 14px;
        &:hover {
          text-decoration: underline;
        }
      }
    }

    .error-message {
      color: #FF3860;
      margin: 16px 0;
      text-align: center;
    }

    button[type="submit"] {
      height: 48px;
      font-size: 16px;
    }

    .social-divider {
      text-align: center;
      margin: 24px 0;
      position: relative;

      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        width: calc(50% - 30px);
        height: 1px;
        background-color: #ddd;
      }

      &::before {
        left: 0;
      }

      &::after {
        right: 0;
      }

      span {
        background-color: #fff;
        padding: 0 10px;
        color: #666;
        font-size: 14px;
      }
    }

    .social-buttons {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;

      button {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        height: 40px;

        img {
          width: 18px;
          height: 18px;
        }
      }
    }

    .register-link {
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
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';

      try {
        const { email, password } = this.loginForm.value;
        await this.authService.login(email, password).toPromise();
        this.router.navigate(['/dashboard']);
      } catch (err: any) {
        this.error = err.message || 'Invalid email or password';
      } finally {
        this.loading = false;
      }
    }
  }

  async loginWithGoogle() {
    try {
      await this.authService.loginWithGoogle().toPromise();
    } catch (err: any) {
      this.error = err.message || 'Error signing in with Google';
    }
  }

  async loginWithApple() {
    try {
      await this.authService.loginWithApple().toPromise();
    } catch (err: any) {
      this.error = err.message || 'Error signing in with Apple';
    }
  }
} 