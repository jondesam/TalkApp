import { Routes, RunGuardsAndResolvers } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { ListsResolver } from './_resolvers/lists.resolver';
import { MessagesResolver } from './_resolvers/messages.resolver';
import { RatesResolver } from './_resolvers/rates.resolver';
import { TutorBioEditComponent } from './tutor/tutorBioEdit/tutorBioEdit.component';
import { TutorSkillEditComponent } from './tutor/tutorSkillEdit/tutorSkillEdit.component';
import { TutorLanguageEditComponent } from './tutor/tutorLanguageEdit/tutorLanguageEdit.component';
import { TutorEditMenuComponent } from './tutor/_tutorEditMenu/tutorEditMenu.component';

export const appRoutes: Routes = [
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: '',
    component: MemberListComponent,
    resolve: { users: MemberListResolver },
  },
  {
    path: 'members/:id',
    component: MemberDetailComponent,
    resolve: { user: MemberDetailResolver, rates: RatesResolver },
  },
  {
    path: '',
    runGuardsAndResolvers: 'always' as RunGuardsAndResolvers,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'member/edit',
        component: MemberEditComponent,
        resolve: { user: MemberEditResolver, rates: RatesResolver },
        // canDeactivate: [PreventUnsavedChanges],
      },
      {
        path: 'messages',
        component: MessagesComponent,
        resolve: { messages: MessagesResolver },
      },
      {
        path: 'lists',
        component: ListsComponent,
        resolve: { users: ListsResolver },
      },
      {
        path: 'tutor/bio/:id',
        component: TutorBioEditComponent,
        resolve: { user: MemberEditResolver },
      },
      {
        path: 'tutor/skill/:id',
        component: TutorSkillEditComponent,
        resolve: { user: MemberEditResolver },
      },
      {
        path: 'tutor/language/:id',
        component: TutorLanguageEditComponent,
      },
      {
        path: 'tutor/edit/:id',
        component: TutorEditMenuComponent,
        resolve: { user: MemberEditResolver },
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
