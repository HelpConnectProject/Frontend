import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Organizationapi } from '../shared/organizationapi';
import { RouterLink } from '@angular/router';
import { categoryImageFor } from '../shared/category-image';
import { AuthService } from '../shared/auth-service';

@Component({
  selector: 'app-organizations',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './organizations.html',
  styleUrl: './organizations.css',
})
export class Organizations implements OnInit {

  organizations: any[] = [];
  categoryImageFor = categoryImageFor;

  constructor(
    private organizationapi: Organizationapi,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getOrganizations();
  }

  getOrganizations(): void {
    this.organizationapi.getOrganizations$().subscribe({
      next: (result: any) => {
        this.organizations = result?.data ?? [];
      },
      error: () => {
        this.organizations = [];
      }
    });
  }
}