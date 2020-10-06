import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './_models/user';
import { Sidebar } from './_models/sidebar';
import { Message } from './_models/Message';
import { UserService } from './_services/user.service';
import { AlertifyService } from './_services/alertify.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  jwtHelper = new JwtHelperService();
  _opened: boolean = false;
  recipientId: number = 0;

  messages: Message[];
  newMessage: any = {};

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    const user: User = JSON.parse(localStorage.getItem('user'));

    if (token) {
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
    }
    if (user) {
      this.authService.currentUser = user;
      this.authService.changeMemberPhoto(user.photoUrl);
    }

    this.authService.currentSidebar.subscribe((obj: Sidebar) => {
      this._opened = obj.isOpen;

      this.recipientId = obj.recipientId;
      console.log(this.recipientId);
      if (this.recipientId) {
        this.loadMessages();
      }
    });
  }

  _toggleSidebar() {
    console.log(this._opened, this.recipientId);

    this._opened = !this._opened;
  }

  loadMessages() {
    const currentUserId = +this.authService.decodedToken.nameid;
    this.userService
      .getMessageThread(this.authService.decodedToken.nameid, this.recipientId)
      .pipe(
        //In order to mark as read
        tap((messages) => {
          // console.log('me', messages);

          for (let i = 0; i < messages.length; i++) {
            if (
              messages[i].isRead === false &&
              messages[i].recipientId === currentUserId
            ) {
              this.userService.markAsRead(currentUserId, messages[i].id);
            }
          }
        })
      )
      .subscribe(
        (messages) => {
          this.messages = messages;
          // console.log('messages', messages);
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }

  sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    console.log('newMessage', this.newMessage);

    this.userService
      .sendMessage(this.authService.decodedToken.nameid, this.newMessage)
      .subscribe(
        (message: Message) => {
          console.log(this.messages);

          this.messages.unshift(message);
          console.log(this.messages);

          this.newMessage.content = '';
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }
  // Check if user is log in or not
  loggedIn() {
    return this.authService.loggedIn();
  }
}
