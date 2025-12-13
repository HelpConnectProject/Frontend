
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(localStorage.getItem('isLoggedIn') === 'true');
  isLoggedIn$ = this.isLoggedInSubject.asObservable(); 

  private id = new BehaviorSubject<string | null>(localStorage.getItem('id'));
  id$ = this.id.asObservable();


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
      this.id.next(null);
    }
  }
}
