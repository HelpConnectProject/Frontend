import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
	readonly host = environment.host;

  constructor(private http: HttpClient) {}

  login$(user: any) {
    return this.http.post(this.host + "login", user);
  } 

  register$(token: any) {
    return this.http.post(this.host + "register", token);
  }

  logout$(data : any) {
    const url = this.host + "logout";
    return this.http.post(url, data,{
      headers:{
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
  getOwnProfile$(data : any) {
    const url = this.host + "ownprofile";
    return this.http.get(url, {
      headers:{
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
  updateOwnProfile$(data : any) {
    const url = this.host + "updateprofile";
    return this.http.put(url, data, {
      headers:{
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

}
