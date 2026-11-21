import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { AppUser } from '../models/workout.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'fitflow-user';
  private readonly userSubject = new BehaviorSubject<AppUser | null>(this.readUser());
  user$ = this.userSubject.asObservable();

  get currentUser(): AppUser | null { return this.userSubject.value; }
  get isLoggedIn(): boolean { return !!this.currentUser; }

  register(name: string, email: string, password: string): Observable<AppUser> {
    const users = this.readUsers();
    if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
      return throwError(() => new Error('Този имейл вече е регистриран.'));
    }
    const user: AppUser = { id: crypto.randomUUID(), email, displayName: name };
    users.push({ ...user, password });
    localStorage.setItem('fitflow-users', JSON.stringify(users));
    this.saveSession(user);
    return of(user);
  }

  login(email: string, password: string): Observable<AppUser> {
    const match = this.readUsers().find(user => user.email.toLowerCase() === email.toLowerCase() && user.password === password);
    if (!match) return throwError(() => new Error('Невалиден имейл или парола.'));
    const user: AppUser = { id: match.id, email: match.email, displayName: match.displayName };
    this.saveSession(user);
    return of(user);
  }

  logout(): void { localStorage.removeItem(this.storageKey); this.userSubject.next(null); }
  private saveSession(user: AppUser): void { localStorage.setItem(this.storageKey, JSON.stringify(user)); this.userSubject.next(user); }
  private readUser(): AppUser | null {
    try { const value = localStorage.getItem(this.storageKey); return value ? JSON.parse(value) as AppUser : null; } catch { return null; }
  }
  private readUsers(): Array<AppUser & { password: string }> {
    try { return JSON.parse(localStorage.getItem('fitflow-users') ?? '[]') as Array<AppUser & { password: string }>; } catch { return []; }
  }
}
