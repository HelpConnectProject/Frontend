import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Organizationapi {
  constructor(private http: HttpClient) {}

  getOrganizations$() {
    const url = 'http://localhost:8000/api/organizations';
    return this.http.get(url);
  }
}
