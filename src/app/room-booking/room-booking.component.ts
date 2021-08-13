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
  rooms: Room[] = [];
  roomStatusMessage: string = 'Loading room information...';
  constructor() {}

  /**
   * Loads room from API
   */
  async ngOnInit(): Promise<void> {
    const response = await fetch(`${env.roomsApi}/?size=50`);
    const result = await response.json();

    if (result.success) {
      this.rooms = result.data.content;
      console.log(result);
    } else {
      this.roomStatusMessage =
        'An error occured while trying to get room information.';
      console.error('Error occurred while fetching rooms\n', result);
    }
  }

  /**
   * Hides the table row after a successfull delete
   */
  roomDeleted(id: string): void {
    const row = this.roomRows._results.find(room => {
      return room.nativeElement.dataset.id === id;
    }).nativeElement;

    row.classList.add('room-row--deleted');
  }
}
