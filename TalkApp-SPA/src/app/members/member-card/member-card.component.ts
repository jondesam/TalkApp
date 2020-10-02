import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { Rate } from 'src/app/_models/rate';
import { Skill } from 'src/app/_models/skill';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

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
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    console.log(this.user);
  }

  sendLike(recipientId: number) {
    this.userService
      .sendLike(this.authService.decodedToken.nameid, recipientId)
      .subscribe(
        (data) => {
          this.alertify.success('You have liked: ' + this.user.userName);
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
    console.log(this.model);
    this.authService.login(this.model).subscribe(
      (next) => {
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
}
