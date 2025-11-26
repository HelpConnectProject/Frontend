import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Organizationapi } from '../shared/organizationapi';

@Component({
  selector: 'app-organizations',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './organizations.html',
  styleUrl: './organizations.css',
})
export class Organizations implements OnInit {
  organizations: any;
  expandedOrgId: number | null = null;

  constructor(
    private organizationapi: Organizationapi,
    private build: FormBuilder
  ) {}

  getOrganizations() {
    this.organizationapi.getOrganizations$().subscribe({
      next: (result: any) => {
        this.organizations = result;
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
