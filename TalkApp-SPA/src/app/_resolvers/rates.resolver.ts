import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../_services/auth.service';
import { Rate } from '../_models/rate';

@Injectable()
export class RatesResolver implements Resolve<Rate[]> {
  pageNumber = 1;
  pageSize = 10;
  chosenUserId: number = 0;

  constructor(
    private userService: UserService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Rate[]> {
    this.userService.currentChosenUserId.subscribe((chosenUserId) => {
      this.chosenUserId = chosenUserId;
    });
    return this.userService
      .getRates(this.chosenUserId, this.pageNumber, this.pageSize)
      .pipe(
        catchError((error) => {
          this.alertify.error('Problem retrieving messages');
          this.router.navigate(['']);
          return of(null);
        })
      );
  }
}
