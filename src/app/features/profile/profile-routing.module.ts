import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilePageComponent } from './profile-page/profile-page.component';

const routes: Routes = [
  {
    path: '',
    component: ProfilePageComponent,
    children: [
      {
        path: 'personal',
        loadComponent: () => import('./personal-info/personal-info.component').then(m => m.PersonalInfoComponent)
      },
      {
        path: 'financial',
        loadComponent: () => import('./financial-goals/financial-goals.component').then(m => m.FinancialGoalsComponent)
      },
      {
        path: 'account',
        loadComponent: () => import('./account-settings/account-settings.component').then(m => m.AccountSettingsComponent)
      },
      {
        path: '',
        redirectTo: 'personal',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
