import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Organizationapi } from '../shared/organizationapi';
import { AuthService } from '../shared/auth-service';
import { bankAccountValidator, phoneValidator } from '../shared/form-validators';

@Component({
  selector: 'app-ownorganizations',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './ownorganizations.html',
  styleUrl: './ownorganizations.css',
})
export class Ownorganizations implements OnInit {
    scrollToForm() {
      setTimeout(() => {
        const formSection = document.querySelector('.form-wrapper');
        if (formSection) {
          formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 0);
    }
  organizations: any[] = [];
  organizationForm: FormGroup;
  submitting = false;
  showForm = false;
  formError: string | null = null;

  constructor(
    private api: Organizationapi,
    private builder: FormBuilder,
    public authService: AuthService,
  ) {
        this.organizationForm = this.builder.group({
          name: [''],
          description: [''],
          category: [''],
          phone: ['', [phoneValidator()]],
          address: [''],
          email: ['', [Validators.email]],
          website: ['', [Validators.pattern('^(https?:\\/\\/)?([\\w-]+\\.)+[\\w-]+(\\/\\S*)?$')]],
          bank_account: ['', [bankAccountValidator()]]
        });
  }

  ngOnInit() {
    if (this.authService.isLoggedInSubject.value) {
      this.getOwnOrganizations();
    } else {
      this.authService.isLoggedIn$.subscribe((loggedIn) => {
        if (loggedIn) {
          this.getOwnOrganizations();
        }
      });
    }
  }

  getOwnOrganizations() {
    this.api.getOwnOrganizations$().subscribe({
      next: (result: any) => {
        this.organizations = result.data ?? [];
      },
      error: () => {},
    });
  }

  startCreate() {
    this.resetFormFields();
    this.showForm = true;
    this.scrollToForm();
  }

  cancelForm() {
    this.showForm = false;
    this.resetFormFields();
  }

  clearFormFields() {
    this.resetFormFields();
  }

  submitForm() {
    if (this.organizationForm.invalid || this.submitting) {
      this.organizationForm.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload();
    this.submitting = true;
    this.formError = null;

		this.api.addOrganization$(payload).subscribe({
			next: () => {
				this.handleSuccess();
			},
			error: (err) => {
				this.handleError(err);
				this.submitting = false;
			}
		});
  }

  private handleSuccess(resetForm: boolean = true) {
    this.getOwnOrganizations();
    if (resetForm) {
      this.cancelForm();
    }
    this.submitting = false;
  }

  private handleError(err: any) {
    if (err?.error) {

      if (err.error?.exception && err.error?.exception.includes('UniqueConstraintViolationException')) {
        this.formError = 'Ilyen email vagy szervezet már létezik.';
      } else if (typeof err.error === 'string') {
        this.formError = err.error;
      } else if (err.error?.message) {
        this.formError = err.error.message;
      } else if (typeof err.error === 'object') {
        const firstKey = Object.keys(err.error)[0];
        this.formError = firstKey ? err.error[firstKey] : 'Ismeretlen hiba történt.';
      } else {
        this.formError = 'Ismeretlen hiba történt.';
      }
    } else {
      this.formError = 'Nem sikerült menteni a szervezetet.';
    }

  }

  private buildPayload() {
    const raw = this.organizationForm.value;
    const payload: any = {};

    Object.entries(raw).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        payload[key] = null;
      } else if (typeof value === 'string') {
        const trimmed = value.trim();
        payload[key] = trimmed === '' ? null : trimmed;
      } else {
        payload[key] = value;
      }
    });

    return payload;
  }

  private resetFormFields() {
    this.organizationForm.reset({
      name: '',
      description: '',
      category: '',
      phone: '',
      address: '',
      email: '',
      website: '',
      bank_account: ''
    });
  }
}
