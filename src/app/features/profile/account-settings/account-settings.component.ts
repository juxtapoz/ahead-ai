import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { ProfileService } from '../../../core/services/profile.service';
import { DeleteAccountDialogComponent } from './delete-account-dialog.component';
import { VersionHistoryDialogComponent } from './version-history-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatDividerModule,
    MatListModule
  ],
  template: `
    <div class="account-settings">
      <!-- Password Change Section -->
      <div class="settings-section">
        <h2>Change Password</h2>
        <form [formGroup]="passwordForm" (ngSubmit)="onPasswordChange()" class="password-form">
          <mat-form-field appearance="outline">
            <mat-label>Current Password</mat-label>
            <input matInput type="password" formControlName="currentPassword" required>
            <mat-error *ngIf="passwordForm.get('currentPassword')?.hasError('required')">
              Current password is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>New Password</mat-label>
            <input matInput type="password" formControlName="newPassword" required>
            <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('required')">
              New password is required
            </mat-error>
            <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('minlength')">
              Password must be at least 8 characters
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Confirm New Password</mat-label>
            <input matInput type="password" formControlName="confirmPassword" required>
            <mat-error *ngIf="passwordForm.get('confirmPassword')?.hasError('required')">
              Please confirm your new password
            </mat-error>
            <mat-error *ngIf="passwordForm.get('confirmPassword')?.hasError('passwordMismatch')">
              Passwords do not match
            </mat-error>
          </mat-form-field>

          <div class="form-actions">
            <button mat-raised-button color="primary" type="submit" [disabled]="!passwordForm.valid || !passwordForm.dirty">
              Update Password
            </button>
          </div>
        </form>
      </div>

      <mat-divider></mat-divider>

      <!-- Data Management Section -->
      <div class="settings-section">
        <h2>Data Management</h2>
        <mat-list>
          <mat-list-item>
            <span matListItemTitle>Export Personal Data</span>
            <span matListItemLine>Download all your personal information and financial data</span>
            <button mat-button color="primary" (click)="exportData()">
              <mat-icon>download</mat-icon>
              Export
            </button>
          </mat-list-item>

          <mat-list-item>
            <span matListItemTitle>Version History</span>
            <span matListItemLine>View and restore previous versions of your profile</span>
            <button mat-button color="primary" (click)="viewVersionHistory()">
              <mat-icon>history</mat-icon>
              View History
            </button>
          </mat-list-item>
        </mat-list>
      </div>

      <mat-divider></mat-divider>

      <!-- Account Deletion Section -->
      <div class="settings-section danger-zone">
        <h2>Danger Zone</h2>
        <div class="danger-content">
          <div class="danger-text">
            <h3>Delete Account</h3>
            <p>Once you delete your account, there is no going back. Please be certain.</p>
          </div>
          <button mat-raised-button color="warn" (click)="confirmDelete()">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .account-settings {
      max-width: 800px;
      margin: 0 auto;
    }

    .settings-section {
      padding: 24px 0;
    }

    .settings-section h2 {
      color: #2C3E50;
      font-size: 1.5rem;
      margin-bottom: 24px;
      font-weight: 500;
    }

    .password-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 400px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
    }

    .danger-zone {
      background: #FFF5F5;
      border-radius: 8px;
      padding: 24px;
      margin-top: 24px;
    }

    .danger-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 24px;
    }

    .danger-text h3 {
      color: #FF3860;
      margin: 0 0 8px 0;
      font-size: 1.2rem;
    }

    .danger-text p {
      color: #2C3E50;
      margin: 0;
    }

    ::ng-deep {
      .mat-mdc-form-field {
        width: 100%;
      }

      .mat-mdc-list-item {
        height: auto !important;
        padding: 16px 0;
      }

      .mat-mdc-list-item-content {
        padding: 0 !important;
      }
    }

    @media (max-width: 768px) {
      .danger-content {
        flex-direction: column;
        align-items: flex-start;
      }

      .danger-content button {
        width: 100%;
      }
    }
  `]
})
export class AccountSettingsComponent {
  passwordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private profileService: ProfileService,
    private router: Router
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  async onPasswordChange() {
    if (this.passwordForm.valid) {
      try {
        await this.profileService.updatePassword(
          this.passwordForm.get('currentPassword')?.value,
          this.passwordForm.get('newPassword')?.value
        );
        this.snackBar.open('Password updated successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end'
        });
        this.passwordForm.reset();
      } catch (error) {
        this.snackBar.open('Failed to update password. Please try again.', 'Close', {
          duration: 5000,
          horizontalPosition: 'end'
        });
      }
    }
  }

  async exportData() {
    try {
      const blob = await this.profileService.exportProfileData();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `profile-data-${new Date().toISOString()}.json`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      this.snackBar.open('Failed to export data. Please try again.', 'Close', {
        duration: 5000,
        horizontalPosition: 'end'
      });
    }
  }

  viewVersionHistory() {
    const dialogRef = this.dialog.open(VersionHistoryDialogComponent, {
      width: '600px',
      maxHeight: '80vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Refresh the page or update the data if needed
        window.location.reload();
      }
    });
  }

  confirmDelete() {
    const dialogRef = this.dialog.open(DeleteAccountDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.profileService.deleteAccount();
          this.snackBar.open('Account deleted successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end'
          });
          this.router.navigate(['/auth/register']);
        } catch (error) {
          this.snackBar.open('Failed to delete account. Please try again.', 'Close', {
            duration: 5000,
            horizontalPosition: 'end'
          });
        }
      }
    });
  }
}
