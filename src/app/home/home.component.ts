import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import * as io from 'socket.io-client';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent  implements OnInit{
  availableUsers = null; sender = null; socket = null;

  constructor(
    private router: Router
  ){}

  ngOnInit(){
    if(localStorage.getItem('nickname') != null){
      this.sender = localStorage.getItem('nickname');
    }else{
      this.router.navigate(['login']);
    }

    if(localStorage.getItem('allUsers') != null){
      this.availableUsers = JSON.parse(localStorage.getItem('allUsers'));
    }else{
      this.router.navigate(['login']);
    }

    this.socket = io('http://localhost:3000');

    this.socket.on('room_created', function(roomData){
      if(roomData.sender != this.sender && roomData.room == (roomData.sender+'_'+this.sender)){
        localStorage.setItem('roomData', JSON.stringify(roomData));
        // this.router.navigate(['chat']);
        window.open('chat');
      }else{
        console.log(roomData.sender, this.sender, roomData.sender != this.sender);
      }
    }.bind(this));

    this.socket.on('error', function(error){
      alert(error.message);
    }.bind(this));
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['login']);
  }

  startChat(user){
    localStorage.setItem('chatUser', JSON.stringify({user: user, initiator: this.sender}));

    window.open('chat');
  }
}
