import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, from } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { Sidebar } from '../_models/sidebar';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User;

  mainPhotoUrl = new BehaviorSubject<string>('../../assets/user.png');
  sidebarToggle = new BehaviorSubject<Sidebar>({
    isOpen: false,
    recipientId: 0,
  });
  currentPhotoUrl = this.mainPhotoUrl.asObservable();
  currentSidebar = this.sidebarToggle.asObservable();

  constructor(private http: HttpClient) {}

  setSidebar(setBool: boolean, recipientId: number) {
    this.sidebarToggle.next({ isOpen: setBool, recipientId: recipientId });
  }

  changeMemberPhoto(photoUrl: string) {
    this.mainPhotoUrl.next(photoUrl);
  }

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model).pipe(
      map((response: any) => {
        const resObj = response;
        if (resObj) {
          localStorage.setItem('token', resObj.token);

          localStorage.setItem('user', JSON.stringify(resObj.user));

          this.decodedToken = this.jwtHelper.decodeToken(resObj.token);
          this.currentUser = resObj.user;
          this.changeMemberPhoto(this.currentUser.photoUrl);

          if (window.location.pathname === '/') {
            location.reload();
          }
        }
      })
    );
  }

  register(user: User) {
    return this.http.post(this.baseUrl + 'register', user);
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }
}
