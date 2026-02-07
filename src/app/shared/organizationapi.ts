import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Organizationapi {

  host = 'http://localhost:8000/api/'
  constructor(private http: HttpClient) {}

  getOrganizations$() {
    const url = this.host + 'organizations';
    return this.http.get(url);
  }

  getOwnOrganizations$() {
    const url = this.host + 'ownorganizations';
    return this.http.get(url,{
      headers:{
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getEventFeedbacks$(id : number) {
    const url = this.host + 'eventfeedbacks/'+id;
    return this.http.get(url);
  }

  addEventFeedback$(id : number, payload : any){
    const url = this.host + 'createfeedback/' + id;
    return this.http.post(url, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  deleteFeedback$(id: number) {
    const url = `${this.host}deletefeedback/${id}`;
    return this.http.delete(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  

  addOrganization$(payload: any) {
    const url = this.host + 'addorganization';
    return this.http.post(url, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  updateOrganization$(id: number, payload: any) {
    const url = `${this.host}updateorganization/${id}`;
    return this.http.put(url, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  deleteOrganization$(id: number) {
    const url = `${this.host}deleteorganization/${id}`;
    return this.http.delete(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  

  
}
