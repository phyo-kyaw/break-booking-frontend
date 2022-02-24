import { Component, OnInit } from '@angular/core';
import { Room } from '../../model/room';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css']
})
export class AddRoomComponent implements OnInit {
  roomName: string = '';

  room: Room | {} = {};

  constructor() {}

  ngOnInit(): void {}
}
