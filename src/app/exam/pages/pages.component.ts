import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Workout, AppUser } from '../models/workout.model';
import { AuthService } from '../services/auth.service';
import { WorkoutService } from '../services/workout.service';
import { LevelLabelPipe } from '../pipes/level-label.pipe';

@Component({ standalone: true, imports: [CommonModule, RouterLink], template: `
<section class="hero"><div><p class="eyebrow">MOVE • FEEL • GROW</p><h1>Твоята тренировка.<br><span>Твоят ритъм.</span></h1><p>Открий идеи за движение, създай личен план и следи любимите си тренировки.</p><a class="btn" routerLink="/catalog">Разгледай каталога</a></div></section>
<section class="features"><article><b>01</b><h3>Открий</h3><p>Разгледай тренировъчни идеи от външен API.</p></article><article><b>02</b><h3>Създай</h3><p>Добавяй и управлявай личните си тренировки.</p></article><article><b>03</b><h3>Постигай</h3><p>Изгради постоянство с движение всеки ден.</p></article></section>` })
export class HomePage {}

@Component({ standalone: true, imports: [CommonModule, RouterLink, LevelLabelPipe], template: `
<section class="page"><div class="page-head"><div><p class="eyebrow">LIBRARY</p><h1>Каталог тренировки</h1><p>Избери активност, която ти подхожда.</p></div><a class="btn" routerLink="/dashboard">+ Моя тренировка</a></div>
<div *ngIf="loading" class="notice">Зареждаме каталога…</div><div *ngIf="error" class="error">{{error}}</div>
<div class="cards"><article class="workout-card" *ngFor="let workout of workouts"><span class="tag">{{workout.level | levelLabel}}</span><h2>{{workout.title | titlecase}}</h2><p>{{workout.description}}</p><footer><span>{{workout.duration}} мин.</span><a [routerLink]="['/catalog', workout.id]">Детайли →</a></footer></article></div>
<div *ngIf="!loading && workouts.length === 0" class="notice">Няма налични тренировки.</div></section>` })
export class CatalogPage implements OnInit {
 workouts: Workout[]=[]; loading=true; error='';
 constructor(private service: WorkoutService) {}
 ngOnInit(): void { this.service.getAll().subscribe({ next: items => { this.workouts=items; this.loading=false; }, error: err => { this.error=err.message; this.loading=false; } }); }
}

@Component({ standalone: true, imports: [CommonModule, RouterLink, LevelLabelPipe], template: `
<section class="page narrow"><a routerLink="/catalog" class="back">← Назад към каталога</a><div *ngIf="workout"><p class="eyebrow">WORKOUT DETAILS</p><span class="tag">{{workout.level | levelLabel}}</span><h1>{{workout.title | titlecase}}</h1><p class="lead">{{workout.description}}</p><div class="detail-stats"><span>⏱ {{workout.duration}} минути</span><span>✦ {{workout.category}}</span></div><a class="btn" routerLink="/dashboard">Добави своя тренировка</a></div><p *ngIf="error" class="error">{{error}}</p></section>` })
export class DetailsPage implements OnInit {
 workout?: Workout; error='';
 constructor(private route: ActivatedRoute, private service: WorkoutService) {}
 ngOnInit(): void { const id=Number(this.route.snapshot.paramMap.get('id')); this.service.getById(id).subscribe(item => { this.workout=item; if (!item) this.error='Тренировката не е намерена.'; }); }
}

