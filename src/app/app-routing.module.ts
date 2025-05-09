import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home-page/home-page.component').then(m => m.HomePageComponent) },
  { path: 'auth/register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'auth/login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'auth/forgot-password', loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  { path: 'auth/reset-password', loadComponent: () => import('./features/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },
  { path: 'auth/verify-email', loadComponent: () => import('./features/auth/verify-email/verify-email.component').then(m => m.VerifyEmailComponent) },
  { path: 'profile', loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule) },
  { path: '**', redirectTo: '' }
]; 