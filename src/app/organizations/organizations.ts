import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
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
  expandedOrgId: number | null = null;

  constructor(
    private organizationapi: Organizationapi,
    private build: FormBuilder
  ) {}

  getOrganizations() {
    this.organizationapi.getOrganizations$().subscribe({
      next: (result: any) => {
        this.organizations = result.data;
        console.log(this.organizations.data);
      },
      error: () => {},
    });
  }

  toggleExpanded(orgId: number) {
    this.expandedOrgId = this.expandedOrgId === orgId ? null : orgId;
  }

  ngOnInit() {
    this.getOrganizations();
  }
}
