import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './_models/user';
import { Sidebar } from './_models/sidebar';
import { Message } from './_models/Message';
import { UserService } from './_services/user.service';
import { AlertifyService } from './_services/alertify.service';
import { tap } from 'rxjs/operators';
import { Pagination } from './_models/pagination';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  jwtHelper = new JwtHelperService();
  _opened: boolean = false;
  recipientId: number = 0;

  messages: Message[] = null;
  newMessage: any = {};
  pagination: Pagination = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: null,
  };

  loadMoreBtnName = 'Load more messages';
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

      if (this.recipientId) {
        this.loadMessages();
      }
    });
  }

  _toggleSidebar() {
    this._opened = !this._opened;
  }

  loadMessages() {
    ++this.pagination.currentPage;
    this.setLoadMoreBtn();
    const currentUserId = +this.authService.decodedToken.nameid;
    this.userService
      .getMessageThread(
        this.authService.decodedToken.nameid,
        this.recipientId,
        this.pagination.currentPage,
        this.pagination.itemsPerPage
      )
      .pipe(
        //In order to mark as read
        tap((messages) => {
          console.log(messages);
          let messagesToCheck = messages.result;
          for (let i = 0; i < messagesToCheck.length; i++) {
            if (
              messagesToCheck[i].isRead === false &&
              messagesToCheck[i].recipientId ===
                +this.authService.decodedToken.nameid
            ) {
              this.userService.markAsRead(
                +this.authService.decodedToken.nameid,
                messagesToCheck[i].id
              );
            }
          }
        })
      )
      .subscribe(
        (messages) => {
          this.pagination = messages.pagination;
          if (this.messages === null) {
            this.messages = messages.result.reverse();
          } else {
            Array.prototype.push.apply(
              this.messages.reverse(),
              messages.result
            );
            this.messages.reverse();
          }
        },
        (error) => {
          console.log(error);

          this.alertify.error('error');
        }
      );
  }

  sendMessage() {
    this.newMessage.recipientId = this.recipientId;

    this.userService
      .sendMessage(this.authService.decodedToken.nameid, this.newMessage)
      .subscribe(
        (message: Message) => {
          this.messages.push(message);

          this.newMessage.content = '';
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  onClose() {
    this.pagination.currentPage = 0;
    this.messages = null;
  }

  setLoadMoreBtn() {
    if (this.pagination.currentPage === this.pagination.totalPages) {
      this.loadMoreBtnName = 'No more messages';
      return true;
    }
    this.loadMoreBtnName = 'Load more messages';
    return false;
  }
}
