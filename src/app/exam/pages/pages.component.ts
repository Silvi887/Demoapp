import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Workout, AppUser, LEVELS, LevelInfo } from '../models/workout.model';
import { AuthService } from '../services/auth.service';
import { WorkoutService } from '../services/workout.service';
import { LevelLabelPipe } from '../pipes/level-label.pipe';

@Component({ standalone: true, imports: [CommonModule, RouterLink], template: `
<section class="hero"><div><p class="eyebrow">MOVE • FEEL • GROW</p><h1>Твоята тренировка.<br><span>Твоят ритъм.</span></h1><p>Открий идеи за движение, създай личен план и следи любимите си тренировки.</p><a class="btn" routerLink="/catalog">Разгледай каталога</a></div></section>
<section class="features"><article><b>01</b><h3>Открий</h3><p>Разгледай тренировъчни идеи от външен API.</p></article><article><b>02</b><h3>Създай</h3><p>Добавяй и управлявай личните си тренировки.</p></article><article><b>03</b><h3>Постигай</h3><p>Изгради постоянство с движение всеки ден.</p></article></section>` })
export class HomePage {}

@Component({ standalone: true, imports: [CommonModule, RouterLink], template: `
<section class="page"><div class="page-head"><div><p class="eyebrow">LIBRARY</p><h1>Каталог тренировки</h1><p>Избери своето ниво и открий програма, която ти подхожда.</p></div><a class="btn" routerLink="/dashboard">+ Моя тренировка</a></div>
<div *ngIf="error" class="error">{{error}}</div>
<div class="level-grid"><a class="level-card" *ngFor="let lvl of levels; let i = index" [routerLink]="['/catalog/level', lvl.slug]">
<div class="level-img"><img [src]="lvl.image" [alt]="lvl.title" loading="lazy"><b>0{{i + 1}}</b></div>
<div class="level-body"><span class="tag">{{lvl.subtitle}}</span><h2>{{lvl.title}}</h2><p>{{lvl.description}}</p><footer><span>{{counts[lvl.level] || 0}} тренировки</span><span class="link">Разгледай →</span></footer></div></a></div></section>` })
export class CatalogPage implements OnInit {
 levels = LEVELS; counts: Record<string, number> = {}; error='';
 constructor(private service: WorkoutService) {}
 ngOnInit(): void { this.service.getAll().subscribe({ next: items => { this.counts = items.reduce((acc, w) => ({ ...acc, [w.level]: (acc[w.level] ?? 0) + 1 }), {} as Record<string, number>); }, error: err => this.error = err.message }); }
}

@Component({ standalone: true, imports: [CommonModule, RouterLink, LevelLabelPipe], template: `
<section class="page" *ngIf="info; else missing"><a routerLink="/catalog" class="back">← Всички нива</a>
<nav class="level-tabs"><a *ngFor="let lvl of levels" [routerLink]="['/catalog/level', lvl.slug]" [class.active]="lvl.slug === info.slug">{{lvl.title}}</a></nav>
<div class="page-head"><div><p class="eyebrow">НИВО: {{info.title | uppercase}}</p><h1>{{info.subtitle}}</h1><p class="level-intro">{{info.description}}</p></div></div>
<div *ngIf="loading" class="notice">Зареждаме тренировките…</div><div *ngIf="error" class="error">{{error}}</div>
<div class="cards"><article class="workout-card" *ngFor="let workout of workouts">
<img *ngIf="workout.exercises?.length" class="card-img" [src]="workout.exercises![0].images[0]" [alt]="workout.title" loading="lazy">
<span class="tag">{{workout.category}}</span><h2>{{workout.title}}</h2><p>{{workout.description}}</p>
<ul class="card-meta" *ngIf="workout.exercises?.length"><li>{{workout.exercises!.length}} упражнения</li><li>{{workout.equipment}}</li></ul>
<footer><span>{{workout.duration}} мин. · {{workout.level | levelLabel}}</span><a [routerLink]="['/catalog', workout.id]">Детайли →</a></footer></article></div>
<div *ngIf="!loading && workouts.length === 0" class="notice">Няма тренировки за това ниво.</div></section>
<ng-template #missing><section class="page narrow"><p class="error">Нивото не е намерено.</p><a routerLink="/catalog">← Към каталога</a></section></ng-template>` })
export class LevelPage implements OnInit {
 levels = LEVELS; info?: LevelInfo; workouts: Workout[]=[]; loading=true; error='';
 private route = inject(ActivatedRoute); private service = inject(WorkoutService);
 ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
   this.info = LEVELS.find(l => l.slug === params.get('level'));
   if (!this.info) return;
   this.loading = true; this.error = '';
   this.service.getByLevel(this.info.level).subscribe({ next: items => { this.workouts = items; this.loading = false; }, error: err => { this.error = err.message; this.loading = false; } });
  });
 }
}

