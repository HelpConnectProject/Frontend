import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class Eventregistrationapi {
	readonly host = environment.host;
  constructor(private http: HttpClient) {}
  
  registerEvent$( eventId : number) {
    const url = this.host + `registerevent/${eventId}`;
    return this.http.post(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
  }
  getOwnEventRegistrations$() {
    const url = this.host + `owneventregistrations`;
    return this.http.get(
      url,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
  }
  deleteEventRegistration$(eventRegistrationId: number) {
    const url = this.host + `deleteeventregistration/${eventRegistrationId}`;
    return this.http.delete(
      url,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
  }
}
