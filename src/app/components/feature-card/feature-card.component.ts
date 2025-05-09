import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'feature-card',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <mat-card class="feature-card">
      <div class="icon-container">
        <ng-content select="[icon]"></ng-content>
      </div>
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </mat-card>
  `,
  styles: [`
    .feature-card {
      background: #fff;
      color: #2C3E50;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(50, 115, 220, 0.07);
      padding: 32px 24px 24px 24px;
      text-align: center;
      min-width: 220px;
      max-width: 340px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    .icon-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 56px;
      width: 56px;
      margin-bottom: 12px;
    }
    .icon-container ::ng-deep .mat-icon, .icon-container svg {
      width: 40px !important;
      height: 40px !important;
      font-size: 40px !important;
      display: block;
    }
    h3 {
      margin: 0 0 8px 0;
      font-size: 1.3rem;
      color: #3273DC;
      font-weight: 600;
    }
    p {
      margin: 0;
      color: #2C3E50;
      font-size: 1rem;
    }
  `]
})
export class FeatureCardComponent {
  @Input() title = '';
  @Input() description = '';
} 