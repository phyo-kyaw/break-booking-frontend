import { Component, OnInit } from '@angular/core';
import { Room } from '../model/room';
import { environment as env } from '../../../environments/environment';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {
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
        'An error occured while trying to get rooms. Please try again later';
      console.error('Error occurred while fetching rooms\n', result);
    }
  }
}
