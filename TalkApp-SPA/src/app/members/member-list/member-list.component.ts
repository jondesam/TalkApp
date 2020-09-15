import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { AlertifyService } from '../../_services/alertify.service';
import { UserService } from '../../_services/user.service';
import { ActivatedRoute } from '@angular/router';
import { PaginatedResult, Pagination } from 'src/app/_models/Pagination';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  userParams: any = {};

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      console.log(data);

      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });
    // this.loadUsers();
    this.userParams.orderBy = 'create';
    this.userParams.search = '';
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
        this.userParams
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

  resetFilters() {
    this.userParams.search = '';
    this.loadUsers();
  }
}
