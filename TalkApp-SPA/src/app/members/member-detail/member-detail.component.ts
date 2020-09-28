import { Component, OnInit, TemplateRef } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/_services/user.service';
import {
  NgxGalleryOptions,
  NgxGalleryImage,
  NgxGalleryAnimation,
} from '@kolkov/ngx-gallery';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/_services/auth.service';
import { StarRatingComponent } from 'ng-starrating';
// import {RatingModule} from 'ngx'
@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit {
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  modalRef: BsModalRef;
  newRate: any = {};
  rating: number = 0;
  options: number[];
  selectedOption: number;

  constructor(
    private userService: UserService,
    private alerify: AlertifyService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.options = [1, 2, 3, 4, 5];

    this.selectedOption = this.options[0];

    this.route.data.subscribe((data) => {
      console.log('df', data);

      this.user = data['user'];
    });
    console.log(this.user.raters);

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        thumbnailsColumns: 4,
        imagePercent: 100,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false,
      },
    ];
    this.galleryImages = this.getImages();

    // Without Resolver
    // this.loadUser();
  }
  getImages() {
    const imageUrls = [];
    for (const photo of this.user.photos) {
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
        description: photo.description,
      });
    }
    return imageUrls;
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  createRate() {
    console.log(this.newRate);

    // this.userService.createRate(
    //   this.authService.decodedToken.nameid,
    //   this.user.id
    // );
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  // onRate($event: {
  //   oldValue: number;
  //   newValue: number;
  //   starRating: StarRatingComponent;
  // }) {
  //   console.log('ADFAFD');

  //   alert(`Old Value:${$event.oldValue},
  //     New Value: ${$event.newValue},
  //     Checked Color: ${$event.starRating.checkedcolor},
  //     Unchecked Color: ${$event.starRating.uncheckedcolor}`);
  // }

  onRate($event: {
    oldValue: number;
    newValue: number;
    starRating: StarRatingComponent;
  }) {
    console.log($event);
    this.rating = $event.newValue;
    $event.starRating.value = 0;
    this.rating = 0;
    console.log(this.rating);
  }
  // loadUser() {
  //   this.userService.getUser(this.route.snapshot.params.id).subscribe(
  //     (user: User) => {
  //       this.user = user;
  //     },
  //     (error) => {
  //       this.alerify.error(error);
  //     }
  //   );
  // }
}
