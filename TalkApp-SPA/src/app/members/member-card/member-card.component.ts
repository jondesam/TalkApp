import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TitleCasePipe } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;
  model: any = {};
  modalRef: BsModalRef;
  isFavo: boolean = false;

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService,
    private modalService: BsModalService,
    private titlecasePipe: TitleCasePipe,
    private router: Router
  ) {}

  ngOnInit() {}

  sendLike(recipientId: number) {
    this.userService
      .sendLike(this.authService.decodedToken.nameid, recipientId)
      .subscribe(
        (data) => {
          if (data === null) {
            this.alertify.success(
              'Liked ' + this.titlecasePipe.transform(this.user.userName)
            );
          } else {
            this.alertify.error(
              'Unliked ' + this.titlecasePipe.transform(this.user.userName)
            );
          }
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  login() {
    this.authService.login(this.model).subscribe(
      (next) => {
        this.userService
          .getLastMessages(this.authService.decodedToken.nameid)
          .pipe(
            catchError((error) => {
              this.alertify.error('Problem retrieving messages');
              this.router.navigate(['']);
              return of(null);
            })
          )
          .subscribe((messages) => {
            for (let i = 0; i < messages.length; i++) {
              if (
                messages[i].isRead === false &&
                messages[i].recipientId ===
                  +this.authService.decodedToken.nameid
              ) {
                this.authService.setNewMessageBadge(true);
              }
            }
          });

        this.alertify.success('Logged in successfully');
      },
      (error) => {
        this.alertify.error(error);
      }
    );
  }

  toggleIsFavo(favo: boolean) {
    this.isFavo = favo;
    return this.isFavo;
  }

  setChosenUserId() {
    this.userService.setChosenUserId(this.user.id);
  }
}
