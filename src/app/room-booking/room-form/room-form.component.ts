import { Component, Input, OnInit } from '@angular/core';
import { Room } from '../model/room';

const fakeData: Room[] = [
  {
    id: 0,
    name: 'First room',
    city: 'Sydney',
    address: '12 Paramatta Street',
    roomNumber: 1,
    images: ['img1', 'img2'],
    description: 'Spacious room perfect for multimedia presentations.',
    type: 'Meeting room',
    floor: 1,
    size: 50,
    maxPeople: 40,
    price: 40,
    discount: 0,
    commentCount: 0,
    bookedTime: [],
    facilities: 'AC. table, chairs, whiteboards, TV',
    popularity: 10
  },
  {
    id: 1,
    name: 'Second room',
    city: 'Sydney',
    address: '12 Paramatta Street',
    roomNumber: 2,
    images: ['img4', 'img5'],
    description: 'Small room perfect for quick meetings.',
    type: 'Meeting room',
    floor: 1,
    size: 10,
    maxPeople: 5,
    price: 20,
    discount: 0,
    commentCount: 0,
    bookedTime: [],
    facilities: 'AC. table, chairs',
    popularity: 5
  }
];

@Component({
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.css']
})
export class RoomFormComponent implements OnInit {
  @Input() roomId: number | null = null;

  room: Room | null = null;
  constructor() {}

  ngOnInit(): void {
    console.log(this.roomId);
    if (this.roomId !== null) {
      const roomData = fakeData.filter(room => this.roomId == room.id)[0];

      console.log(roomData);
      this.room = new Room(roomData);
      setTimeout(() => {
        console.log(this.room);
      }, 100);
    } else {
      this.room = new Room();
    }
  }
}
