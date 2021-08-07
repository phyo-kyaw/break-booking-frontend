import { Component, OnInit, ViewChildren } from '@angular/core';
import { Room } from './model/room';

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
    size: '50m2',
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
    size: '10m2',
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
  selector: 'app-room-booking',
  templateUrl: './room-booking.component.html',
  styleUrls: ['./room-booking.component.css']
})
export class RoomBookingComponent implements OnInit {
  @ViewChildren('roomRow') roomRows;
  rooms: Room[] | [] = [];

  constructor() {}

  /**
   * Loads dummy data after 250ms to simulate fetching from API
   */
  ngOnInit(): void {
    setTimeout(() => {
      this.rooms = fakeData;
    }, 250);
  }

  /**
   * Deletes the room and hides the table row
   */
  roomDeleted(id: number): void {
    const row = this.roomRows._results.find(
      room => room.nativeElement.dataset.index == id
    ).nativeElement;

    row.classList.add('room-row--deleted');
  }
}
