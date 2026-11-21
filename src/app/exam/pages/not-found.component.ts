import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({standalone:true,imports:[RouterLink],template:`<section class="page narrow"><h1>404 — Страницата не е намерена</h1><a routerLink="/">Към началото</a></section>`})
export class NotFoundPage {}
