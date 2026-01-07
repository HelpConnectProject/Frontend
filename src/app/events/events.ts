import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
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
  expandedEventId: number | null = null;

  constructor(
    private eventapi: Eventapi,
    private build: FormBuilder
  ) {}
  
  ngOnInit() {
    this.getEvents();
  }

  getEvents() {
    this.eventapi.getEvents$().subscribe({
      next: (result: any) => {
        this.events = result.data;
        console.log(this.events);
      },
      error: () => {},
    });
  }

  toggleExpanded(eventId: number) {
    this.expandedEventId = this.expandedEventId === eventId ? null : eventId;
  }
}
