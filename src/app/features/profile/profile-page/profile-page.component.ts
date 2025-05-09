import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { ProfileCompletenessComponent } from '../profile-completeness/profile-completeness.component';
import { RouterOutlet } from '@angular/router';
import { ProfileService } from '../../../core/services/profile.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [RouterOutlet, MatTabsModule, MatIconModule, ProfileCompletenessComponent],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <h1>Profile Management</h1>
        <app-profile-completeness [completeness]="completeness"></app-profile-completeness>
      </div>
      <mat-tab-group [selectedIndex]="selectedIndex" (selectedIndexChange)="onTabChange($event)" class="profile-tabs">
        <mat-tab label="Personal Information"></mat-tab>
        <mat-tab label="Financial Goals"></mat-tab>
        <mat-tab label="Account Settings"></mat-tab>
      </mat-tab-group>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    .profile-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .profile-header h1 {
      color: #2C3E50;
      font-size: 2rem;
      font-weight: 600;
      margin: 0;
    }

    .profile-tabs {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(50, 115, 220, 0.07);
    }

    .tab-icon {
      margin-right: 8px;
    }

    .tab-content {
      padding: 24px;
    }

    ::ng-deep {
      .mat-mdc-tab-header {
        --mdc-tab-indicator-active-indicator-color: #3273DC;
        --mat-tab-header-active-label-text-color: #3273DC;
        --mat-tab-header-active-ripple-color: #3273DC;
        --mat-tab-header-active-focus-label-text-color: #3273DC;
        --mat-tab-header-active-hover-label-text-color: #3273DC;
        --mat-tab-header-active-background-color: #fff;
      }

      .mat-mdc-tab {
        --mat-tab-header-active-label-text-color: #3273DC;
        --mat-tab-header-active-ripple-color: #3273DC;
        --mat-tab-header-active-focus-label-text-color: #3273DC;
        --mat-tab-header-active-hover-label-text-color: #3273DC;
        --mat-tab-header-active-background-color: #fff;
      }
    }

    @media (max-width: 768px) {
      .profile-container {
        padding: 16px;
      }

      .profile-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .profile-header h1 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class ProfilePageComponent {
  tabRoutes = ['personal', 'financial', 'account'];
  selectedIndex = 0;
  completeness = 0;

  constructor(private router: Router, private route: ActivatedRoute, private profileService: ProfileService) {
    this.route.url.subscribe(() => {
      const child = this.route.firstChild;
      if (child) {
        child.url.subscribe(url => {
          const path = url[0]?.path;
          this.selectedIndex = this.tabRoutes.indexOf(path ?? 'personal');
        });
      }
    });
    this.profileService.profileCompleteness$.subscribe(val => {
      this.completeness = val;
    });
  }

  onTabChange(index: number) {
    this.router.navigate([this.tabRoutes[index]], { relativeTo: this.route });
  }
}
