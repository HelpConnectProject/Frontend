import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Organizationapi } from '../shared/organizationapi';
import { Eventapi } from '../shared/eventapi';
import { bankAccountValidator, phoneValidator } from '../shared/form-validators';
import { categoryImageFor } from '../shared/category-image';
import { Memberapi } from '../shared/memberapi';
import { AuthService } from '../shared/auth-service';


@Component({
  selector: 'app-aboutorganization',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './aboutorganization.html',
  styleUrl: './aboutorganization.css',
})
export class Aboutorganization implements OnInit {
  categoryImageFor = categoryImageFor;

  getStars(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i + 1);
  }
  org: any = null;
  events: any[] = [];
  loading = true;
	isOwnView = false;

  membersLoading = false;
  membersError: string | null = null;
  members: any[] = [];

  showAddManager = false;
  addingManager = false;
  managerError: string | null = null;
  managerSuccess: string | null = null;
  managerForm: FormGroup;

  editMode = false;
  saving = false;
  editError: string | null = null;
  orgForm: FormGroup;

  searchEventsForOrg() {
    if (this.org?.name) {
      this.router.navigate(['/events'], { queryParams: { organizationName: this.org.name } });
    }
  }

  private getCurrentUserId(): string | null {
    const id = localStorage.getItem('id');
    return id ? id.toString() : null;
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
    private builder: FormBuilder,
    private memberapi: Memberapi,
    public authService: AuthService
  

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

    this.managerForm = this.builder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  openAddManager() {
    this.managerError = null;
    this.managerSuccess = null;
    this.showAddManager = true;
    this.managerForm.reset({ email: '' });
  }

  cancelAddManager() {
    if (this.addingManager) return;
    this.showAddManager = false;
    this.managerError = null;
    this.managerSuccess = null;
    this.managerForm.reset({ email: '' });
  }

  addManagerByEmail() {
    if (!this.isOwnView || !this.org?.id || this.addingManager) return;

    if (this.managerForm.invalid) {
      this.managerForm.markAllAsTouched();
      return;
    }

    const email = String(this.managerForm.value.email ?? '').trim();
    if (!email) return;

    this.addingManager = true;
    this.managerError = null;
    this.managerSuccess = null;

    this.memberapi.getUserByEmail$(email).subscribe({
      next: (result: any) => {
        const payload = result?.data ?? result;

        if (payload === false || payload === null || payload === undefined) {
          this.managerError = 'Nem található felhasználó ezzel az email címmel.';
          this.addingManager = false;
          return;
        }

        const user = Array.isArray(payload) ? payload[0] : payload;
        const userIdRaw = user?.id ?? user?.user_id ?? user?.userId;
        const userId = userIdRaw !== undefined && userIdRaw !== null ? Number(userIdRaw) : NaN;

        if (!Number.isFinite(userId)) {
          this.managerError = 'Nincs ilyen felhasználó ezzel az email címmel.';
          this.addingManager = false;
          return;
        }

        this.memberapi.addMember$(Number(this.org.id), userId).subscribe({
          next: (addResult: any) => {
            const addPayload = addResult?.data ?? addResult;
            if (addPayload === false) {
              this.managerError = 'Nem sikerült hozzáadni a managert.';
              this.addingManager = false;
              return;
            }

            this.managerSuccess = `Manager hozzáadva: ${email}`;
            this.addingManager = false;
            this.showAddManager = false;
            this.managerForm.reset({ email: '' });
            this.getMembers();
          },
          error: (err) => {
            this.managerError = this.parseErrorMessage(err, 'Nem sikerült hozzáadni a managert.');
            this.addingManager = false;
          },
        });
      },
      error: (err) => {
        this.managerError = this.parseErrorMessage(err, 'Nem található felhasználó ezzel az email címmel.');
        this.addingManager = false;
      },
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
      this.editError = 'Kérlek javítsd a hibás mezőket (pl. email/telefon/weboldal/bankszámla).';
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
    const payload = err?.error;
    if (!payload) return fallback;

    if (typeof payload === 'string') return payload;
    if (Array.isArray(payload)) {
      const first = payload.find((v) => v !== null && v !== undefined);
      return first !== undefined ? String(first) : fallback;
    }

    if (typeof payload === 'object') {
      const message = (payload as any).message;
      const errors = (payload as any).errors;

      if (errors && typeof errors === 'object') {
        const firstField = Object.keys(errors)[0];
        if (firstField) {
          const fieldError = (errors as any)[firstField];
          if (Array.isArray(fieldError) && fieldError.length > 0) return String(fieldError[0]);
          if (typeof fieldError === 'string') return fieldError;
        }
      }

      if (typeof message === 'string' && message.trim().length > 0) return message;

      const firstKey = Object.keys(payload)[0];
      if (firstKey) {
        const value = (payload as any)[firstKey];
        if (typeof value === 'string') return value;
        if (Array.isArray(value) && value.length > 0) return String(value[0]);
      }
    }

    return fallback;
  }

  deleteFeedback(id:number){
      this.organizationapi.deleteFeedback$(id).subscribe({
        next: () => {
      for (const event of this.events) {
        if (event?.feedbacks && Array.isArray(event.feedbacks)) {
          event.feedbacks = event.feedbacks.filter((f: any) => f?.id !== id);
        }
      }
    },error: () => {}
      })
  }

  ngOnInit() {
  this.isOwnView = this.route.snapshot.queryParamMap.get('own') === '1' || this.route.snapshot.queryParamMap.get('own') === 'true';
  const id = this.route.snapshot.paramMap.get('id');
  if (!id) {
    this.loading = false;
    this.events = [];
    return;
  }

  this.organizationapi.getOrganizations$().subscribe({
    next: (result: any) => {
      const orgs = result?.data ?? [];
      this.org = orgs.find((o: any) => o.id == id);
      this.loading = false;
      this.editMode = false;

      if (this.org?.id && this.isOwnView) {
        this.getMembers();
      }
      if (!this.org?.id) return;

      this.eventapi.getInactiveEvents$(this.org.id).subscribe({
        next: (eventsResult: any) => {
          this.events = Array.isArray(eventsResult?.data) ? eventsResult.data : [];
          for (const event of this.events) {
            this.organizationapi.getEventFeedbacks$(event.id).subscribe({
              next: (feedbackResult: any) => {
                event.feedbacks = feedbackResult?.data ?? [];
              },
              error: () => {},
            });
          }
        },
        error: () => {
          this.events = [];
        },
      });
    },
    error: () => {
      this.loading = false;
      this.events = [];
    },
  });
  }

  reset() {
    this.org = null;
    this.events = [];
  }

  getMembers() {
    if (!this.org?.id) return;
    this.membersLoading = true;
    this.membersError = null;

    this.memberapi.getMembers$(this.org.id).subscribe({
      next: (result: any) => {
        const data = result?.data ?? result;
        const list = Array.isArray(data) ? data : [];
        const members = list.filter((m: any) => String(m?.organization_id ?? '') === String(this.org?.id ?? ''));

        this.members = members;
        if (this.org) {
          this.org.members = members;
        }
        this.membersLoading = false;
      },
      error: (err) => {
        this.membersError = this.parseErrorMessage(err, 'Nem sikerült betölteni az adminokat.');
        this.membersLoading = false;
      }
    });
  }

  memberDisplay(member: any): string {
    const email = member?.email ?? member?.user_email ?? member?.user?.email;
    const name = member?.name ?? member?.username ?? member?.user_name ?? member?.user?.name;
    if (email && name) return `${name} (${email})`;
    return String(email ?? name ?? member?.id ?? member?.user_id ?? '');
  }

}
