import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-delete-account-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="delete-account-dialog">
      <h2 mat-dialog-title>Delete Account</h2>
      <mat-dialog-content>
        <p class="warning-text">
          This action cannot be undone. This will permanently delete your account and remove all associated data from our servers.
        </p>
        <form [formGroup]="confirmationForm" class="confirmation-form">
          <mat-form-field appearance="outline">
            <mat-label>Type "DELETE" to confirm</mat-label>
            <input matInput formControlName="confirmation" required>
            <mat-error *ngIf="confirmationForm.get('confirmation')?.hasError('required')">
              Confirmation is required
            </mat-error>
            <mat-error *ngIf="confirmationForm.get('confirmation')?.hasError('pattern')">
              Please type "DELETE" to confirm
            </mat-error>
          </mat-form-field>
        </form>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="warn" (click)="onConfirm()" [disabled]="!confirmationForm.valid">
          Delete Account
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .delete-account-dialog {
      padding: 24px;
      max-width: 400px;
    }

    .warning-text {
      color: #FF3860;
      margin-bottom: 24px;
      line-height: 1.5;
    }

    .confirmation-form {
      margin-top: 16px;
    }

    mat-dialog-actions {
      margin-top: 24px;
      padding: 0;
    }

    ::ng-deep {
      .mat-mdc-form-field {
        width: 100%;
      }
    }
  `]
})
export class DeleteAccountDialogComponent {
  confirmationForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<DeleteAccountDialogComponent>,
    private fb: FormBuilder
  ) {
    this.confirmationForm = this.fb.group({
      confirmation: ['', [Validators.required, Validators.pattern(/^DELETE$/)]]
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    if (this.confirmationForm.valid) {
      this.dialogRef.close(true);
    }
  }
} 