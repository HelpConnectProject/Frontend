import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
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
  filteredOrganizations: any[] = [];
  categoryImageFor = categoryImageFor;
  searchForm: FormGroup;
  categories: string[] = [
    'Szociális és humanitárius szervezetek',
    'Egészségügyi szervezetek',
    'Oktatási és tudományos szervezetek',
    'Környezetvédelmi szervezetek',
    'Emberi jogi és jogvédő szervezetek',
    'Kulturális és művészeti szervezetek',
    'Sport és szabadidős szervezetek',
    'Ifjúsági és közösségfejlesztő szervezetek',
    'Érdekvédelmi és szakmai szervezetek'
  ];

  constructor(
    private organizationapi: Organizationapi,
    public authService: AuthService,
    private build: FormBuilder
  ) {
    this.searchForm = this.build.group({
      name: [''],
      category: [''],
      address: [''],
    });
  }

  ngOnInit(): void {
    this.getOrganizations();
    this.searchForm.valueChanges.subscribe(() => {
      this.filterOrganizations();
    });
  }

  getOrganizations(): void {
    this.organizationapi.getOrganizations$().subscribe({
      next: (result: any) => {
        this.organizations = result?.data ?? [];
        this.filteredOrganizations = this.organizations;
        this.filterOrganizations();
      },
      error: () => {
        this.organizations = [];
        this.filteredOrganizations = [];
      }
    });
  }

  filterOrganizations(): void {
    if (!this.organizations) return;
    const nameFilter = this.searchForm.get('name')?.value?.toLowerCase().trim() || '';
    const categoryFilter = this.searchForm.get('category')?.value?.trim() || '';
    const addressFilter = this.searchForm.get('address')?.value?.toLowerCase().trim() || '';

    this.filteredOrganizations = this.organizations.filter((org: any) => {
      const orgName = (org.name || '').toLowerCase();
      const orgCategory = (org.category || '').trim();
      const orgAddress = (org.address || '').toLowerCase();

      const nameMatch = nameFilter === '' || orgName.includes(nameFilter);
      const categoryMatch = categoryFilter === '' || orgCategory === categoryFilter;
      const addressMatch = addressFilter === '' || orgAddress.includes(addressFilter);

      return nameMatch && categoryMatch && addressMatch;
    });
  }
}