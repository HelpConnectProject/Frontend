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

 getOwnEvents$() {
    const url = this.host + 'ownevents';
    return this.http.get(url,{
      headers:{
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  addEvent$(payload: any, id : number) {
    const url = this.host + `createevent/${id}`;
    return this.http.post(url, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  updateEvent$(id: number, organizationId: number, payload: any) {
    const url = `${this.host}updateevent/${organizationId}/${id}`;
    return this.http.put(url, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  deleteEvent$(id: number, organizationId: number) {
    const url = `${this.host}deleteevent/${organizationId}/${id}`;
    return this.http.delete(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }



}

