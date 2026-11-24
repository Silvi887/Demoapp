import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, shareReplay, throwError } from 'rxjs';
import { Workout, WorkoutLevel } from '../models/workout.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class WorkoutService {
  private readonly endpoint = 'data/workouts.json';
  private readonly storageKey = 'fitflow-workouts';
  private catalog$?: Observable<Workout[]>;
  constructor(private http: HttpClient, private auth: AuthService) {}

  getAll(): Observable<Workout[]> {
    return this.loadCatalog().pipe(
      map(remote => [...this.readLocal(), ...remote]),
      catchError(() => {
        const local = this.readLocal();
        return local.length ? of(local) : throwError(() => new Error('Не успяхме да заредим тренировките. Провери интернет връзката.'));
      })
    );
  }
  getByLevel(level: WorkoutLevel): Observable<Workout[]> {
    return this.getAll().pipe(map(items => items.filter(item => item.level === level)));
  }
  getById(id: number): Observable<Workout | undefined> {
    const local = this.readLocal().find(item => item.id === id);
    if (local) return of(local);
    return this.loadCatalog().pipe(map(items => items.find(item => item.id === id)), catchError(() => of(undefined)));
  }
  create(input: Omit<Workout, 'id'>): Observable<Workout> {
    if (!this.auth.currentUser) return throwError(() => new Error('Трябва да влезеш в профила си.'));
    const workout: Workout = { ...input, id: Date.now(), ownerId: this.auth.currentUser.id, isLocal: true };
    this.writeLocal([...this.readLocal(), workout]); return of(workout);
  }
  update(id: number, input: Omit<Workout, 'id'>): Observable<Workout> {
    const current = this.readLocal();
    const index = current.findIndex(item => item.id === id && item.ownerId === this.auth.currentUser?.id);
    if (index < 0) return throwError(() => new Error('Можеш да редактираш само собствените си записи.'));
    const updated: Workout = { ...current[index], ...input, id };
    current[index] = updated; this.writeLocal(current); return of(updated);
  }
  delete(id: number): Observable<void> {
    const current = this.readLocal();
    const item = current.find(workout => workout.id === id);
    if (!item || item.ownerId !== this.auth.currentUser?.id) return throwError(() => new Error('Можеш да изтриваш само собствените си записи.'));
    this.writeLocal(current.filter(workout => workout.id !== id)); return of(void 0);
  }
  private loadCatalog(): Observable<Workout[]> {
    if (!this.catalog$) {
      this.catalog$ = this.http.get<Workout[]>(this.endpoint).pipe(shareReplay(1));
    }
    return this.catalog$;
  }
  private readLocal(): Workout[] { try { return JSON.parse(localStorage.getItem(this.storageKey) ?? '[]') as Workout[]; } catch { return []; } }
  private writeLocal(items: Workout[]): void { localStorage.setItem(this.storageKey, JSON.stringify(items)); }
}
