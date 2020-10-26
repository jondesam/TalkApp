import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../_models/user';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';
import { Message } from '../_models/Message';
import { Rate } from '../_models/rate';
import { Skill } from '../_models/skill';
import { Language } from '../_models/language';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.apiUrl;

  chosenUserId = new BehaviorSubject<number>(0);
  currentChosenUserId = this.chosenUserId.asObservable();

  constructor(private http: HttpClient) {}

  setChosenUserId(chosenUserId: number) {
    this.chosenUserId.next(chosenUserId);
  }

  getUsers(
    pageNumber?,
    itemsPerPage?,
    userParams?,
    likesParam?,
    includeStudents?
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
    } else {
      params = params.append('orderBy', 'score');
    }

    if (likesParam === 'Likers') {
      params = params.append('Likers', 'true');
    }

    if (likesParam === 'Likees') {
      params = params.append('Likees', 'true');
    }

    if (includeStudents !== null) {
      params = params.append('includeStudents', 'true');
    }
    console.log(params);

    // debugger;
    return this.http
      .get<User[]>(this.baseUrl + 'users/', {
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          paginatedResult.result = response.body;

          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get('Pagination')
            );
          }
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

  sendLike(userId: string, recipientId: number) {
    return this.http.post(
      this.baseUrl + 'users/' + userId + '/like/' + recipientId,
      {}
    );
  }

  getLastMessages(userId: number) {
    return this.http.get<Message[]>(
      this.baseUrl + 'users/' + userId + '/messages' + '/lastMessages'
    );
  }

  getMessageThread(
    userId: number,
    recipientId: number,
    pageNumber?,
    itemsPerPage?
  ) {
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<
      Message[]
    >();

    let params = new HttpParams();

    if (pageNumber != null && itemsPerPage != null) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', itemsPerPage);
    }

    return this.http
      .get<Message[]>(
        this.baseUrl + 'users/' + userId + '/messages/thread/' + recipientId,
        {
          observe: 'response',
          params,
        }
      )
      .pipe(
        map((response) => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') !== null) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get('Pagination')
            );
          }
          return paginatedResult;
        })
      );
  }

  sendMessage(userId: number, message: Message) {
    return this.http.post(
      this.baseUrl + 'users/' + userId + '/messages',
      message
    );
  }

  deleteMessage(messageId: number, userId: number) {
    return this.http.post(
      this.baseUrl + 'users/' + userId + '/messages/' + messageId,
      {}
    );
  }

  markAsRead(userId: number, messageId: number) {
    this.http
      .post(
        this.baseUrl + 'users/' + userId + '/messages/' + messageId + '/read',
        {}
      )
      .subscribe();
  }

  createRate(
    senderId: number,
    recipientId: number,
    comment: string,
    score: number
  ) {
    return this.http.post(this.baseUrl + 'users/' + senderId + '/rates', {
      senderId,
      recipientId,
      comment,
      score,
    });
  }

  deleteRate(userId: number, rateId: number) {
    return this.http.delete(
      this.baseUrl + 'users/' + userId + '/rates/' + rateId
    );
  }

  getRates(userId: number, pageNumber?, itemsPerPage?) {
    const paginatedResult: PaginatedResult<Rate[]> = new PaginatedResult<
      Rate[]
    >();

    let params = new HttpParams();

    if (pageNumber != null && itemsPerPage != null) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', itemsPerPage);
    }

    return this.http
      .get<Rate[]>(this.baseUrl + 'users/' + userId + '/rates', {
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') !== null) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get('Pagination')
            );
          }

          return paginatedResult;
        })
      );
  }

  saveSkill(userId: number, skill: Skill) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/skills/', skill);
  }

  updateSkill(userId: number, skill: Skill) {
    let skillId = skill.id;
    return this.http.put(
      this.baseUrl + 'users/' + userId + '/skills/' + skillId,
      skill
    );
  }

  deleteSkill(userId: number, skillId: number) {
    return this.http.delete(
      this.baseUrl + 'users/' + userId + '/skills/' + skillId
    );
  }

  saveLanguages(userId: number, languages: Language[]) {
    return this.http.post(
      this.baseUrl + 'users/' + userId + '/languages',
      languages
    );
  }

  deleteLang(userId: number, langId: number) {
    return this.http.delete(
      this.baseUrl + 'users/' + userId + '/languages/' + langId
    );
  }

  getLanguages(userId: number) {
    return this.http.get<Language[]>(
      this.baseUrl + 'users/' + userId + '/languages'
    );
  }
}
