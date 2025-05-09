import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from '@supabase/supabase-js';
import { SupabaseService } from '../services/supabase.service';

export interface AuthResponse {
  user: User;
  session: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private supabaseService: SupabaseService) {
    // Initialize current user from session
    this.supabaseService.currentUser$.subscribe((user: User | null) => {
      this.currentUserSubject.next(user);
    });
  }

  register(email: string, password: string): Observable<any> {
    return from(this.supabaseService.signUp(email, password));
  }

  login(email: string, password: string): Observable<any> {
    return from(this.supabaseService.signIn(email, password)).pipe(
      tap(response => {
        if (response.user) {
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  loginWithGoogle(): Observable<any> {
    return from(this.supabaseService.signInWithGoogle());
  }

  loginWithApple(): Observable<any> {
    return from(this.supabaseService.signInWithApple());
  }

  logout(): Observable<any> {
    return from(this.supabaseService.signOut()).pipe(
      tap(() => {
        this.currentUserSubject.next(null);
      })
    );
  }

  resetPassword(email: string): Observable<any> {
    return from(this.supabaseService.resetPassword(email));
  }

  updatePassword(newPassword: string): Observable<any> {
    return from(this.supabaseService.updatePassword(newPassword));
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => !!user)
    );
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }
} 