import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, RouterModule],
  template: `
    <mat-toolbar color="primary" class="app-header">
      <span class="logo">
        <span class="logo-ahead">ahead</span><span class="logo-ai">-ai</span>
      </span>
      <span class="spacer"></span>
      <nav>
        <a mat-button routerLink="/">Home</a>
        <a mat-button routerLink="/about">About</a>
        <a mat-button routerLink="/auth/login">Login</a>
        <a mat-button routerLink="/auth/register">Register</a>
      </nav>
    </mat-toolbar>
  `,
  styles: [`
    .app-header {
      height: 64px;
      background: #F8F9FA;
      color: #2C3E50;
      box-shadow: 0 2px 4px rgba(0,0,0,0.03);
    }
    .logo {
      font-family: 'Montserrat', 'Roboto', sans-serif;
      font-size: 2rem;
      font-weight: bold;
      letter-spacing: 1px;
      display: flex;
      align-items: center;
    }
    .logo-ahead {
      color: #3273DC;
    }
    .logo-ai {
      color: #00D1B2;
    }
    .spacer {
      flex: 1 1 auto;
    }
    nav a {
      color: #2C3E50;
      font-weight: 500;
      margin-left: 8px;
      text-transform: none;
      font-size: 1rem;
    }
    nav a:last-child {
      margin-right: 0;
    }
  `]
})
export class AppHeaderComponent {} 