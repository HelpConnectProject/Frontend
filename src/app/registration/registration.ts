import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthApi } from '../shared/auth-api';
import { AuthService } from '../shared/auth-service';
import { Router, RouterLink } from "@angular/router";
import { matchControls, phoneValidator } from '../shared/form-validators';


@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
})
export class Registration {

  showPassword = false;
  showPasswordConfirmation = false;

  constructor(
    private auth: AuthApi,
    private builder: FormBuilder,
    private authService: AuthService,
    private router:Router
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
			alert('Sikeres regisztráció! Küldtünk egy emailt, amiben meg kell erősítened a fiókodat. Ezután tudsz belépni.');
			this.router.navigate(['/auth']);
      },
      error: () => {
        this.authService.setLoggedIn(false);
        alert('Regisztráció sikertelen. Kérem, próbálja újra.');
      }
    });
  }
}