import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { RegisterComponent } from './pages/register/register.component';
import { AddPropertyComponent } from './pages/properties/add-property/add-property.component';
import { EditPropertyComponent } from './pages/properties/edit-property/edit-property.component';
import { authGuard } from './guards/auth.guard';
import { ProfileComponent } from './pages/profile/profile';
import { PropertyDetailsComponent } from './pages/properties/property-details/property-details.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'property/:id',
    component: PropertyDetailsComponent,
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
    path: 'edit-property/:id',
    component: EditPropertyComponent,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
