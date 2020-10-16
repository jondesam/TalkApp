import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Language } from 'src/app/_models/language';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-tutorLanguageEdit',
  templateUrl: './tutorLanguageEdit.component.html',
  styleUrls: ['./tutorLanguageEdit.component.css'],
})
export class TutorLanguageEditComponent implements OnInit {
  @ViewChild('newLanguageForm', { static: true }) newLanguageForm: NgForm;
  user: User;
  languages: Language[] = [];

  newLanguage: Language = {
    langueSpeak: null,
    isNative: false,
  };
  canSave = false;
  
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private alertify: AlertifyService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.user = data['user'];
    });
    this.loadLangs();
  }

  addToArr(newLanguage: Language) {
    if (this.languages.length > 4) {
      this.alertify.error('You can regisger upto 5 languages');
    } else {
      this.languages.push(newLanguage);
    }
    this.newLanguage = {
      langueSpeak: null,
      isNative: false,
    };
  }

  saveNewLanguage(languages: Language[]) {
    if (this.languages.length > 5) {
      this.alertify.error('You can regisger upto 5 languages');
    } else {
      let langArr = languages.filter((lang) => lang.id === undefined);

      this.userService
        .saveLanguages(this.authService.decodedToken.nameid, langArr)
        .subscribe(
          (next: any) => {
            this.newLanguage = {
              langueSpeak: null,
              isNative: false,
            };

            this.languages = next.result;

            this.newLanguageForm.reset();

            this.alertify.success(`Saved`);
          },
          (error) => {
            console.log(error);

            this.alertify.error('Error');
          }
        );
    }
  }

  deleteLang(langId: number, langueSpeak: string) {
    this.alertify.confirm('Are you sure you want to delete this?', () => {
      if (this.languages.length < 2) {
        this.alertify.error('You need at least 1 language');
      } else {
        if (langId !== undefined) {
          this.userService
            .deleteLang(this.authService.decodedToken.nameid, langId)
            .subscribe((next: any) => {
              this.languages = this.languages.filter(
                (lang) => lang.id !== langId
              );
              this.alertify.error('Deleted');
            }),
            (error) => {
              this.alertify.error(error);
            };
        } else {
          this.languages = this.languages.filter(
            (lang) => lang.langueSpeak !== langueSpeak
          );
        }
      }
    });
  }

  loadLangs() {
    this.userService
      .getLanguages(this.authService.decodedToken.nameid)
      .subscribe(
        (langs: Language[]) => {
          this.languages = langs;
        },
        (error) => {
          this.alertify.error('error');
        }
      );
  }
}
