import { Routes, RunGuardsAndResolvers } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './_guards/auth.guard';

export const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: '',
    runGuardsAndResolvers: 'always' as RunGuardsAndResolvers,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'members',
        component: MemberListComponent,
      },
      {
        path: 'messages',
        component: MessagesComponent,
      },
      {
        path: 'lists',
        component: ListsComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
