import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Organizations } from './organizations/organizations';
import { Auth } from './auth/auth';
import { Registration } from './registration/registration';
import { Ownorganizations } from './ownorganizations/ownorganizations';
import { Events } from './events/events';
import { Ownevents } from './ownevents/ownevents';

export const routes: Routes = [
    { path: 'home', component: Home },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'organizations', component: Organizations },
    {path: "auth", component: Auth},
    {path:"registration", component: Registration},
    {path: "ownorganizations", component: Ownorganizations},
    {path: "events", component: Events},
    {path: "ownevents", component: Ownevents},
    
];
