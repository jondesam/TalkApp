import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { TimeagoModule, TimeagoPipe } from 'ngx-timeago';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RatingModule } from 'ngx-bootstrap/rating';
import { SidebarModule } from 'ng-sidebar';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { AuthService } from './_services/auth.service';
import { RegisterComponent } from './register/register.component';
import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { appRoutes } from './routes';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';
import { FileUploadModule } from 'ng2-file-upload';
import { ListsResolver } from './_resolvers/lists.resolver';
import { RatesResolver } from './_resolvers/rates.resolver';
import { TutorBioEditComponent } from './tutor/tutorBioEdit/tutorBioEdit.component';
import { TutorLanguageEditComponent } from './tutor/tutorLanguageEdit/tutorLanguageEdit.component';
import { TutorSkillEditComponent } from './tutor/tutorSkillEdit/tutorSkillEdit.component';
import { TutorEditMenuComponent } from './tutor/_tutorEditMenu/tutorEditMenu.component';
import { TimeAgoSecondePipe } from './_pipe/timeAgoSeconde.pipe';
import { MessageboxComponent } from './message/messagebox/messagebox.component';
import { MessagesboxResolver } from './_resolvers/messagebox.resolver';
import { TitleCasePipe } from '@angular/common';

export const tokenGetter = () => localStorage.getItem('token');

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    RegisterComponent,
    MemberListComponent,
    ListsComponent,
    MemberCardComponent,
    MemberDetailComponent,
    PhotoEditorComponent,
    TutorBioEditComponent,
    TutorLanguageEditComponent,
    TutorSkillEditComponent,
    TutorEditMenuComponent,
    TimeAgoSecondePipe,
    MessageboxComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ButtonsModule.forRoot(),
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    TabsModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    NgxGalleryModule,
    FileUploadModule,
    TimeagoModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['localhost:5000'],
        disallowedRoutes: ['localhost:5000/api/auth'],
      },
    }),
    ModalModule.forRoot(),
    RatingModule.forRoot(),
    SidebarModule.forRoot(),
  ],
  providers: [
    AuthService,
    ErrorInterceptorProvider,
    MemberDetailResolver,
    MemberListResolver,
    MemberEditResolver,
    ListsResolver,
    RatesResolver,
    MessagesboxResolver,
    TitleCasePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
