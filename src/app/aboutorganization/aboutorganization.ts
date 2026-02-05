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
  org: any = null;
  events: any = null;
  loading = true;
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
