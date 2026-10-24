import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Information } from './pages/information/information';

export const routes: Routes = [
    {
        path: '', component: Home
    },
    {
        path:'login', component: Login
    },
    {
        path:'information', component: Information
    }
];
