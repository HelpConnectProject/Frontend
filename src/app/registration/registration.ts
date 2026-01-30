import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthApi } from '../shared/auth-api';
import { AuthService } from '../shared/auth-service';
import { RouterLink } from "@angular/router";
import { matchControls, phoneValidator } from '../shared/form-validators';


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

  registerForm!: FormGroup;

ngOnInit() {
  this.registerForm = this.builder.group(
    {
      name: '',
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required]],
      phone: ['', [phoneValidator()]],
      city: '',
      about: '',
      interest: '',
      qualification: '',
      experience: ''
    },
    { validators: matchControls('password', 'password_confirmation') }
  );
}

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
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