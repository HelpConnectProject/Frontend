import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Eventapi } from '../shared/eventapi';
import { Organizationapi } from '../shared/organizationapi';
import { Eventregistrationapi } from '../shared/eventregistrationapi';


@Component({
  selector: 'app-events',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './events.html',
  styleUrl: './events.css',
})
export class Events implements OnInit {
  events: any = null;
  organizations: any = null;
  owneventregistrations: any[] = [];
  organizationNameById: Record<number, string> = {};
  filteredEvents: any = null;
  expandedEventId: number | null = null;
  searchForm: FormGroup;

  constructor(
    private eventapi: Eventapi,
    private build: FormBuilder,
    private organizationapi: Organizationapi,
    private eventregistrationapi: Eventregistrationapi
  ) {
    this.searchForm = this.build.group({
      eventName: [''],
      location: [''],
      organizationName: [''],
      onlyRegistered: [false],
    });
  }
  
  ngOnInit() {
    this.getEvents();
    this.getOrganizations();
    this.getOwnEventRegistrations();
    
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
        for (const org of this.organizations) {
          const id = org.id;
          this.organizationNameById[id] = org.name
        }
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
      error: (error) => {
        console.error('Error fetching own event registrations:', error);
        this.owneventregistrations = [];
        this.filterEvents();
      }
    });
  }

  deleteEventRegistration(eventRegistrationId: number) {
    for (const reg of this.owneventregistrations) {
      if (reg.event_id === eventRegistrationId) {
        eventRegistrationId = reg.id;
        break;
      }
    }
    this.eventregistrationapi.deleteEventRegistration$(eventRegistrationId).subscribe({
      next: () => {
        this.getOwnEventRegistrations();
      },
      error: (error) => {
        console.error('Error deleting event registration:', error);
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

  registerToEvent(eventId: number) {
    this.eventregistrationapi.registerEvent$(eventId).subscribe({
      next: () => {
        this.getOwnEventRegistrations();
      },
      error: (error) => {
        console.error('Error registering for event:', error);
      }
    });
  }

  filterEvents() {
    if (!this.events) {
      return;
    }

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

  toggleExpanded(eventId: number) {
    this.expandedEventId = this.expandedEventId === eventId ? null : eventId;
  }
}