@Component({ standalone: true, imports: [CommonModule, ReactiveFormsModule, RouterLink], template: `
<section class="page narrow auth"><p class="eyebrow">YOUR ACCOUNT</p><h1>{{registerMode ? 'Създай профил' : 'Добре дошла обратно'}}</h1><p>Влез, за да управляваш собствените си тренировки.</p>
<form [formGroup]="form" (ngSubmit)="submit()"><label *ngIf="registerMode">Име<input formControlName="name" placeholder="Твоето име"></label><label>Имейл<input type="email" formControlName="email" placeholder="name@example.com"></label><label>Парола<input type="password" formControlName="password" placeholder="Минимум 6 символа"></label>
<p class="error" *ngIf="error">{{error}}</p><button class="btn" [disabled]="form.invalid">{{registerMode ? 'Регистрация' : 'Вход'}}</button></form><p>{{registerMode ? 'Вече имаш профил?' : 'Нямаш профил?'}} <a [routerLink]="registerMode ? '/login' : '/register'">{{registerMode ? 'Влез' : 'Регистрирай се'}}</a></p><small>Демо фронтенд профил: данните се пазят локално в браузъра.</small></section>` })
export class AuthPage {
 registerMode: boolean; error=''; private fb=inject(FormBuilder); private auth=inject(AuthService); private router=inject(Router);
 form=this.fb.group({name:['', [Validators.required, Validators.minLength(2)]], email:['', [Validators.required, Validators.email]], password:['', [Validators.required, Validators.minLength(6)]]});
 constructor(route: ActivatedRoute) {
  this.registerMode=route.snapshot.data['register'] === true;
  if (!this.registerMode) {
    this.form.controls.name.clearValidators();
    this.form.controls.name.updateValueAndValidity();
  }
}
 submit(): void {
  if(this.form.invalid) { this.form.markAllAsTouched(); this.error='Моля, попълни правилно всички полета.'; return; }
  const v=this.form.getRawValue();
  const request=this.registerMode ? this.auth.register(v.name ?? '', v.email ?? '', v.password ?? '') : this.auth.login(v.email ?? '', v.password ?? '');
  request.subscribe({next:()=>this.router.navigate(['/dashboard']), error:e=>this.error=e.message});
 }
}

@Component({ standalone: true, imports: [CommonModule, ReactiveFormsModule, RouterLink], template: `
<section class="page"><div class="page-head"><div><p class="eyebrow">PERSONAL SPACE</p><h1>Моите тренировки</h1><p>Добавяй, редактирай или премахвай собствените си записи.</p></div><button class="btn" (click)="newItem()">+ Нова тренировка</button></div>
<form *ngIf="editing" class="editor" [formGroup]="form" (ngSubmit)="save()"><h2>{{editingId ? 'Редакция' : 'Нова тренировка'}}</h2><label>Заглавие<input formControlName="title"></label><label>Описание<textarea formControlName="description" rows="3"></textarea></label><div class="form-row"><label>Категория<input formControlName="category"></label><label>Ниво<select formControlName="level"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label><label>Минути<input type="number" formControlName="duration"></label></div><p class="error">{{error}}</p><button class="btn" [disabled]="form.invalid">Запази</button><button type="button" class="text-btn" (click)="editing=false">Отказ</button></form>
<div class="cards"><article class="workout-card" *ngFor="let item of mine"><span class="tag">{{item.duration}} мин.</span><h2>{{item.title}}</h2><p>{{item.description}}</p><footer><button (click)="edit(item)">Редактирай</button><button class="danger" (click)="remove(item.id)">Изтрий</button></footer></article></div><p *ngIf="mine.length===0 && !editing" class="notice">Все още нямаш собствени тренировки. Създай първата си!</p></section>` })
export class DashboardPage implements OnInit {
 mine: Workout[]=[]; editing=false; editingId?:number; error='';
 private fb=inject(FormBuilder); private service=inject(WorkoutService); private auth=inject(AuthService);
 form=this.fb.group({title:['',[Validators.required,Validators.minLength(3)]],description:['',[Validators.required,Validators.minLength(10)]],category:['Фитнес',[Validators.required]],level:['Beginner' as Workout['level'],Validators.required],duration:[30,[Validators.required,Validators.min(5),Validators.max(240)]]});
 ngOnInit(): void { this.refresh(); }
 refresh(): void { this.service.getAll().subscribe({next:items=>this.mine=items.filter(item=>item.ownerId===this.auth.currentUser?.id)}); }
 newItem(): void { this.editingId=undefined; this.form.reset({title:'',description:'',category:'Фитнес',level:'Beginner',duration:30}); this.editing=true; }
 edit(item: Workout): void { this.editingId=item.id; this.form.patchValue(item); this.editing=true; }
 save(): void { if(this.form.invalid){this.form.markAllAsTouched();this.error='Провери задължителните полета и ограниченията.';return;} const value=this.form.getRawValue() as Omit<Workout,'id'>; const action=this.editingId ? this.service.update(this.editingId,value) : this.service.create(value); action.subscribe({next:()=>{this.editing=false;this.error='';this.refresh();},error:e=>this.error=e.message}); }
 remove(id:number): void { if(confirm('Сигурна ли си, че искаш да изтриеш тренировката?')) this.service.delete(id).subscribe({next:()=>this.refresh(),error:e=>this.error=e.message}); }
}
