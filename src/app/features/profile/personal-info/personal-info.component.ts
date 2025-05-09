import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ProfileService } from '../../../core/services/profile.service';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatSlideToggleModule
  ],
  template: `
    <form [formGroup]="personalInfoForm" (ngSubmit)="onSubmit()" class="personal-info-form">
      <div class="form-section">
        <h2>Basic Information</h2>
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>First Name</mat-label>
            <input matInput formControlName="first_name" required>
            <mat-error *ngIf="personalInfoForm.get('first_name')?.hasError('required')">
              First name is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Last Name</mat-label>
            <input matInput formControlName="last_name" required>
            <mat-error *ngIf="personalInfoForm.get('last_name')?.hasError('required')">
              Last name is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Date of Birth</mat-label>
            <input matInput [matDatepicker]="dobPicker" formControlName="date_of_birth" required>
            <mat-datepicker-toggle matSuffix [for]="dobPicker"></mat-datepicker-toggle>
            <mat-datepicker #dobPicker></mat-datepicker>
            <mat-error *ngIf="personalInfoForm.get('date_of_birth')?.hasError('required')">
              Date of birth is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Gender</mat-label>
            <mat-select formControlName="gender">
              <mat-option value="male">Male</mat-option>
              <mat-option value="female">Female</mat-option>
              <mat-option value="other">Other</mat-option>
              <mat-option value="prefer-not-to-say">Prefer not to say</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </div>

      <div class="form-section">
        <h2>Contact Information</h2>
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email" required>
            <mat-error *ngIf="personalInfoForm.get('email')?.hasError('required')">
              Email is required
            </mat-error>
            <mat-error *ngIf="personalInfoForm.get('email')?.hasError('email')">
              Please enter a valid email address
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Phone Number</mat-label>
            <input matInput formControlName="phone" type="tel">
            <mat-error *ngIf="personalInfoForm.get('phone')?.hasError('pattern')">
              Please enter a valid phone number
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Address</mat-label>
            <input matInput formControlName="address" required>
            <mat-error *ngIf="personalInfoForm.get('address')?.hasError('required')">
              Address is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>City</mat-label>
            <input matInput formControlName="city" required>
            <mat-error *ngIf="personalInfoForm.get('city')?.hasError('required')">
              City is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>State</mat-label>
            <input matInput formControlName="state" required>
            <mat-error *ngIf="personalInfoForm.get('state')?.hasError('required')">
              State is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>ZIP Code</mat-label>
            <input matInput formControlName="zip_code" required>
            <mat-error *ngIf="personalInfoForm.get('zip_code')?.hasError('required')">
              ZIP code is required
            </mat-error>
            <mat-error *ngIf="personalInfoForm.get('zip_code')?.hasError('pattern')">
              Please enter a valid ZIP code
            </mat-error>
          </mat-form-field>
        </div>
      </div>

      <div class="form-section">
        <h2>Communication Preferences</h2>
        <div class="preferences-grid">
          <mat-slide-toggle formControlName="email_notifications">
            Email Notifications
          </mat-slide-toggle>
          <mat-slide-toggle formControlName="sms_notifications">
            SMS Notifications
          </mat-slide-toggle>
          <mat-slide-toggle formControlName="marketing_emails">
            Marketing Emails
          </mat-slide-toggle>
        </div>
      </div>

      <div class="form-actions">
        <button mat-button type="button" (click)="resetForm()">Reset</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!personalInfoForm.valid || !personalInfoForm.dirty">
          Save Changes
        </button>
      </div>
    </form>
  `,
  styles: [`
    .personal-info-form {
      max-width: 800px;
      margin: 0 auto;
    }

    .form-section {
      margin-bottom: 32px;
    }

    .form-section h2 {
      color: #2C3E50;
      font-size: 1.5rem;
      margin-bottom: 24px;
      font-weight: 500;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }

    .preferences-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 32px;
    }

    ::ng-deep {
      .mat-mdc-form-field {
        width: 100%;
      }

      .mat-mdc-slide-toggle {
        margin: 8px 0;
      }
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }

      .preferences-grid {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }

      .form-actions button {
        width: 100%;
      }
    }
  `]
})
export class PersonalInfoComponent implements OnInit {
  personalInfoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private profileService: ProfileService
  ) {
    this.personalInfoForm = this.fb.group({
      // Basic Information
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      gender: [''],

      // Contact Information
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip_code: ['', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]],

      // Communication Preferences
      email_notifications: [true],
      sms_notifications: [false],
      marketing_emails: [false]
    });
  }

  ngOnInit() {
    this.profileService.personalInfo$.subscribe((data) => {
      if (data) {
        const d = data as any;
        this.personalInfoForm.patchValue({
          first_name: d.first_name,
          last_name: d.last_name,
          date_of_birth: d.date_of_birth,
          gender: d.gender,
          email: d.email,
          phone: d.phone,
          address: d.address,
          city: d.city,
          state: d.state,
          zip_code: d.zip_code,
          email_notifications: d.email_notifications,
          sms_notifications: d.sms_notifications,
          marketing_emails: d.marketing_emails
        });
      }
    });
  }

  async onSubmit() {
    if (this.personalInfoForm.valid) {
      try {
        await this.profileService.updatePersonalInfo(this.personalInfoForm.value);
        this.snackBar.open('Profile updated successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end'
        });
      } catch (error) {
        this.snackBar.open('Failed to update profile', 'Close', {
          duration: 5000,
          horizontalPosition: 'end'
        });
      }
    }
  }

  resetForm() {
    this.personalInfoForm.reset();
    // TODO: Reset to last saved values
  }
}
