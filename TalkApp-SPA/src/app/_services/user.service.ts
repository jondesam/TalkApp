import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';
import { Message } from '../_models/Message';

// const httpOptions = {
//   headers: new HttpHeaders({
//     Authorization: 'Bearer ' + localStorage.getItem('token'),
//   }),
// };

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getUsers(
    pageNumber?,
    itemsPerPage?,
    userParams?,
    likesParam?
  ): Observable<PaginatedResult<User[]>> {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<
      User[]
    >();

    let params = new HttpParams();

    if (pageNumber != null && itemsPerPage !== null) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', itemsPerPage);
    }

    if (userParams != null) {
      params = params.append('orderBy', userParams.orderBy);
      params = params.append('search', userParams.search);
    }

    if (likesParam === 'Likers') {
      params = params.append('Likers', 'true');
    }

    if (likesParam === 'Likees') {
      params = params.append('Likees', 'true');
    }

    return this.http
      .get<User[]>(this.baseUrl + 'users/', {
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          console.log('response', response);
          paginatedResult.result = response.body;

          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get('Pagination')
            );
          }
          console.log('paginatedResult', paginatedResult);
          return paginatedResult;
        })
      );
  }

  getUser(id): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'users/' + id);
  }

  updateUser(id: number, user: User) {
    console.log('user update', user);

    return this.http.put(this.baseUrl + 'users/' + id, user);
  }

  setMainPhoto(userId: number, photoId: number) {
    return this.http.post(
      this.baseUrl + 'users/' + userId + '/photos/' + photoId + '/setMain',
      {}
    );
  }

  deletePhoto(userId: number, id: number) {
    return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id);
  }

  sendLike(userId: number, recipientId: number) {
    return this.http.post(
      this.baseUrl + 'users/' + userId + '/like/' + recipientId,
      {}
    );
  }

  getMessages(userId: number, pageNumber?, itemsPerPage?, messageContainer?) {
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<
      Message[]
    >();

    let params = new HttpParams();

    params = params.append('MessageContainer', messageContainer);

    if (pageNumber != null && itemsPerPage != null) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', itemsPerPage);
    }

    return this.http
      .get<Message[]>(this.baseUrl + 'users/' + userId + '/messages', {
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          console.log(response);

          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') !== null) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get('Pagination')
            );
          }
          console.log('paginatedResult', paginatedResult);

          return paginatedResult;
        })
      );
  }

  getMessageThread(userId: number, recipientId: number) {
    return this.http.get<Message[]>(
      this.baseUrl + 'users/' + userId + '/messages/thread/' + recipientId
    );
  }

  sendMessage(userId: number, message: Message) {
    return this.http.post(
      this.baseUrl + 'users/' + userId + '/messages',
      message
    );
  }
}
