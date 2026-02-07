import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Eventapi } from '../shared/eventapi';
import { Organizationapi } from '../shared/organizationapi';
import { AuthService } from '../shared/auth-service';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-ownevents',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './ownevents.html',
  styleUrl: './ownevents.css',
})
export class Ownevents implements OnInit {
  organizationEvents: any[] = [];
  selectedOrganization: any = null;
  selectedOrgEvents: any[] = [];
  filteredEvents: any[] = [];
  searchTerm: string = '';
  isDropdownOpen: boolean = false;
	private pendingOrgId: number | null = null;
  
  eventForm: FormGroup;
  submitting = false;
  showForm = false;
  formError: string | null = null;

  constructor(
    private eventapi: Eventapi,
    private organizationapi: Organizationapi,
    private builder: FormBuilder,
    public authService: AuthService,
		private route: ActivatedRoute
  ) {
    this.eventForm = this.builder.group({
      title: ['', Validators.required],
      description: [''],
      location: [''],
      date: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      status: ['Aktív']
    });
  }

  ngOnInit() {
    const orgIdParam = this.route.snapshot.queryParamMap.get('orgId');
    this.pendingOrgId = orgIdParam ? Number(orgIdParam) : null;
    if (this.pendingOrgId !== null && Number.isNaN(this.pendingOrgId)) this.pendingOrgId = null;

    if (this.authService.isLoggedInSubject.value) {
      this.getOwnEvents();
    } else {
      this.authService.isLoggedIn$.subscribe((loggedIn) => {
        if (loggedIn) {
          this.getOwnEvents();
        }
      });
    }
  }

  scrollToForm() {
    setTimeout(() => {
      const formSection = document.querySelector('.form-wrapper');
      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }

  getOwnEvents() {
    this.organizationapi.getOwnOrganizations$().subscribe({
      next: (result: any) => {
        const ownOrgs = result.data || [];
        
        this.eventapi.getOwnEvents$().subscribe({
          next: (eventResult: any) => {
            const eventsWithOrgs = eventResult.data || [];
            
            this.organizationEvents = ownOrgs.map((org: any) => {
              const orgWithEvents = eventsWithOrgs.find((e: any) => e.organization_id === org.id);
              return {
                organization_id: org.id,
                organization_name: org.name,
                events: orgWithEvents?.events || []
              };
            });
            
            if (this.organizationEvents.length > 0) {
					const preselect = this.pendingOrgId
						? this.organizationEvents.find((o: any) => o?.organization_id === this.pendingOrgId)
						: null;
					this.selectOrganization(preselect ?? this.organizationEvents[0]);
            }
          },
          error: () => {},
        });
      },
      error: () => {},
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  selectOrganization(org: any) {
    this.selectedOrganization = org;
    this.selectedOrgEvents = org.events || [];
    this.filteredEvents = [...this.selectedOrgEvents];
    this.searchTerm = '';
    this.closeDropdown();
  }
  onSearchChange() {
    if (!this.searchTerm.trim()) {
      this.filteredEvents = [...this.selectedOrgEvents];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredEvents = this.selectedOrgEvents.filter(event =>
        event.title.toLowerCase().includes(term) ||
        (event.description && event.description.toLowerCase().includes(term)) ||
        (event.location && event.location.toLowerCase().includes(term))
      );
    }
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
    if (this.eventForm.invalid || this.submitting) {
      return;
    }

    const payload = this.buildPayload();
    this.submitting = true;
    this.formError = null;
		this.eventapi.addEvent$(payload, this.selectedOrganization?.organization_id).subscribe({
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
    this.getOwnEvents();
    if (resetForm) {
      this.cancelForm();
    }
    this.submitting = false;
  }

  private handleError(err: any) {
    if (err?.error) {
      if (typeof err.error === 'string') {
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
      this.formError = 'Nem sikerült menteni az eseményt.';
    }
  }

  private buildPayload() {
    const raw = this.eventForm.value;
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
    this.eventForm.reset({
      title: '',
      description: '',
      location: '',
      date: '',
      capacity: '',
      status: 'Aktív'
    });
  }
}