@Component({ standalone: true, imports: [CommonModule, RouterLink, LevelLabelPipe], template: `
<section class="page"><a [routerLink]="levelSlug ? ['/catalog/level', levelSlug] : ['/catalog']" class="back">← Назад към {{workout ? 'ниво ' + (workout.level | levelLabel) : 'каталога'}}</a>
<div *ngIf="workout"><p class="eyebrow">WORKOUT DETAILS</p><span class="tag">{{workout.level | levelLabel}}</span><h1>{{workout.title}}</h1>
<p class="lead">{{workout.overview || workout.description}}</p>
<div class="detail-stats"><span>⏱ {{workout.duration}} минути</span><span>✦ {{workout.category}}</span><span *ngIf="workout.exercises?.length">▤ {{workout.exercises!.length}} упражнения</span></div>
<div class="info-grid" *ngIf="workout.goal"><div><small>Цел</small><b>{{workout.goal}}</b></div><div><small>Оборудване</small><b>{{workout.equipment}}</b></div><div><small>Честота</small><b>{{workout.frequency}}</b></div></div>

<ng-container *ngIf="workout.exercises?.length">
<h2 class="section-title">Последователност на упражненията</h2>
<ol class="sequence"><li *ngFor="let ex of workout.exercises; let i = index; let last = last"><a [href]="'#ex-' + (i + 1)" (click)="scrollTo($event, i + 1)"><img [src]="ex.images[0]" [alt]="ex.name" loading="lazy"><span>{{i + 1}}. {{ex.name}}</span></a><i *ngIf="!last">→</i></li></ol>

<div class="phase"><b>Загрявка</b><p>{{workout.warmup}}</p></div>
<article class="exercise" *ngFor="let ex of workout.exercises; let i = index" [id]="'ex-' + (i + 1)">
<header><span class="step-no">{{i + 1}}</span><div><h3>{{ex.name}}</h3><small>{{ex.muscles}}</small></div></header>
<div class="ex-images"><figure><img [src]="ex.images[0]" [alt]="ex.name + ' – начална позиция'" loading="lazy"><figcaption>1. Начална позиция</figcaption></figure><span class="arrow">→</span><figure><img [src]="ex.images[1]" [alt]="ex.name + ' – крайна позиция'" loading="lazy"><figcaption>2. Крайна позиция</figcaption></figure></div>
<div class="ex-stats"><span><b>{{ex.sets}}</b> серии</span><span><b>{{ex.reps}}</b></span><span>Почивка <b>{{ex.rest}}</b></span></div>
<ol class="ex-steps"><li *ngFor="let step of ex.steps">{{step}}</li></ol>
<p class="tip"><b>Съвет:</b> {{ex.tip}}</p></article>
<div class="phase"><b>Разпускане</b><p>{{workout.cooldown}}</p></div>
</ng-container>
<a class="btn" routerLink="/dashboard">Добави своя тренировка</a></div><p *ngIf="error" class="error">{{error}}</p></section>` })
export class DetailsPage implements OnInit {
 workout?: Workout; error=''; levelSlug?: string;
 constructor(private route: ActivatedRoute, private service: WorkoutService) {}
 ngOnInit(): void { const id=Number(this.route.snapshot.paramMap.get('id')); this.service.getById(id).subscribe(item => { this.workout=item; this.levelSlug = LEVELS.find(l => l.level === item?.level)?.slug; if (!item) this.error='Тренировката не е намерена.'; }); }
 scrollTo(event: Event, n: number): void { event.preventDefault(); document.getElementById('ex-' + n)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
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
