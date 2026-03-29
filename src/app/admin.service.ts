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

  activateUser$(id: number) {
    const url = this.host + `makeactive/${id}`;
    return this.http.post(url, {}, {
      headers:{
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  inactivateUser$(id: number) {
    const url = this.host + `makeinactive/${id}`;
    return this.http.post(url, {}, {
      headers:{
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  deleteUser$(id: number) {
    const url = this.host + `deleteuser/${id}`;
    return this.http.delete(url,{
      headers:{
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
}
}
