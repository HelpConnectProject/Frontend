import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Eventapi } from '../shared/eventapi';
import { Organizationapi } from '../shared/organizationapi';
import { Eventregistrationapi } from '../shared/eventregistrationapi';
import { categoryImageFor } from '../shared/category-image';
import { AuthService } from '../shared/auth-service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './events.html',
  styleUrl: './events.css',
})
export class Events implements OnInit {

  events: any = null;
  organizations: any = null;
  owneventregistrations: any[] = [];
  organizationNameById: Record<number, string> = {};
  organizationCategoryById: Record<number, string> = {};
  categoryImageFor = categoryImageFor;
  filteredEvents: any = null;
  searchForm: FormGroup;

  constructor(
    private eventapi: Eventapi,
    private build: FormBuilder,
    private organizationapi: Organizationapi,
    private eventregistrationapi: Eventregistrationapi,
    public authService: AuthService   // ✅ PUBLIC
  ) {
    this.searchForm = this.build.group({
      eventName: [''],
      location: [''],
      organizationName: [''],
      onlyRegistered: [false],
    });
  }

  ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    const orgName = urlParams.get('organizationName');
    if (orgName) {
      this.searchForm.patchValue({ organizationName: orgName });
    }

    this.getEvents();
    this.getOrganizations();

    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.getOwnEventRegistrations();
      } else {
        this.owneventregistrations = [];
        this.filterEvents();
      }
    });

    this.searchForm.valueChanges.subscribe(() => {
      this.filterEvents();
    });
  }

  getEvents() {
    this.eventapi.getEvents$().subscribe({
      next: (result: any) => {
        this.events = result.data;
        this.filteredEvents = result.data;
        this.filterEvents();
      },
      error: () => {},
    });
  }

  getOrganizations() {
    this.organizationapi.getOrganizations$().subscribe({
      next: (result: any) => {
        this.organizations = result.data;
        this.organizationNameById = {};
        this.organizationCategoryById = {};

        for (const org of this.organizations) {
          const id = org.id;
          this.organizationNameById[id] = org.name;
          if (org?.category) {
            this.organizationCategoryById[id] = org.category;
          }
        }
        this.filterEvents();
      },
      error: () => {},
    });
  }

  getOwnEventRegistrations() {
    this.eventregistrationapi.getOwnEventRegistrations$().subscribe({
      next: (result: any) => {
        this.owneventregistrations = result.data;
        this.filterEvents();
      },
      error: () => {
        this.owneventregistrations = [];
        this.filterEvents();
      }
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

  filterEvents() {
    if (!this.events) return;

    const nameFilter = this.searchForm.get('eventName')?.value?.toLowerCase().trim() || '';
    const locationFilter = this.searchForm.get('location')?.value?.toLowerCase().trim() || '';
    const orgFilter = this.searchForm.get('organizationName')?.value?.toLowerCase().trim() || '';
    const onlyRegistered = this.searchForm.get('onlyRegistered')?.value === true;

    const registeredEventIds = new Set<number>();
    for (const reg of this.owneventregistrations) {
      if (typeof reg?.event_id === 'number') {
        registeredEventIds.add(reg.event_id);
      }
    }

    this.filteredEvents = this.events.filter((event: any) => {
      const eventName = (event.title || '').toLowerCase();
      const eventLocation = (event.location || '').toLowerCase();
      const orgName = (this.organizationNameById[event.organization_id] || '').toLowerCase();

      const nameMatch = nameFilter === '' || eventName.includes(nameFilter);
      const locationMatch = locationFilter === '' || eventLocation.includes(locationFilter);
      const orgMatch = orgFilter === '' || orgName.includes(orgFilter);
      const registeredMatch = !onlyRegistered || registeredEventIds.has(event.id);

      return nameMatch && locationMatch && orgMatch && registeredMatch;
    });
  }

  clearFilters() {
    this.searchForm.reset();
    this.filteredEvents = this.events;
  }
}