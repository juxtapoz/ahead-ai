import { Component } from '@angular/core';
import { AppFooterComponent } from '../../components/app-footer/app-footer.component';
import { FeatureCardComponent } from '../../components/feature-card/feature-card.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [AppFooterComponent, FeatureCardComponent, MatIconModule],
  template: `
    <main class="home-main">
      <section class="hero-section">
        <div class="hero-left">
          <h1>Plan Your Retirement with Confidence</h1>
          <p class="hero-desc">Ahead-AI helps you visualize, optimize, and achieve your financial goals with smart, secure, and personalized planning tools.</p>
          <button mat-raised-button color="primary" class="cta-btn">Get Started</button>
        </div>
        <div class="hero-right">
          <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" alt="Retirement Planning" class="hero-img" />
        </div>
      </section>
      <section class="features-section">
        <feature-card
          title="Personalized Projections"
          description="AI-driven forecasts tailored to your unique goals and lifestyle."
        >
          <span icon><mat-icon style="font-size:2.5rem;color:#3273DC;">insights</mat-icon></span>
        </feature-card>
        <feature-card
          title="Secure & Private"
          description="Your data is encrypted and never sold. Privacy and security are our top priorities."
        >
          <span icon><mat-icon style="font-size:2.5rem;color:#00D1B2;">lock</mat-icon></span>
        </feature-card>
        <feature-card
          title="Actionable Guidance"
          description="Get clear, actionable steps and recommendations to stay on track."
        >
          <span icon><mat-icon style="font-size:2.5rem;color:#FFB74D;">trending_up</mat-icon></span>
        </feature-card>
      </section>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    .home-main {
      background: #F8F9FA;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: stretch;
    }
    .hero-section {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      padding: 48px 0 32px 0;
      max-width: 1200px;
      margin: 0 auto;
      gap: 32px;
    }
    .hero-left {
      flex: 1 1 320px;
      max-width: 400px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      justify-content: center;
    }
    .hero-left h1 {
      font-size: 2.5rem;
      color: #3273DC;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .hero-desc {
      color: #2C3E50;
      font-size: 1.2rem;
      margin-bottom: 16px;
    }
    .cta-btn {
      font-size: 1.1rem;
      padding: 12px 32px;
      background: #3273DC;
      color: #fff;
      border-radius: 24px;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(50, 115, 220, 0.07);
    }
    .hero-right {
      flex: 2 1 400px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 320px;
    }
    .hero-img {
      width: 100%;
      max-width: 480px;
      border-radius: 18px;
      box-shadow: 0 4px 24px rgba(50, 115, 220, 0.10);
      object-fit: cover;
    }
    .features-section {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 32px;
      margin: 48px auto 0 auto;
      max-width: 1200px;
      width: 100%;
    }
    @media (max-width: 900px) {
      .hero-section {
        flex-direction: column;
        gap: 24px;
        padding: 32px 0 16px 0;
      }
      .hero-left, .hero-right {
        max-width: 100%;
      }
      .features-section {
        flex-direction: column;
        gap: 24px;
        margin-top: 32px;
      }
    }
  `]
})
export class HomePageComponent {} 