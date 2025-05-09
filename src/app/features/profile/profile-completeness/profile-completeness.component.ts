import { Component, Input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-profile-completeness',
  standalone: true,
  imports: [MatProgressBarModule, MatTooltipModule],
  template: `
    <div class="completeness-container" matTooltip="Complete your profile to get better retirement planning recommendations">
      <div class="completeness-label">
        <span>Profile Completeness</span>
        <span class="percentage">{{completeness}}%</span>
      </div>
      <mat-progress-bar
        mode="determinate"
        [value]="completeness"
        [color]="completenessColor"
        class="completeness-bar">
      </mat-progress-bar>
    </div>
  `,
  styles: [`
    .completeness-container {
      background: #fff;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(50, 115, 220, 0.07);
      min-width: 200px;
    }

    .completeness-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      color: #2C3E50;
      font-size: 0.9rem;
    }

    .percentage {
      font-weight: 600;
      color: #3273DC;
    }

    .completeness-bar {
      height: 8px;
      border-radius: 4px;
    }

    ::ng-deep {
      .mat-mdc-progress-bar-fill::after {
        background-color: #3273DC;
      }
    }
  `]
})
export class ProfileCompletenessComponent {
  @Input() completeness = 0;

  get completenessColor(): string {
    if (this.completeness >= 80) return 'primary';
    if (this.completeness >= 50) return 'accent';
    return 'warn';
  }
}
