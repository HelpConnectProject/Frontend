import { Injectable } from '@angular/core';
import { environment } from '../../../environments/enviroment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Memberapi {
  readonly host = environment.host;
  constructor(private http: HttpClient) {}

  getMembers$(memberId: number) {
    const url = this.host + 'organizationmembers/' + memberId;
    return this.http.get(url,{
      headers:{
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getUserByEmail$(email: string) {
    const url = this.host + `userbyemail?email=${encodeURIComponent(email)}`;
    return this.http.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  }
  addMember$(organizationId: number, userId: number) {
    const url = this.host + `addmanager/${organizationId}/${userId}`;
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

  deleteMember$(organizationId: number, userId: number) {
    const url = this.host + `deletemanager/${organizationId}/${userId}`;
    return this.http.delete(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  }


}
