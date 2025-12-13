import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthApi } from '../shared/auth-api';
import { AuthService } from '../shared/auth-service';
import { RouterLink } from "@angular/router";


@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
})
export class Registration {

  constructor(
    private auth: AuthApi,
    private builder: FormBuilder,
    private authService: AuthService
  ) {}

  registerForm: any;

ngOnInit() {
  this.registerForm = this.builder.group({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    city: '',
    about: '',
    interest: '',
    qualification: '',
    experience: ''
  });
}

  register() {
    this.auth.register$(this.registerForm.value).subscribe({
      next: (res: any) => {

        this.registerForm.reset();
      },
      error: () => {
        this.authService.setLoggedIn(false);
      }
    });
  }
}