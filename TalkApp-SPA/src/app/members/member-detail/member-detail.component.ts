import { Component, OnInit, TemplateRef } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/_services/user.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/_services/auth.service';
import { Rate } from 'src/app/_models/rate';
import { Router } from '@angular/router';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit {
  user: User;
  modalRef: BsModalRef;
  newRate: any = {};

  constructor(
    private userService: UserService,
    private alerify: AlertifyService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.user = data['user'];
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  createRate() {
    console.log(this.newRate);

    this.userService
      .createRate(
        this.authService.decodedToken.nameid,
        this.user.id,
        this.newRate.comment,
        this.newRate.score
      )
      .subscribe(
        (rate: Rate) => {
          this.router.navigate(['/home']);
        },
        (error) => {
          this.alerify.error(error);
        }
      );
  }

  loggedIn() {
    return this.authService.loggedIn();
  }
}
