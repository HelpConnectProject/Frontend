import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Organizations } from './organizations/organizations';
import { Auth } from './auth/auth';
import { Registration } from './registration/registration';

export const routes: Routes = [
    { path: 'home', component: Home },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'organizations', component: Organizations },
    {path: "auth", component: Auth},
    {path:"registration", component: Registration},
];
