import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Skill } from 'src/app/_models/skill';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-tutorSkillEdit',
  templateUrl: './tutorSkillEdit.component.html',
  styleUrls: ['./tutorSkillEdit.component.css'],
})
export class TutorSkillEditComponent implements OnInit {
  @ViewChild('editSkillForm', { static: true }) editSkillForm: FormGroup;

  controlArray: any = [];
  user: User;
  newSkill: any = {
    id: 0,
    skillName: null,
    description: null,
    url1: null,
    url2: null,
    yearsOfExp: null,
    fee: null,
  };

  skills: any[] = [];
  btnName: string;
  activeTab: string;

  constructor(
    private route: ActivatedRoute,
    private alertify: AlertifyService,
    private userService: UserService,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.user = data['user'];
      this.skills = data['user'].skills;
    });

    this.editSkillForm = new FormGroup({
      skillArray: this.formBuilder.array([]),
    });

    this.controlArray = this.editSkillForm.get('skillArray') as FormArray;
    this.buildForm();
  }

  changeTab($event) {
    this.activeTab = $event.heading;
  }

  buildForm() {
    Object.keys(this.user.skills).forEach((i) => {
      this.controlArray.push(
        this.formBuilder.group({
          skillName: new FormControl({
            value: this.user.skills[i].skillName,
          }),
          description: new FormControl({
            value: this.user.skills[i].description,
          }),
          url1: new FormControl({
            value: this.user.skills[i].url1,
          }),
          url2: new FormControl({
            value: this.user.skills[i].url2,
          }),
          fee: new FormControl({
            value: this.user.skills[i].fee,
          }),
          yearsOfExp: new FormControl({
            value: this.user.skills[i].yearsOfExp,
          }),
        })
      );
    });
  }

  deleteSkill(skillId: number) {
    this.alertify.confirm(
      'Are you sure you want to delete this message?',
      () => {
        this.userService
          .deleteSkill(this.authService.decodedToken.nameid, skillId)
          .subscribe(
            (next) => {
              document.location.reload(true);
              this.alertify.success('the skill has been removed');
            },
            (err) => {
              this.alertify.error('Error');
            }
          );
      }
    );
  }

  addNewTab(): void {
    this.controlArray.push(
      this.formBuilder.group({
        id: 0,
        skillName: null,
        description: null,
        url1: null,
        url2: null,
        fee: 0,
        yearsOfExp: 0,
      })
    );
    this.skills.push({});
  }

  saveSkill(newSkill: Skill) {
    let id = this.authService.decodedToken.nameid;
    if (newSkill.id === undefined) {
      this.userService.saveSkill(id, newSkill).subscribe(
        (next) => {
          this.alertify.success('New subject added');
        },
        (err) => {
          this.alertify.error('Error');
        }
      );
    } else {
      this.userService.updateSkill(id, newSkill).subscribe(
        (next) => {
          this.alertify.success('Subject updated');
        },
        (err) => {
          this.alertify.error('Error');
        }
      );
    }
  }
}
