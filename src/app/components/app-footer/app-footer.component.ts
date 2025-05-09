import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  template: `
    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-grid">
          <!-- Company Info -->
          <div class="footer-section">
            <h3>Ahead-AI</h3>
            <p class="company-desc">Empowering your financial future with AI-driven retirement planning solutions.</p>
            <div class="social-links">
              <a href="https://twitter.com" target="_blank" aria-label="Twitter">
                <mat-icon>twitter</mat-icon>
              </a>
              <a href="https://linkedin.com" target="_blank" aria-label="LinkedIn">
                <mat-icon>linkedin</mat-icon>
              </a>
              <a href="https://facebook.com" target="_blank" aria-label="Facebook">
                <mat-icon>facebook</mat-icon>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a routerLink="/">Home</a></li>
              <li><a routerLink="/auth/login">Login</a></li>
              <li><a routerLink="/auth/register">Register</a></li>
              <li><a routerLink="/profile/financial">Financial Profile</a></li>
            </ul>
          </div>

          <!-- Resources -->
          <div class="footer-section">
            <h3>Resources</h3>
            <ul>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Financial Calculators</a></li>
              <li><a href="#">Market Insights</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div class="footer-section">
            <h3>Contact Us</h3>
            <ul class="contact-info">
              <li>
                <mat-icon>location_on</mat-icon>
                <span>123 Financial District<br>San Francisco, CA 94111</span>
              </li>
              <li>
                <mat-icon>phone</mat-icon>
                <span>(555) 123-4567</span>
              </li>
              <li>
                <mat-icon>email</mat-icon>
                <span>support&#64;ahead-ai.com</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="footer-bottom">
          <div class="legal-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
            <a href="#">GDPR</a>
          </div>
          <div class="copyright">&copy; {{year}} Ahead-AI. All rights reserved.</div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .app-footer {
      background: #F8F9FA;
      color: #2C3E50;
      padding: 48px 0 24px 0;
      font-size: 1rem;
      border-top: 1px solid #e0e0e0;
      margin-top: 48px;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 40px;
      margin-bottom: 48px;
    }

    .footer-section h3 {
      color: #3273DC;
      font-size: 1.2rem;
      margin-bottom: 16px;
      font-weight: 600;
    }

    .company-desc {
      color: #2C3E50;
      margin-bottom: 16px;
      line-height: 1.5;
    }

    .social-links {
      display: flex;
      gap: 16px;
    }

    .social-links a {
      color: #3273DC;
      transition: color 0.2s;
    }

    .social-links a:hover {
      color: #00D1B2;
    }

    .footer-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-section ul li {
      margin-bottom: 12px;
    }

    .footer-section ul li a {
      color: #2C3E50;
      text-decoration: none;
      transition: color 0.2s;
    }

    .footer-section ul li a:hover {
      color: #3273DC;
    }

    .contact-info li {
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }

    .contact-info mat-icon {
      color: #3273DC;
      font-size: 1.2rem;
      width: 1.2rem;
      height: 1.2rem;
    }

    .footer-bottom {
      border-top: 1px solid #e0e0e0;
      padding-top: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .legal-links {
      display: flex;
      gap: 24px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .legal-links a {
      color: #2C3E50;
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.2s;
    }

    .legal-links a:hover {
      color: #3273DC;
    }

    .copyright {
      color: #2C3E50;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 32px;
      }

      .footer-section {
        text-align: center;
      }

      .social-links {
        justify-content: center;
      }

      .contact-info li {
        justify-content: center;
      }

      .legal-links {
        gap: 16px;
      }
    }
  `]
})
export class AppFooterComponent {
  year = new Date().getFullYear();
} 