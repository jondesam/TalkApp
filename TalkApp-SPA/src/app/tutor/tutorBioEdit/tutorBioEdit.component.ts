import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Language } from 'src/app/_models/language';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-tutorBioEdit',
  templateUrl: './tutorBioEdit.component.html',
  styleUrls: ['./tutorBioEdit.component.css'],
})
export class TutorBioEditComponent implements OnInit {
  @ViewChild('BioForm', { static: true }) editForm: NgForm;
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  user: User;
  mainPhotoUrl: string;
  newLanguage: Language = {
    langueSpeak: null,
    isNative: false,
  };
  bioForm: FormGroup;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private alertify: AlertifyService,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.user = data['user'];
    });
    this.authService.currentPhotoUrl.subscribe((mainPhotoUrl) => {
      this.mainPhotoUrl = mainPhotoUrl;
    });
    this.createForm();
  }

  updateMainPhoto(photoUrl) {
    this.user.photoUrl = photoUrl;
  }

  updateBio() {
    this.userService
      .updateUser(this.authService.decodedToken.nameid, this.user)
      .subscribe(
        (next: User) => {
          this.alertify.success('Profile updated');
        },
        (error) => {
          this.alertify.error('Error');
        }
      );
  }

  createForm() {
    this.bioForm = this.formBuilder.group({
      bio: ['', [Validators.required, Validators.minLength(200)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      country: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.minLength(2)]],
    });
  }
}
