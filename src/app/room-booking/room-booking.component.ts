import { Component, OnInit, ViewChildren } from '@angular/core';
import { Room } from './model/room';
import { environment as env } from '../../environments/environment';

@Component({
  selector: 'app-room-booking',
  templateUrl: './room-booking.component.html',
  styleUrls: ['./room-booking.component.css']
})
export class RoomBookingComponent implements OnInit {
  @ViewChildren('roomRow') roomRows;
  rooms: any = [];
  roomStatusMessage: string = 'Loading room information...';
  constructor() {}

  /**
   * Loads dummy data after 250ms to simulate fetching from API
   */
  async ngOnInit(): Promise<void> {
    const response = await fetch(env.roomsApi);
    const result = await response.json();

    if (result.success) {
      this.rooms = result.data.content;
      console.log(result.data.content);
    } else {
      this.roomStatusMessage =
        'An error occured while trying to get room information.';
      console.log(result);
    }
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
