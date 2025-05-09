import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProfileService } from '../../../core/services/profile.service';

@Component({
  selector: 'app-financial-goals',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatSliderModule,
    MatTooltipModule
  ],
  template: `
    <form [formGroup]="financialGoalsForm" (ngSubmit)="onSubmit()" class="financial-goals-form">
      <div class="form-section">
        <h2>Retirement Goals</h2>
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Target Retirement Age</mat-label>
            <input matInput type="number" formControlName="retirementAge" required min="45" max="85">
            <mat-error *ngIf="financialGoalsForm.get('retirementAge')?.hasError('required')">
              Retirement age is required
            </mat-error>
            <mat-error *ngIf="financialGoalsForm.get('retirementAge')?.hasError('min') || financialGoalsForm.get('retirementAge')?.hasError('max')">
              Age must be between 45 and 85
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Target Annual Retirement Income</mat-label>
            <span matPrefix>$&nbsp;</span>
            <input matInput type="number" formControlName="targetIncome" required min="0">
            <span matSuffix>.00</span>
            <mat-error *ngIf="financialGoalsForm.get('targetIncome')?.hasError('required')">
              Target income is required
            </mat-error>
            <mat-error *ngIf="financialGoalsForm.get('targetIncome')?.hasError('min')">
              Income must be positive
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Current Annual Income</mat-label>
            <span matPrefix>$&nbsp;</span>
            <input matInput type="number" formControlName="currentIncome" required min="0">
            <span matSuffix>.00</span>
            <mat-error *ngIf="financialGoalsForm.get('currentIncome')?.hasError('required')">
              Current income is required
            </mat-error>
            <mat-error *ngIf="financialGoalsForm.get('currentIncome')?.hasError('min')">
              Income must be positive
            </mat-error>
          </mat-form-field>
        </div>
      </div>

      <div class="form-section">
        <h2>Investment Preferences</h2>
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Risk Tolerance</mat-label>
            <input matInput type="number" formControlName="riskTolerance" min="1" max="10" step="1">
            <mat-error *ngIf="financialGoalsForm.get('riskTolerance')?.hasError('required')">
              Risk tolerance is required
            </mat-error>
            <mat-error *ngIf="financialGoalsForm.get('riskTolerance')?.hasError('min') || financialGoalsForm.get('riskTolerance')?.hasError('max')">
              Risk tolerance must be between 1 and 10
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Investment Strategy</mat-label>
            <mat-select formControlName="investmentStrategy" required>
              <mat-option value="conservative">Conservative</mat-option>
              <mat-option value="moderate">Moderate</mat-option>
              <mat-option value="aggressive">Aggressive</mat-option>
              <mat-option value="custom">Custom</mat-option>
            </mat-select>
            <mat-error *ngIf="financialGoalsForm.get('investmentStrategy')?.hasError('required')">
              Investment strategy is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Expected Annual Return</mat-label>
            <input matInput type="number" formControlName="expectedReturn" required min="0" max="20">
            <span matSuffix>%</span>
            <mat-error *ngIf="financialGoalsForm.get('expectedReturn')?.hasError('required')">
              Expected return is required
            </mat-error>
            <mat-error *ngIf="financialGoalsForm.get('expectedReturn')?.hasError('min') || financialGoalsForm.get('expectedReturn')?.hasError('max')">
              Return must be between 0% and 20%
            </mat-error>
          </mat-form-field>
        </div>
      </div>

      <div class="form-section">
        <h2>Additional Information</h2>
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Current Retirement Savings</mat-label>
            <span matPrefix>$&nbsp;</span>
            <input matInput type="number" formControlName="currentSavings" required min="0">
            <span matSuffix>.00</span>
            <mat-error *ngIf="financialGoalsForm.get('currentSavings')?.hasError('required')">
              Current savings is required
            </mat-error>
            <mat-error *ngIf="financialGoalsForm.get('currentSavings')?.hasError('min')">
              Savings must be positive
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Monthly Contribution</mat-label>
            <span matPrefix>$&nbsp;</span>
            <input matInput type="number" formControlName="monthlyContribution" required min="0">
            <span matSuffix>.00</span>
            <mat-error *ngIf="financialGoalsForm.get('monthlyContribution')?.hasError('required')">
              Monthly contribution is required
            </mat-error>
            <mat-error *ngIf="financialGoalsForm.get('monthlyContribution')?.hasError('min')">
              Contribution must be positive
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Employer Match</mat-label>
            <span matPrefix>$&nbsp;</span>
            <input matInput type="number" formControlName="employerMatch" required min="0">
            <span matSuffix>.00</span>
            <mat-error *ngIf="financialGoalsForm.get('employerMatch')?.hasError('required')">
              Employer match is required
            </mat-error>
            <mat-error *ngIf="financialGoalsForm.get('employerMatch')?.hasError('min')">
              Match must be positive
            </mat-error>
          </mat-form-field>
        </div>
      </div>

      <div class="form-actions">
        <button mat-button type="button" (click)="resetForm()">Reset</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!financialGoalsForm.valid || !financialGoalsForm.dirty">
          Save Changes
        </button>
      </div>
    </form>
  `,
  styles: [`
    .financial-goals-form {
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

    .slider-container {
      padding: 16px 0;
    }

    .slider-container label {
      display: block;
      margin-bottom: 8px;
      color: #2C3E50;
    }

    .slider-labels {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
      color: #2C3E50;
      font-size: 0.9rem;
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

      .mat-mdc-slider {
        width: 100%;
      }
    }

    @media (max-width: 768px) {
      .form-grid {
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
export class FinancialGoalsComponent implements OnInit {
  financialGoalsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private profileService: ProfileService
  ) {
    this.financialGoalsForm = this.fb.group({
      // Retirement Goals
      retirementAge: ['', [Validators.required, Validators.min(45), Validators.max(85)]],
      targetIncome: ['', [Validators.required, Validators.min(0)]],
      currentIncome: ['', [Validators.required, Validators.min(0)]],

      // Investment Preferences
      riskTolerance: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      investmentStrategy: ['moderate', Validators.required],
      expectedReturn: ['', [Validators.required, Validators.min(0), Validators.max(20)]],

      // Additional Information
      currentSavings: ['', [Validators.required, Validators.min(0)]],
      monthlyContribution: ['', [Validators.required, Validators.min(0)]],
      employerMatch: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.profileService.financialGoals$.subscribe((data) => {
      if (data) {
        const d = data as any;
        this.financialGoalsForm.patchValue({
          retirementAge: d.retirement_age,
          targetIncome: d.target_income,
          currentIncome: d.current_income,
          riskTolerance: d.risk_tolerance,
          investmentStrategy: d.investment_strategy,
          expectedReturn: d.expected_return,
          currentSavings: d.current_savings,
          monthlyContribution: d.monthly_contribution,
          employerMatch: d.employer_match
        });
      }
    });
  }

  async onSubmit() {
    if (this.financialGoalsForm.valid) {
      const formValue = this.financialGoalsForm.value;
      // Map camelCase to snake_case for DB
      const payload = {
        retirement_age: formValue.retirementAge,
        target_income: formValue.targetIncome,
        current_income: formValue.currentIncome,
        risk_tolerance: formValue.riskTolerance,
        investment_strategy: formValue.investmentStrategy,
        expected_return: formValue.expectedReturn,
        current_savings: formValue.currentSavings,
        monthly_contribution: formValue.monthlyContribution,
        employer_match: formValue.employerMatch
      };
      try {
        await this.profileService.updateFinancialGoals(payload);
        this.snackBar.open('Financial goals updated successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end'
        });
      } catch (error) {
        this.snackBar.open('Failed to update financial goals', 'Close', {
          duration: 5000,
          horizontalPosition: 'end'
        });
      }
    }
  }

  resetForm() {
    this.financialGoalsForm.reset();
    // TODO: Reset to last saved values
  }
}
