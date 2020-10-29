import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../../_services/alertify.service';
import { AuthService } from '../../_services/auth.service';
import { UserService } from '../../_services/user.service';
import { tap } from 'rxjs/operators';
import { Message } from 'src/app/_models/Message';
import { Pagination } from 'src/app/_models/pagination';

@Component({
  selector: 'app-messagebox',
  templateUrl: './messagebox.component.html',
  styleUrls: ['./messagebox.component.css'],
})
export class MessageboxComponent implements OnInit {
  lastMessages: Message[];
  newMessage: any = {};
  messageThread: Message[] = null;
  chosenMessage: Message;
  loadMoreBtnName = 'No more messages';

  chatWith: string = '';
  chatPhotoWith: string = '../../../assets/user.png';
  pagination: Pagination = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
  };

  constructor(
    private userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.lastMessages = data['messages'];
    });
    this.loadThread(this.lastMessages[0]);

    this.authService.setNewMessageBadge(false);
  }

  selectMessage(message: Message) {
    message.isRead = true;
    this.messageThread = [];
    this.pagination.currentPage = 1;
    this.loadThread(message);
  }

  loadMore() {
    ++this.pagination.currentPage;
    this.loadThread(this.chosenMessage);
  }

  loadThread(chosenMessage: Message) {
    this.chosenMessage = chosenMessage;

    //User sent message
    if (chosenMessage.recipientId === +this.authService.decodedToken.nameid) {
      this.newMessage.recipientId = chosenMessage.senderId;
      this.chatWith = chosenMessage.senderUserName;

      if (chosenMessage.senderPhotoUrl === null) {
        this.chatPhotoWith = '../../../assets/user.png';
      } else {
        this.chatPhotoWith = chosenMessage.senderPhotoUrl;
      }
    }

    //User recieved message
    if (chosenMessage.recipientId !== +this.authService.decodedToken.nameid) {
      this.newMessage.recipientId = chosenMessage.recipientId;
      this.chatWith = chosenMessage.recipientUserName;

      if (chosenMessage.recipientPhotoUrl === null) {
        this.chatPhotoWith = '../../../assets/user.png';
      } else {
        this.chatPhotoWith = chosenMessage.recipientPhotoUrl;
      }
    }

    this.setLoadMoreBtn();

    this.userService
      .getMessageThread(
        +this.authService.decodedToken.nameid,
        this.newMessage.recipientId,
        this.pagination.currentPage,
        this.pagination.itemsPerPage
      )
      .pipe(
        //In order to mark as read
        tap((messages) => {
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

          if (this.messageThread === null) {
            this.messageThread = messages.result.reverse();
          } else {
            Array.prototype.push.apply(
              this.messageThread.reverse(),
              messages.result
            );
            this.messageThread.reverse();
          }
        },
        (error) => {
          console.log(error);
          this.alertify.error('error');
        }
      );
  }

  sendMessage() {
    this.userService
      .sendMessage(this.authService.decodedToken.nameid, this.newMessage)
      .subscribe(
        (message: Message) => {
          this.lastMessages = this.lastMessages.filter((message) => {
            return message.id !== this.chosenMessage.id;
          });
          this.chosenMessage = message;
          this.messageThread.push(message);
          this.lastMessages.unshift(message);
          this.newMessage.content = '';
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }

  setLoadMoreBtn() {
    if (this.pagination.currentPage === this.pagination.totalPages) {
      this.loadMoreBtnName = 'No more messages';
      return true;
    }
    if (this.lastMessages.length === 0) {
      this.loadMoreBtnName = 'No messages';
      return true;
    }
    this.loadMoreBtnName = 'Load more messages';
    return false;
  }
}
