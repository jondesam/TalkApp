import { Routes, RunGuardsAndResolvers } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
// import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { ListsResolver } from './_resolvers/lists.resolver';
import { RatesResolver } from './_resolvers/rates.resolver';
import { TutorEditMenuComponent } from './tutor/_tutorEditMenu/tutorEditMenu.component';
import { MessageboxComponent } from './message/messagebox/messagebox.component';
import { MessagesboxResolver } from './_resolvers/messagebox.resolver';

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
        path: 'lists',
        component: ListsComponent,
        resolve: { users: ListsResolver },
      },
      {
        path: 'tutor/edit/:id',
        component: TutorEditMenuComponent,
        resolve: { user: MemberEditResolver },
      },
      {
        path: 'messagebox/:id',
        component: MessageboxComponent,
        resolve: { messages: MessagesboxResolver },
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
