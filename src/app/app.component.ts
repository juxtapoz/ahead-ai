import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header></app-header>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .main-content {
      margin-top: 64px; /* Height of the header */
      min-height: calc(100vh - 64px);
      padding: 24px;
      background-color: #F8F9FA;
    }
  `]
})
export class AppComponent {
  title = 'Ahead AI';
}
