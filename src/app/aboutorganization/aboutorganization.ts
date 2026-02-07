import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Organizationapi } from '../shared/organizationapi';
import { Eventapi } from '../shared/eventapi';
import { bankAccountValidator, phoneValidator } from '../shared/form-validators';


@Component({
  selector: 'app-aboutorganization',
  imports: [CommonModule, RouterLink, DatePipe, ReactiveFormsModule],
  templateUrl: './aboutorganization.html',
  styleUrl: './aboutorganization.css',
})
export class Aboutorganization implements OnInit {
  getStars(count: number): number[] {
    return Array(count).fill(0).map((_, i) => i + 1);
  }
  org: any = null;
  events: any = null;
  loading = true;
	isOwnView = false;

  editMode = false;
  saving = false;
  editError: string | null = null;
  orgForm: FormGroup;

  private getCurrentUserId(): string | null {
    const id = localStorage.getItem('id');
    return id ? String(id) : null;
  }

  private getFeedbackOwnerId(feedback: any): string | null {
    if (!feedback) return null;
    const candidates = [
      feedback.user_id,
      feedback.userId,
      feedback.owner_id,
      feedback.author_id,
      feedback.created_by,
      feedback.user?.id,
      feedback.user?.user_id,
      feedback.author?.id,
    ];
    const found = candidates.find((v) => v !== undefined && v !== null && String(v).length > 0);
    return found !== undefined ? String(found) : null;
  }

  canDeleteFeedback(feedback: any): boolean {
    const currentUserId = this.getCurrentUserId();
    if (!currentUserId) return false;
    const ownerId = this.getFeedbackOwnerId(feedback);
    if (!ownerId) return false;
    return ownerId === currentUserId;
  }

  addFeedback(eventId: number, formEvent: Event) {
    formEvent.preventDefault();
    const target = formEvent.target as HTMLFormElement;
    const comment = (target.elements.namedItem('comment') as HTMLInputElement).value;
    const rating = +(target.elements.namedItem('rating') as HTMLInputElement).value;
    const payload = { comment, rating };
    this.organizationapi.addEventFeedback$(eventId, payload).subscribe({
      next: () => {
        const event = this.events.find((e: any) => e.id === eventId);
        if (event) {
          this.organizationapi.getEventFeedbacks$(eventId).subscribe({
            next: (result: any) => {
              event.feedbacks = result.data;
            },
            error: () => {}
          });
        }
        target.reset();
      },
      error: () => {
        alert('Nem sikerült elküldeni a visszajelzést.');
      }
    });
  }
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private organizationapi: Organizationapi,
    private eventapi: Eventapi,
    private builder: FormBuilder
  ) {
    this.orgForm = this.builder.group({
      name: ['', Validators.required],
      description: [''],
      category: [''],
      phone: ['', [phoneValidator()]],
      address: [''],
      email: ['', [Validators.email]],
      website: ['', [Validators.pattern('^(https?:\\/\\/)?([\\w-]+\\.)+[\\w-]+(\\/\\S*)?$')]],
      bank_account: ['', [bankAccountValidator()]],
    });
  }

  startEdit() {
    if (!this.org) return;
    this.editError = null;
    this.editMode = true;
    this.orgForm.patchValue({
      name: this.org?.name ?? '',
      description: this.org?.description ?? '',
      category: this.org?.category ?? '',
      phone: this.org?.phone ?? '',
      address: this.org?.address ?? '',
      email: this.org?.email ?? '',
      website: this.org?.website ?? '',
      bank_account: this.org?.bank_account ?? '',
    });
    this.orgForm.markAsPristine();
  }

  cancelEdit() {
    this.editMode = false;
    this.editError = null;
    this.orgForm.reset();
  }

  saveOrganization() {
    if (!this.org?.id || this.saving) return;
    if (this.orgForm.invalid) {
      this.orgForm.markAllAsTouched();
      return;
    }

    const payload = this.buildPayloadFromForm();
    this.saving = true;
    this.editError = null;
    this.organizationapi.updateOrganization$(this.org.id, payload).subscribe({
      next: () => {
        this.org = { ...this.org, ...payload };
        this.editMode = false;
        this.saving = false;
      },
      error: (err) => {
        this.editError = this.parseErrorMessage(err, 'Nem sikerült menteni a szervezetet.');
        this.saving = false;
      },
    });
  }

  deleteOrganization() {
    if (!this.org?.id) return;
    const confirmed = window.confirm('Biztosan törlöd ezt a szervezetet?');
    if (!confirmed) return;

    this.organizationapi.deleteOrganization$(this.org.id).subscribe({
      next: () => {
        this.router.navigate(['/ownorganizations']);
      },
      error: () => {
        alert('Nem sikerült törölni a szervezetet.');
      }
    });
  }

  private buildPayloadFromForm() {
    const raw = this.orgForm.value;
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

  private parseErrorMessage(err: any, fallback: string): string {
    if (err?.error) {
      if (typeof err.error === 'string') return err.error;
      if (err.error?.message) return err.error.message;
      if (typeof err.error === 'object') {
        const firstKey = Object.keys(err.error)[0];
        return firstKey ? String(err.error[firstKey]) : fallback;
      }
    }
    return fallback;
  }

  deleteFeedback(id:number){
      this.organizationapi.deleteFeedback$(id).subscribe({
        next: () => {
			if (this.events && Array.isArray(this.events)) {
				for (const event of this.events) {
					if (event?.feedbacks && Array.isArray(event.feedbacks)) {
						event.feedbacks = event.feedbacks.filter((f: any) => f?.id !== id);
					}
				}
			}
    },error: () => {}
      })
  }

  ngOnInit() {
	this.isOwnView = this.route.snapshot.queryParamMap.get('own') === '1' || this.route.snapshot.queryParamMap.get('own') === 'true';
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.organizationapi.getOrganizations$().subscribe({
        next: (result: any) => {
          const orgs = result.data;
          this.org = orgs.find((o: any) => o.id == id);
          this.loading = false;
				this.editMode = false;
          if (this.org && this.org.id) {
            this.eventapi.getInactiveEvents$(this.org.id).subscribe({
              next: (result: any) => {

                this.events = result.data;
                if (this.events && this.events.length > 0) {
                    for (const event of this.events) {
                      this.organizationapi.getEventFeedbacks$(event.id).subscribe({
                        next: (result: any) => {
                          event.feedbacks = result.data;
                        },
                        error: () => {}
                      });
                    }
               
                }
              },
              error: () => {}
            });
          }
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  reset() {
    this.org = null;
    this.events = null;
  }

}
