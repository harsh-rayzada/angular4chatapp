import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { UserLoginComponent } from './user/userLogin.component';
import { HomeComponent } from './home/home.component';
import { ChatComponent } from './chat/chat.component';

const appRoutes: Routes = [
    {
      path: '',
      redirectTo: '/login',
      pathMatch: 'full'
    },
    {
      path: 'login',
      component: UserLoginComponent
    },
    {
      path: 'home',
      component: HomeComponent
    },
    {
      path: 'chat',
      component: ChatComponent
    },
    {
      path: '**',
      redirectTo: '/login',
      pathMatch: 'full'
      // component: UserLoginComponent
    }
];

@NgModule({
  declarations: [
    AppComponent,
    UserLoginComponent,
    HomeComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
