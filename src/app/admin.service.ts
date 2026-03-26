import { Injectable } from '@angular/core';
import { environment } from '../../environments/enviroment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  readonly host = environment.host;
  constructor(private http: HttpClient) {}
  
  getUsers$() {
    const url = this.host + 'users';
    return this.http.get(url,{
      headers:{
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
}
