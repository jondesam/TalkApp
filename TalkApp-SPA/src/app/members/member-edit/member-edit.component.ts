import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForOf } from '@angular/common';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
// import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css'],
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm', { static: true }) editForm: NgForm;
  @ViewChild('editSkillForme', { static: true }) editSkillForm: NgForm;
  user: User;

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(
    private route: ActivatedRoute,
    private alertify: AlertifyService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      console.log(data);
      this.user = data['user'];
    });
  }

  updateUser() {
    console.log(this.user);
    console.log(this.editForm);

    this.userService
      .updateUser(this.authService.decodedToken.nameid, this.user)
      .subscribe(
        (next) => {
          this.alertify.success('Profile updated');
          if (this.editForm.reset !== undefined) {
            this.editForm.reset(this.user);
          } else {
            this.editSkillForm.reset(this.user);
          }
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }
  updateSkill() {
    console.log(this.user, this.editForm);
    this.alertify.success('Profile updated!');
    this.editForm.reset(this.user);
  }

  updateMainPhoto(photoUrl) {
    this.user.photoUrl = photoUrl;
  }
}
