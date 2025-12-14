import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  
  host = "http://localhost:8000/api/";

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
}
