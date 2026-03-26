
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isLoggedInSubject = new BehaviorSubject<boolean>(localStorage.getItem('isLoggedIn') === 'true');
  isLoggedIn$ = this.isLoggedInSubject.asObservable(); 

  private id = new BehaviorSubject<string | null>(localStorage.getItem('id'));
  id$ = this.id.asObservable();

  private role = new BehaviorSubject<string | null>(localStorage.getItem('role'));
  role$ = this.role.asObservable();


  setLoggedIn(value: boolean, id?: any) {
    this.isLoggedInSubject.next(value);
    if (id !== undefined) {
      localStorage.setItem('id', id);
      this.id.next(id);
    }
    if (value) {
      localStorage.setItem('isLoggedIn', 'true');

    } else {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('token');
      localStorage.removeItem('id');
      localStorage.removeItem('role');
      this.id.next(null);
      this.role.next(null);
    }
  }

  setRole(role: string | null) {
    if (!role) {
      localStorage.removeItem('role');
      this.role.next(null);
      return;
    }
    localStorage.setItem('role', role);
    this.role.next(role);
  }

  isSuperAdmin() {
    return localStorage.getItem('role') === 'superadmin';
  }
}
