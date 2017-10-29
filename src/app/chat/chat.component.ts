import { Component, OnInit  } from '@angular/core';
import {Router} from '@angular/router';
import * as io from 'socket.io-client';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit{
  message = null; conversation = []; receiver = null; sender = null; socket = null; room = null;

  constructor(
    private router: Router
  ){}

  ngOnInit(){
      if(localStorage.getItem('nickname') == null){
        this.router.navigate(['login']);
      }else{
        this.sender = localStorage.getItem('nickname');
      }

      this.socket = io('http://localhost:3000');
      let chatuser = JSON.parse(localStorage.getItem('chatUser'));
      if(chatuser != null){
        localStorage.setItem('chatUser', null);
        this.receiver = chatuser.user;
        this.room = this.sender+'_'+this.receiver;
        this.socket.emit('create_room',{
          room: this.sender+'_'+this.receiver,
          receiver: this.receiver,
          sender: this.sender
        });
      }else if(localStorage.getItem('roomData') != null){
        let roomData = JSON.parse(localStorage.getItem('roomData'));
        this.room = roomData.room;
        this.receiver = roomData.receiver;
        let sender = this.sender, receiver = roomData.sender, room = this.room;
        if(sender != null && receiver != null && sender == roomData.receiver && room == (receiver+'_'+sender)){
          this.socket.emit('join', this.room);
        }
      }else{
        window.close();
      }

      this.socket.on('error', function(error){
        alert(error.message);
      }.bind(this));

      //emit join room event which should have receiver's nickname

      this.socket.on('message', function(msgData){
        console.log('msgData',msgData);
        this.conversation.push({sender: msgData.sender, text: msgData.text});
      }.bind(this));
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['login']);
  }

  keypressHandler(e){
    if(e.keyCode == 13){
      this.sendMessage();
    }
  }

  sendMessage(){
      if(this.message !== null && this.message != ' '){
        this.socket.emit('message', {
          sender: this.sender,
          receiver: this.receiver,
          text: this.message,
          room: this.room
        });

        this.conversation.push({sender: this.sender, text: this.message});
        this.message = '';
      }
  }
}
