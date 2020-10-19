import { Component, OnInit, TemplateRef } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/_services/user.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/_services/auth.service';
import { Rate } from 'src/app/_models/rate';
import { Router } from '@angular/router';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { parse } from 'path';
import { error } from 'console';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit {
  user: User;
  modalRef: BsModalRef;
  newRate: any = {};
  mainPhotoUrl: string;
  senderId: number;
  rates: Rate[];
  pagination: Pagination;

  subjectTitle: string;
  model: any = {};
  isFavo: boolean = false;
  avgRate: number;

  isCurrentUser: boolean = false;

  tutorEditBtnName: string = 'Become a Tutor';
  isCurrentUserProfile = false;
  isCollapsed = false;
  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    public authService: AuthService // private router: Router
  ) {}

  ngOnInit() {
    console.log();

    this.route.data.subscribe((data) => {
      console.log(data);

      this.user = data['user'];
      this.avgRate = data['user'].avgRate;
      this.rates = data['rates'].result;
      this.pagination = data['rates'].pagination;
      this.senderId = parseInt(this.authService.decodedToken.nameid);

      if (this.user.id === parseFloat(this.authService.decodedToken.nameid)) {
        this.isCurrentUser = true;
      }
      if (this.user.skills.length > 0) {
        this.tutorEditBtnName = 'Edit Profile';
      }
    });

    this.loadRates();

    this.authService.currentPhotoUrl.subscribe(
      (photoUrl) => (this.mainPhotoUrl = photoUrl)
    );

    console.log(this.user);
    this.subjectTitle = this.user.skills[0]?.skillName;

    if (this.user.id === parseInt(this.authService.decodedToken.nameid)) {
      this.isCurrentUser = true;
    }
  }

  sendLike(recipientId: number) {
    this.userService
      .sendLike(this.authService.decodedToken.nameid, recipientId)
      .subscribe(
        (data) => {
          if (data === null) {
            this.alertify.success('Liked ' + this.user.userName);
          } else {
            this.alertify.error('Unliked ' + this.user.userName);
          }
        },
        (error) => {
          console.log(error);

          // this.alertify.error("Error");
        }
      );
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
          let sum = this.avgRate * this.rates.length;
          this.rates.unshift(rate);
          let newSum = sum + rate.score;
          this.avgRate = newSum / this.rates.length;
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  setSidebar() {
    this.authService.setSidebar(true, this.user.id);
  }

  deleteRate(rateId: number) {
    console.log('rer', rateId);

    this.alertify.confirm(
      'Are you sure you want to delete this message?',
      () => {
        this.userService
          .deleteRate(this.authService.decodedToken.nameid, rateId)
          .subscribe(
            (next) => {
              const objToDelete: Rate[] = this.rates.filter(
                (rate) => rate.id === rateId
              );

              this.rates = this.rates.filter(
                (rate) => rate.id !== objToDelete[0].id
              );

              this.alertify.success('Your rate has been deleted');
            },
            (error) => {
              this.alertify.error(error);
            }
          );
      }
    );
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadRates();
  }

  loadRates() {
    this.userService
      .getRates(
        this.user.id,
        this.pagination.currentPage,
        this.pagination.itemsPerPage
      )
      .subscribe(
        (res: PaginatedResult<Rate[]>) => {
          // console.log('loadRates', res);

          this.rates = res.result;
          this.pagination = res.pagination;
          // console.log(this.senderId, this.rates);
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }

  setSubject(subjectTitle: string) {
    this.subjectTitle = subjectTitle;
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

  getLastMessages() {
    this.userService
      .getLastMessages(this.authService.decodedToken.nameid)
      .subscribe(
        (res: any) => {
          console.log('last messages', res);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
