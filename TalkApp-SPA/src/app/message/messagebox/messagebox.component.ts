import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../../_services/alertify.service';
import { AuthService } from '../../_services/auth.service';
import { UserService } from '../../_services/user.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { tap } from 'rxjs/operators';
import { Message } from 'src/app/_models/Message';

@Component({
  selector: 'app-messagebox',
  templateUrl: './messagebox.component.html',
  styleUrls: ['./messagebox.component.css'],
})
export class MessageboxComponent implements OnInit {
  messages: Message[];
  modalRef: BsModalRef;
  recipientId: number = 0;
  newMessage: any = {};
  messageThread: Message[];
  chatWith: string = '';
  chatPhotoWith: string = null;
  constructor(
    private userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private alertify: AlertifyService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.messages = data['messages'];
      console.log(this.messages);
    });
  }

  closeModal() {
    this.modalRef.hide();
  }

  loadThread(
    template: TemplateRef<any>,
    message: Message
  ) {
    const currentUserId = +this.authService.decodedToken.nameid;

    this.recipientId = message.recipientId;
    this.chatWith = message.recipientUserName;
    this.chatPhotoWith = message.recipientPhotoUrl;

    if (message.recipientId === currentUserId) {
      this.recipientId = message.senderId;
      this.chatWith = message.senderUserName;
      this.chatPhotoWith = message.senderPhotoUrl;
    }

    this.userService
      .getMessageThread(currentUserId, this.recipientId)
      .pipe(
        //In order to mark as read
        tap((messages) => {
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
          this.messageThread = messages;
        },
        (error) => {
          this.alertify.error(error);
        }
      );
    this.modalRef = this.modalService.show(template);
  }

  sendMessage() {
    this.newMessage.recipientId = this.recipientId;

    this.userService
      .sendMessage(this.authService.decodedToken.nameid, this.newMessage)
      .subscribe(
        (message: Message) => {
          this.messageThread.push(message);
          this.newMessage.content = '';
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }
}
