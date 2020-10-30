import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { AlertifyService } from '../../_services/alertify.service';
import { UserService } from '../../_services/user.service';
import { ActivatedRoute } from '@angular/router';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  userParams: any = {};
  btnName: string = 'Highest Rated';

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });
    this.userParams.orderBy = 'score';
    this.userParams.search = '';

    if (this.loggedIn()) {
      console.log('GG');

      this.userService
        .getLastMessages(this.authService.decodedToken.nameid)
        .pipe(
          catchError((error) => {
            this.alertify.error('Problem retrieving messages');
            // this.router.navigate(['']);
            return of(null);
          })
        )
        .subscribe((messages) => {
          for (let i = 0; i < messages.length; i++) {
            if (
              messages[i].isRead === false &&
              messages[i].recipientId === +this.authService.decodedToken.nameid
            ) {
              console.log('NEW Messages D');
              this.authService.setNewMessageBadge(true);
            }
          }
        });
    }
  }

  pageChanged(event: any): void {
    console.log(event);
    this.pagination.currentPage = event.page;
    console.log(this.pagination.currentPage);

    this.loadUsers();
  }

  loadUsers() {
    this.userService
      .getUsers(
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.userParams,
        null,
        null
      )
      .subscribe(
        (res: PaginatedResult<User[]>) => {
          this.users = res.result;
          this.pagination = res.pagination;
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }

  setBtnName(btnName: string) {
    this.btnName = btnName;
  }

  loggedIn() {
    return this.authService.loggedIn();
  }
}
