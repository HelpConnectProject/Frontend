import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthApi } from '../shared/auth-api';
import { AuthService } from '../shared/auth-service';
import { RouterLink } from "@angular/router";
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, RouterLink, AsyncPipe],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {

  loginForm: any
  loading = false
  errorMessage = '';

  user: any;
  constructor(
    private auth: AuthApi,
    private builder: FormBuilder,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loginForm = this.builder.group({
      email: '',
      password: '',
    });
  }

  login() {
    this.loading = true;
    this.errorMessage = '';
    this.auth.login$(this.loginForm.value).subscribe({
      next: (res: any) => {
        if(res?.data?.token) {
          localStorage.setItem('token', res.data.token);
          this.authService.setLoggedIn(
            true,
            res.data.id,
          );
        } else {
          this.authService.setLoggedIn(false);
          this.errorMessage = 'Hibás belépés';
        }
        this.loading = false;
        this.loginForm.reset();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message ?? 'Sikertelen bejelentkezés';
        this.authService.setLoggedIn(false);
      }
    });
  }

  logout() {
    const token = localStorage.getItem('token');
    this.auth.logout$({ token }).subscribe({
      next: () => {
        localStorage.removeItem('token');
        this.authService.setLoggedIn(false);
      },
      error: () => {
        localStorage.removeItem('token');
        this.authService.setLoggedIn(false);
      }
    });
  }

  register() {
    this.loading = true;
    this.errorMessage = '';
    this.auth.register$(this.loginForm.value).subscribe({
      next: (res: any) => {
        if(res?.data?.token) {
          localStorage.setItem('token', res.data.token);
          this.authService.setLoggedIn(
            true,
            res.data.id,
          );
        } else {
          this.authService.setLoggedIn(false);
          this.errorMessage = 'Hibás regisztráció';
        }
        this.loading = false;
        this.loginForm.reset();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message ?? 'Sikertelen regisztráció';
        this.authService.setLoggedIn(false);
      }
    });
  }
}