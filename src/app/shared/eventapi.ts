import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Eventapi {
  host = 'http://localhost:8000/api/'
  constructor(private http: HttpClient) {}

  getEvents$() {
    const url = this.host + 'events';
    return this.http.get(url);
  }
}

