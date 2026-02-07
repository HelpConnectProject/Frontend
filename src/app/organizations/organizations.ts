import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Organizationapi } from '../shared/organizationapi';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-organizations',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './organizations.html',
  styleUrl: './organizations.css',
})
export class Organizations implements OnInit {
  organizations: any = null;

  constructor(
    private organizationapi: Organizationapi
  ) {}

  getOrganizations() {
    this.organizationapi.getOrganizations$().subscribe({
      next: (result: any) => {
        this.organizations = result.data;
      },
      error: () => {},
    });
  }

  ngOnInit() {
    this.getOrganizations();
  }
}
