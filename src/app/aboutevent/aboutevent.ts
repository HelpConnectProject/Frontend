import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Eventapi } from '../shared/eventapi';
import { Eventregistrationapi } from '../shared/eventregistrationapi';
import { Organizationapi } from '../shared/organizationapi';
import { categoryImageFor } from '../shared/category-image';

@Component({
  selector: 'app-aboutevent',
  imports: [CommonModule, RouterLink, DatePipe, ReactiveFormsModule],
  templateUrl: './aboutevent.html',
  styleUrl: './aboutevent.css',
})
export class Aboutevent implements OnInit {
  categoryImageFor = categoryImageFor;

  event: any = null;
  loading = true;
  isOwnView = false;

  editMode = false;
  saving = false;
  editError: string | null = null;
  eventForm: FormGroup;

  owneventregistrations: any[] = [];
  organizationNameById: Record<number, string> = {};
  organizationCategoryById: Record<number, string> = {};

  registrations: any[] = [];
  registrationExpanded: { [id: number]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventapi: Eventapi,
    private organizationapi: Organizationapi,
    private eventregistrationapi: Eventregistrationapi,
    private builder: FormBuilder
  ) {
    this.eventForm = this.builder.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      location: [''],
      capacity: [null, [Validators.required, Validators.min(1)]],
      status: ['Aktív'],
      description: [''],
    });
  }

  ngOnInit() {
    this.isOwnView =
      this.route.snapshot.queryParamMap.get('own') === '1' ||
      this.route.snapshot.queryParamMap.get('own') === 'true';

    this.loadOrganizations();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.loading = false;
      return;
    }

    const eventId = Number(idParam);

    if (Number.isNaN(eventId)) {
      this.loading = false;
      return;
    }

    this.getRegistrationsForEvent(eventId);

    if (!this.isOwnView && this.hasToken()) {
      this.getOwnEventRegistrations();
    }

    this.loadEvent(eventId);
  }

  getRegistrationsForEvent(eventId: number) {
    this.eventregistrationapi.getRegistrationByOrg$(eventId).subscribe({
      next: (result: any) => {
        this.registrations = result.data || [];
        this.registrationExpanded = {};
      },
      error: () => {
        this.registrations = [];
      },
    });
  }

  countRegistrations() : number {
    return this.registrations.length;
  }

  toggleRegistrationExpand(id: number) {
    this.registrationExpanded[id] = !this.registrationExpanded[id];
  }

  startEdit() {
    if (!this.event) return;
    this.editError = null;
    this.editMode = true;
    this.patchFormFromEvent();
    this.eventForm.markAsPristine();
  }

  cancelEdit() {
    this.editMode = false;
    this.editError = null;
    this.eventForm.reset();
  }

  saveEvent() {
    if (!this.event?.id || !this.event?.organization_id || this.saving) return;
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    const payload = this.buildPayloadFromForm();
    this.saving = true;
    this.editError = null;

    this.eventapi
      .updateEvent$(this.event.id, this.event.organization_id, payload)
      .subscribe({
        next: () => {
          this.event = { ...this.event, ...payload };
          this.editMode = false;
          this.saving = false;
        },
        error: (err) => {
          this.editError = this.parseErrorMessage(
            err,
            'Nem sikerült menteni az eseményt.'
          );
          this.saving = false;
        },
      });
  }

  hasToken(): boolean {
    return Boolean(localStorage.getItem('token'));
  }

  private loadOrganizations() {
    this.organizationapi.getOrganizations$().subscribe({
      next: (result: any) => {
        const organizations = result?.data ?? [];
        this.organizationNameById = {};
        this.organizationCategoryById = {};

        for (const org of organizations) {
          if (typeof org?.id === 'number') {
            this.organizationNameById[org.id] = org?.name ?? '';
            this.organizationCategoryById[org.id] = org?.category ?? '';
          }
        }
      },
      error: () => {},
    });
  }

  private loadEvent(eventId: number) {
    this.loading = true;

    this.eventapi.getEvents$().subscribe({
      next: (result: any) => {
        const events = result?.data ?? [];
        const found = events.find((e: any) => e?.id === eventId);

        if (found) {
          this.event = found;
          this.editMode = false;
          this.loading = false;
          return;
        }

        this.tryLoadOwnEvent(eventId);
      },
      error: () => {
        this.tryLoadOwnEvent(eventId);
      },
    });
  }

  private tryLoadOwnEvent(eventId: number) {
    if (!this.hasToken()) {
      this.event = null;
      this.loading = false;
      return;
    }

    this.eventapi.getOwnEvents$().subscribe({
      next: (result: any) => {
        const groups = result?.data ?? [];
        let found: any = null;

        for (const g of groups) {
          const events = g?.events ?? [];
          const match = events.find((e: any) => e?.id === eventId);
          if (match) {
            found = match;
            break;
          }
        }

        this.event = found;
        this.editMode = false;
        this.loading = false;
      },
      error: () => {
        this.event = null;
        this.editMode = false;
        this.loading = false;
      },
    });
  }

  getOwnEventRegistrations() {
    this.eventregistrationapi.getOwnEventRegistrations$().subscribe({
      next: (result: any) => {
        this.owneventregistrations = result?.data ?? [];
      },
      error: () => {
        this.owneventregistrations = [];
      },
    });
  }

  isRegistered(eventId: number): boolean {
    for (const reg of this.owneventregistrations) {
      if (reg?.event_id === eventId) {
        return true;
      }
    }
    return false;
  }

  registerToEvent(eventId: number) {
    this.eventregistrationapi.registerEvent$(eventId).subscribe({
      next: () => this.getOwnEventRegistrations(),
      error: () => {},
    });
  }

  deleteEventRegistration(eventId: number) {
    let registrationId = eventId;

    for (const reg of this.owneventregistrations) {
      if (reg?.event_id === eventId) {
        registrationId = reg.id;
        break;
      }
    }

    this.eventregistrationapi
      .deleteEventRegistration$(registrationId)
      .subscribe({
        next: () => this.getOwnEventRegistrations(),
        error: () => {},
      });
  }

  deleteEvent() {
    if (!this.event) return;

    const confirmed = window.confirm(
      'Biztosan törlöd ezt az eseményt?'
    );
    if (!confirmed) return;

    this.eventapi
      .deleteEvent$(this.event.id, this.event.organization_id)
      .subscribe({
        next: () => {
          this.router.navigate(['/ownevents']);
        },
        error: () => {},
      });
  }

  private patchFormFromEvent() {
    if (!this.event) return;

    this.eventForm.patchValue({
      title: this.event?.title ?? '',
      date: this.toDatetimeLocal(this.event?.date),
      location: this.event?.location ?? '',
      capacity: this.event?.capacity ?? null,
      status: this.event?.status ?? 'Aktív',
      description: this.event?.description ?? '',
    });
  }

  private toDatetimeLocal(value: any): string {
    if (!value) return '';

    const d = new Date(value);
    if (Number.isNaN(d.getTime())) {
      return String(value);
    }

    const pad = (n: number) => String(n).padStart(2, '0');

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }


  private buildPayloadFromForm() {
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
}