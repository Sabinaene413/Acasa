import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { RegisterComponent } from './pages/register/register.component';
import { AddPropertyComponent } from './pages/properties/add-property/add-property.component';
import { authGuard } from './guards/auth.guard';
import { ProfileComponent } from './pages/profile/profile';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'contul-meu',
    component: ProfileComponent,
    canActivate: [authGuard],
  },
  {
    path: 'add-property',
    component: AddPropertyComponent,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
