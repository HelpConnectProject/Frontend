import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Organizationapi } from '../shared/organizationapi';
import { Eventapi } from '../shared/eventapi';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-aboutorganization',
  imports: [RouterLink, DatePipe],
  templateUrl: './aboutorganization.html',
  styleUrl: './aboutorganization.css',
})
export class Aboutorganization implements OnInit {
    // Segédfüggvény csillagokhoz
    getStars(count: number): number[] {
      return Array(count).fill(0).map((_, i) => i + 1);
    }
  org: any = null;
  events: any = null;
  eventfeedbacks: any = null;
  loading = true;

  addFeedback(eventId: number, formEvent: Event) {
    formEvent.preventDefault();
    const target = formEvent.target as HTMLFormElement;
    const comment = (target.elements.namedItem('comment') as HTMLInputElement).value;
    const rating = +(target.elements.namedItem('rating') as HTMLInputElement).value;
    const payload = { comment, rating };
    this.organizationapi.addEventFeedback$(eventId, payload).subscribe({
      next: () => {
        // Frissítjük az adott event feedbacks tömbjét
        const event = this.events.find((e: any) => e.id === eventId);
        if (event) {
          this.organizationapi.getEventFeedbacks$(eventId).subscribe({
            next: (result: any) => {
              event.feedbacks = result.data;
            },
            error: () => {}
          });
        }
        // Form ürítése
        target.reset();
      },
      error: () => {
        // Hibakezelés
        alert('Nem sikerült elküldeni a visszajelzést.');
      }
    });
  }
  constructor(private route: ActivatedRoute, private organizationapi: Organizationapi, private eventapi: Eventapi) {}



  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.organizationapi.getOrganizations$().subscribe({
        next: (result: any) => {
          const orgs = result.data;
          this.org = orgs.find((o: any) => o.id == id);
          this.loading = false;
          if (this.org && this.org.id) {
            this.eventapi.getInactiveEvents$(this.org.id).subscribe({
              next: (result: any) => {

                this.events = result.data;
                console.log(this.events);
                if (this.events && this.events.length > 0) {
                    for (const event of this.events) {
                      this.organizationapi.getEventFeedbacks$(event.id).subscribe({
                        next: (result: any) => {
                          console.log(result.data);
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
