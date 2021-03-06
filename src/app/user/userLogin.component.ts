import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {Router} from '@angular/router';
import * as io from 'socket.io-client';
// import { Observable } from "rxjs/Observable";

@Component({
  selector: 'login-signup',
  templateUrl: './loginSignup.component.html',
  styleUrls: ['./loginSignup.component.css']
})

export class UserLoginComponent implements OnInit, OnDestroy{
  name = ''; nickname = '';
  socket = null;
  showLogin = false;

  constructor(
    private router: Router
  ){
  }

  ngOnInit(){
    if(localStorage.getItem('nickname') != null || localStorage.getItem('nickname') != undefined){
      this.router.navigate(['home']);
    }

    this.socket = io('http://localhost:3000');

    this.socket.on('user', function(data){
      switch(data.type){
        case 'login':
          localStorage.setItem('nickname', data.user.nickname);
          localStorage.setItem('allUsers', JSON.stringify(data.all_users));
          this.router.navigate(['home']);
          break;
        case 'not_found':
          this.showLogin = true;
          break;
      }
    }.bind(this));

    this.socket.on('error', function(error){
      alert(error.message);
    }.bind(this));
  }

  ngOnDestroy(){
    this.socket.disconnect();
  }

  login(){
    if(this.nickname !== null){
      this.socket.emit('login', {nickname: this.nickname});
    }
  }

  signup(){
    if(this.name !== null && this.nickname !== null){
      this.socket.emit('signup', {nickname: this.nickname, name: this.name});
    }else{
      alert('Please enter all the details');
    }
  }
}
