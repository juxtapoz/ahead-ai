import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="verify-email-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Verify Your Email</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>We've sent a verification email to your address. Please check your inbox and click the verification link to continue.</p>
          <p>If you don't see the email, please check your spam folder.</p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="resendVerification()" [disabled]="loading">
            <mat-icon>refresh</mat-icon>
            Resend Verification Email
          </button>
          <button mat-button (click)="goToLogin()">
            Back to Login
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .verify-email-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }
    mat-card {
      max-width: 500px;
      width: 100%;
      text-align: center;
    }
    mat-card-content {
      margin: 20px 0;
    }
    mat-card-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 16px;
    }
    button {
      width: 100%;
    }
  `]
})
export class VerifyEmailComponent implements OnInit {
  loading = false;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if user is already verified
    this.supabaseService.currentUser$.subscribe(user => {
      if (user?.email_confirmed_at) {
        this.router.navigate(['/profile/financial']);
      }
    });
  }

  async resendVerification() {
    this.loading = true;
    try {
      await this.supabaseService.resendVerificationEmail();
      alert('Verification email resent successfully!');
    } catch (error: any) {
      alert(error.message || 'Error resending verification email');
    } finally {
      this.loading = false;
    }
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
} 