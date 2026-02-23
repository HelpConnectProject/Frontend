import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthApi } from '../shared/auth-api';
import { AuthService } from '../shared/auth-service';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { phoneValidator } from '../shared/form-validators';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, RouterLink, AsyncPipe],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  loginForm: any;
  updateForm: any;

  showPassword = false;

  loading = false;
  errorMessage = '';
  successMessage = '';
  isEditingProfile = false;

  forgotPassword = false;

  user: any;
  constructor(
    private auth: AuthApi,
    private builder: FormBuilder,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loginForm = this.builder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.updateForm = this.builder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      city: [''],
      phone: ['', [phoneValidator()]],
      about: [''],
    });
    this.updateForm.disable();

    if (localStorage.getItem('token')) {
      this.getOwnProfile();
    }
  }

  getOwnProfile() {
    this.auth.getOwnProfile$({}).subscribe({
      next: (res: any) => {
        this.user = res.data;
        this.updateForm.patchValue({
          name: this.user?.name ?? '',
          email: this.user?.email ?? '',
          city: this.user?.city ?? '',
          phone: this.user?.phone ?? '',
          about: this.user?.about ?? '',
        });
        if (this.isEditingProfile) {
          this.updateForm.enable();
        } else {
          this.updateForm.disable();
        }
      },
      error: () => {
        this.user = null;
        this.updateForm.reset({
          name: '',
          email: '',
          city: '',
          phone: '',
          about: '',
        });
        this.updateForm.disable();
      }
    });
  }

  startEditProfile() {
    this.isEditingProfile = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.updateForm.patchValue({
      name: this.user?.name ?? '',
      email: this.user?.email ?? '',
      city: this.user?.city ?? '',
      phone: this.user?.phone ?? '',
      about: this.user?.about ?? '',
    });
    this.updateForm.enable();
  }

  cancelEditProfile() {
    this.isEditingProfile = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.updateForm.patchValue({
      name: this.user?.name ?? '',
      email: this.user?.email ?? '',
      city: this.user?.city ?? '',
      phone: this.user?.phone ?? '',
      about: this.user?.about ?? '',
    });
    this.updateForm.disable();
  }

  login() {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.auth.login$(this.loginForm.value).subscribe({
      next: (res: any) => {
        if (res?.data?.token) {
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
        this.showPassword = false;
        this.getOwnProfile();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message ?? 'Sikertelen bejelentkezés';
        this.authService.setLoggedIn(false);
        this.showPassword = false;
      }
    });
  }

  logout() {
    const token = localStorage.getItem('token');
    this.auth.logout$({ token }).subscribe({
      next: () => {
        localStorage.removeItem('token');
        this.authService.setLoggedIn(false);
        this.user = null;
        this.errorMessage = '';
        this.successMessage = '';
        this.isEditingProfile = false;
        this.updateForm.reset({
          name: '',
          email: '',
          city: '',
          phone: '',
          about: '',
        });
        this.updateForm.disable();
      },
      error: () => {
        localStorage.removeItem('token');
        this.authService.setLoggedIn(false);
        this.user = null;
        this.errorMessage = '';
        this.successMessage = '';
        this.isEditingProfile = false;
        this.updateForm.reset({
          name: '',
          email: '',
          city: '',
          phone: '',
          about: '',
        });
        this.updateForm.disable();
      }
    });
  }

  register() {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.auth.register$(this.loginForm.value).subscribe({
      next: (res: any) => {
        if (res?.data?.token) {
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

  updateProfile() {
    if (!this.updateForm || this.updateForm.disabled) {
      return;
    }
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      this.errorMessage = 'Kérlek, javítsd az űrlap hibáit.';
      this.successMessage = '';
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.auth.updateOwnProfile$(this.updateForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Profil frissítve.';
        this.isEditingProfile = false;
        this.updateForm.disable();
        this.getOwnProfile();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message ?? 'Sikertelen profil frissítés';
      }
    });
  }
  forgotPasswordChangeTrue(){
    this.forgotPassword = true;
  }
  forgotPasswordChangeFalse(){
    this.forgotPassword = false;
  }

sendPasswordReset() {
  this.loading = true;
  this.errorMessage = '';
  this.successMessage = '';

  const email = this.loginForm?.value?.email;

  if (!email) {
    this.loading = false;
    this.errorMessage = 'Add meg az email címet.';
    return;
  }

  this.auth.passwordReset$({ email }).subscribe({
    next: (res: any) => {
      this.loading = false;
      this.successMessage =
        res?.message ?? 'Ha a fiók létezik, elküldtük az emailt.';
        this.loginForm.reset();
    },
    error: (err: any) => {
      this.loading = false;
      this.errorMessage =
        err?.error?.message ?? 'Nem sikerült elküldeni az emailt.';
    }
  });
}
  

}