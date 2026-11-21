import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { Workout } from '../models/workout.model';
import { AuthService } from './auth.service';

interface ExternalPost { id: number; title: string; body: string; }
@Injectable({ providedIn: 'root' })
export class WorkoutService {
  private readonly endpoint = 'https://jsonplaceholder.typicode.com/posts';
  private readonly storageKey = 'fitflow-workouts';
  constructor(private http: HttpClient, private auth: AuthService) {}

  getAll(): Observable<Workout[]> {
    return this.http.get<ExternalPost[]>(this.endpoint).pipe(
      map(posts => posts.slice(0, 24).map(post => this.toWorkout(post))),
      map(remote => [...this.readLocal(), ...remote]),
      catchError(() => {
        const local = this.readLocal();
        return local.length ? of(local) : throwError(() => new Error('Не успяхме да заредим тренировките. Провери интернет връзката.'));
      })
    );
  }
  getById(id: number): Observable<Workout | undefined> {
    const local = this.readLocal().find(item => item.id === id);
    if (local) return of(local);
    return this.http.get<ExternalPost>(`${this.endpoint}/${id}`).pipe(map(post => this.toWorkout(post)), catchError(() => of(undefined)));
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
  private toWorkout(post: ExternalPost): Workout {
    return { id: post.id, title: post.title, description: post.body, category: 'Обща тренировка', level: post.id % 3 === 0 ? 'Advanced' : post.id % 2 === 0 ? 'Intermediate' : 'Beginner', duration: 30 + post.id % 5 * 10 };
  }
  private readLocal(): Workout[] { try { return JSON.parse(localStorage.getItem(this.storageKey) ?? '[]') as Workout[]; } catch { return []; } }
  private writeLocal(items: Workout[]): void { localStorage.setItem(this.storageKey, JSON.stringify(items)); }
}
