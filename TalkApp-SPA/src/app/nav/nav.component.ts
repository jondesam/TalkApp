import {
  Component,
  OnInit,
  TemplateRef,
  EventEmitter,
  Output,
} from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { User } from '../_models/user';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  model: any = {};
  mainPhotoUrl: string;
  modalRef: BsModalRef;
  user: User;
  registerForm: FormGroup;
  constructor(
    public authService: AuthService,
    private alertify: AlertifyService,
    private router: Router,
    private formBuilder: FormBuilder,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(
      (mainPhotoUrl) => (this.mainPhotoUrl = mainPhotoUrl)
    );
  }

  login() {
    console.log(this.model);
    this.authService.login(this.model).subscribe(
      (next) => {
        this.alertify.success('Logged in successfully');
      },
      (error) => {
        this.alertify.error(error);
      },
      () => {
        this.router.navigate(['/members']);
      }
    );
  }

  // Check if user is log in or not
  loggedIn() {
    this.createRegisterForm();
    return this.authService.loggedIn();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
    this.alertify.message('Logged out');
    this.router.navigate(['/home']);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  dropdown() {
    const el = document.querySelector('.dropdown');
    console.log(el);
    el.addEventListener('click', function (event) {
      event.stopPropagation();
      el.classList.toggle('is-active');
    });
  }

  loginModal() {
    const el = document.querySelector('.modal');
    console.log(el);
    el.classList.toggle('is-active');
  }

  closeModal() {
    const el = document.querySelector('.modal');
    console.log(el);
    el.classList.toggle('is-active');
  }
  createRegisterForm() {
    this.registerForm = this.formBuilder.group(
      {
        username: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(8),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value
      ? null
      : { mismatch: true };
  }

  register() {
    console.log(this.registerForm.value);
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);

      this.authService.register(this.user).subscribe(
        () => {
          this.alertify.success('Registartion successful');
        },
        (error) => {
          this.alertify.error(error);
        },
        () => {
          this.authService.login(this.user).subscribe(() => {
            this.router.navigate(['/members']);
          });
        }
      );
    }
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
