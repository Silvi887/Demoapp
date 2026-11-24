import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './exam/guards/auth.guards';
import { HomePage, CatalogPage, LevelPage, DetailsPage, AuthPage, DashboardPage } from './exam/pages/pages.component';
import { NutritionPage } from './exam/pages/nutrition.component';
import { NotFoundPage } from './exam/pages/not-found.component';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'catalog', component: CatalogPage },
  { path: 'catalog/level/:level', component: LevelPage },
  { path: 'catalog/:id', component: DetailsPage },
  { path: 'nutrition', component: NutritionPage },
  { path: 'login', component: AuthPage, canActivate: [guestGuard], data: { register: false } },
  { path: 'register', component: AuthPage, canActivate: [guestGuard], data: { register: true } },
  { path: 'dashboard', component: DashboardPage, canActivate: [authGuard] },
  { path: '**', component: NotFoundPage }
];
