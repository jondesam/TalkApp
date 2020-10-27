import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-tutorEditMenu',
  templateUrl: './tutorEditMenu.component.html',
  styleUrls: ['./tutorEditMenu.component.css'],
})
export class TutorEditMenuComponent implements OnInit {
  user: User;
  isBioColllapsed: boolean = false;
  isLangColllapsed: boolean = true;
  isSkillColllapsed: boolean = true;

  btnName: string = 'Bio';
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.user = data['user'];
    });
  }

  collapse(tabName: string) {
    this.btnName = tabName;

    this.isBioColllapsed = !this.isBioColllapsed;

    let btnContainer = document.getElementById('smScreen');
    let btns = btnContainer.getElementsByClassName('navmenu');

    for (let i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        let current = document.getElementsByClassName('active');
        current[0].className = current[0].className.replace(' active', '');
        this.className += ' active';
      });
    }
    switch (tabName) {
      case 'Bio':
        this.isBioColllapsed = false;
        this.isLangColllapsed = true;
        this.isSkillColllapsed = true;
        break;

      case 'Languages':
        this.isBioColllapsed = true;
        this.isLangColllapsed = false;
        this.isSkillColllapsed = true;
        break;

      case 'Subjects':
        this.isBioColllapsed = true;
        this.isLangColllapsed = true;
        this.isSkillColllapsed = false;
        break;

      default:
        break;
    }
  }
}
