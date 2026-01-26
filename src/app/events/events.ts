import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Eventapi } from '../shared/eventapi';


@Component({
  selector: 'app-events',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './events.html',
  styleUrl: './events.css',
})
export class Events implements OnInit {
  events: any = null;
  filteredEvents: any = null;
  expandedEventId: number | null = null;
  searchForm: FormGroup;
  searchEventName: string = '';
  searchLocation: string = '';

  constructor(
    private eventapi: Eventapi,
    private build: FormBuilder
  ) {
    this.searchForm = this.build.group({
      eventName: [''],
      location: ['']
    });
  }
  
  ngOnInit() {
    this.getEvents();
    
    this.searchForm.valueChanges.subscribe(() => {
      this.filterEvents();
    });
  }

  getEvents() {
    this.eventapi.getEvents$().subscribe({
      next: (result: any) => {
        this.events = result.data;
        this.filteredEvents = result.data;
        console.log(this.events);
      },
      error: () => {},
    });
  }

  filterEvents() {
    if (!this.events) {
      return;
    }

    const nameFilter = this.searchForm.get('eventName')?.value?.toLowerCase().trim() || '';
    const locationFilter = this.searchForm.get('location')?.value?.toLowerCase().trim() || '';

    this.filteredEvents = this.events.filter((event: any) => {
      const eventName = (event.title || '').toLowerCase();
      const eventLocation = (event.location || '').toLowerCase();

      const nameMatch = nameFilter === '' || eventName.includes(nameFilter);
      const locationMatch = locationFilter === '' || eventLocation.includes(locationFilter);

      return nameMatch && locationMatch;
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
