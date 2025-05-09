import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { SupabaseService } from '../../services/supabase.service';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatSnackBarModule,
    MatDividerModule,
    MatSidenavModule,
    MatListModule
  ],
  template: `
    <mat-toolbar color="primary" class="header">
      <div class="header-content">
        <div class="left-section">
          <button mat-icon-button (click)="toggleMobileMenu()" class="menu-button" *ngIf="isMobile$ | async">
            <mat-icon>menu</mat-icon>
          </button>
          <a routerLink="/" class="logo" aria-label="Go to home page">
            <svg width="260" height="48" viewBox="0 0 260 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="logo-svg">
              <!-- Bar chart and upward arrow icon -->
              <g>
                <!-- Bars -->
                <rect x="6" y="22" width="14" height="20" rx="2" fill="#6FCF97"/>
                <rect x="28" y="14" width="14" height="28" rx="2" fill="#6FCF97"/>
                <rect x="50" y="6" width="14" height="36" rx="2" fill="#6FCF97"/>
                <!-- Upward arrow -->
                <polyline points="6,42 22,30 36,36 54,14" fill="none" stroke="#222" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                <polygon points="50,10 58,10 54,6" fill="#222"/>
              </g>
              <!-- Wordmark -->
              <text x="80" y="36" font-family="Sora, Arial, sans-serif" font-size="32" font-weight="700" letter-spacing="1">
                <tspan fill="#1A2A4F">Ahead</tspan><tspan fill="#00D1B2">Ai</tspan>
              </text>
            </svg>
          </a>
        </div>

        <nav class="nav-links" *ngIf="isAuthenticated && !(isMobile$ | async)">
          <a mat-button routerLink="/dashboard" routerLinkActive="active">
            <mat-icon>dashboard</mat-icon>
            Dashboard
          </a>
          <a mat-button routerLink="/profile" routerLinkActive="active">
            <mat-icon>person</mat-icon>
            Profile
          </a>
          <a mat-button routerLink="/retirement" routerLinkActive="active">
            <mat-icon>account_balance</mat-icon>
            Retirement
          </a>
          <a mat-button routerLink="/insights" routerLinkActive="active">
            <mat-icon>insights</mat-icon>
            Insights
          </a>
          <a mat-button routerLink="/documents" routerLinkActive="active">
            <mat-icon>upload_file</mat-icon>
            Documents
          </a>
        </nav>

        <div class="auth-section">
          <ng-container *ngIf="!isAuthenticated; else authenticatedMenu">
            <a mat-button routerLink="/auth/login" class="login-button">Login</a>
            <a mat-raised-button color="accent" routerLink="/auth/register" class="register-button">Register</a>
          </ng-container>

          <ng-template #authenticatedMenu>
            <button mat-icon-button [matMenuTriggerFor]="userMenu" aria-label="User menu" class="user-menu-button">
              <mat-icon>account_circle</mat-icon>
            </button>
            <mat-menu #userMenu="matMenu" class="user-menu">
              <button mat-menu-item routerLink="/profile">
                <mat-icon>person</mat-icon>
                <span>My Profile</span>
              </button>
              <button mat-menu-item routerLink="/profile/settings">
                <mat-icon>settings</mat-icon>
                <span>Settings</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="onLogout()">
                <mat-icon>exit_to_app</mat-icon>
                <span>Logout</span>
              </button>
            </mat-menu>
          </ng-template>
        </div>
      </div>
    </mat-toolbar>

    <!-- Mobile Navigation Drawer -->
    <mat-sidenav-container class="mobile-nav-container" *ngIf="isMobile$ | async">
      <mat-sidenav #mobileNav mode="over" position="start" [opened]="mobileMenuOpen" (closed)="mobileMenuOpen = false">
        <div class="mobile-nav-header">
          <img src="assets/images/logo.png" alt="Ahead AI Logo" class="mobile-logo">
          <span>Ahead AI</span>
        </div>
        <mat-nav-list *ngIf="isAuthenticated">
          <a mat-list-item routerLink="/dashboard" (click)="closeMobileMenu()">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/profile" (click)="closeMobileMenu()">
            <mat-icon matListItemIcon>person</mat-icon>
            <span matListItemTitle>Profile</span>
          </a>
          <a mat-list-item routerLink="/retirement" (click)="closeMobileMenu()">
            <mat-icon matListItemIcon>account_balance</mat-icon>
            <span matListItemTitle>Retirement</span>
          </a>
          <a mat-list-item routerLink="/insights" (click)="closeMobileMenu()">
            <mat-icon matListItemIcon>insights</mat-icon>
            <span matListItemTitle>Insights</span>
          </a>
          <a mat-list-item routerLink="/documents" (click)="closeMobileMenu()">
            <mat-icon matListItemIcon>upload_file</mat-icon>
            <span matListItemTitle>Documents</span>
          </a>
          <mat-divider></mat-divider>
          <a mat-list-item routerLink="/profile/settings" (click)="closeMobileMenu()">
            <mat-icon matListItemIcon>settings</mat-icon>
            <span matListItemTitle>Settings</span>
          </a>
          <a mat-list-item (click)="onLogout(); closeMobileMenu()">
            <mat-icon matListItemIcon>exit_to_app</mat-icon>
            <span matListItemTitle>Logout</span>
          </a>
        </mat-nav-list>
        <mat-nav-list *ngIf="!isAuthenticated">
          <a mat-list-item routerLink="/auth/login" (click)="closeMobileMenu()">
            <mat-icon matListItemIcon>login</mat-icon>
            <span matListItemTitle>Login</span>
          </a>
          <a mat-list-item routerLink="/auth/register" (click)="closeMobileMenu()">
            <mat-icon matListItemIcon>person_add</mat-icon>
            <span matListItemTitle>Register</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
    </mat-sidenav-container>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      background: linear-gradient(to right, #3273DC, #00D1B2);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 16px;
      height: 64px;
    }

    .left-section {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .menu-button {
      margin-right: 8px;
    }

    .logo {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: inherit;
      transition: opacity 0.2s;
    }

    .logo:hover {
      opacity: 0.9;
    }

    .logo-image {
      height: 32px;
      margin-right: 8px;
    }

    .logo-text {
      font-size: 1.5rem;
      font-weight: 500;
      letter-spacing: 0.5px;
    }

    .nav-links {
      display: flex;
      gap: 8px;
      margin: 0 32px;
    }

    .nav-links a {
      display: flex;
      align-items: center;
      gap: 4px;
      transition: background-color 0.2s;
    }

    .auth-section {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .login-button, .register-button {
      transition: all 0.2s;
    }

    .register-button {
      background-color: #FFB74D;
    }

    .register-button:hover {
      background-color: #FFA726;
    }

    .user-menu-button {
      transition: transform 0.2s;
    }

    .user-menu-button:hover {
      transform: scale(1.1);
    }

    .active {
      background: rgba(255, 255, 255, 0.15);
    }

    /* Mobile Navigation Styles */
    .mobile-nav-container {
      position: fixed;
      top: 64px;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 999;
    }

    .mobile-nav-header {
      display: flex;
      align-items: center;
      padding: 16px;
      background: linear-gradient(to right, #3273DC, #00D1B2);
      color: white;
    }

    .mobile-logo {
      height: 32px;
      margin-right: 12px;
    }

    ::ng-deep {
      .mat-mdc-sidenav {
        width: 280px;
        background-color: white;
      }

      .mat-mdc-list-item {
        height: 48px;
      }

      .mat-mdc-menu-panel {
        min-width: 200px;
      }

      .mat-mdc-menu-item {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }

    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }

      .logo-text {
        display: none;
      }

      .header-content {
        padding: 0 8px;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  mobileMenuOpen = false;
  isMobile$;

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver
  ) {
    this.isMobile$ = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
      .pipe(map(result => result.matches));
  }

  ngOnInit() {
    this.supabase.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  async onLogout() {
    try {
      await this.supabase.signOut();
      this.router.navigate(['/auth/login']);
      this.snackBar.open('Logged out successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'end'
      });
    } catch (error) {
      this.snackBar.open('Error logging out', 'Close', {
        duration: 3000,
        horizontalPosition: 'end'
      });
    }
  }
} 