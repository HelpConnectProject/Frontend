import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Organizations } from './organizations/organizations';

export const routes: Routes = [
    { path: 'home', component: Home },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'organizations', component: Organizations },
];
