import { Component, OnInit } from '@angular/core';
import { Room } from '../model/room';
import { RoomService } from 'app/service/rooms/room.service';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {
  rooms: Room[] = [];
  roomStatusMessage: string = 'Loading room information...';
  constructor(private _roomService: RoomService) {}

  /**
   * Loads room from API
   */
  ngOnInit(): void {
    this._roomService.getAllRooms().subscribe(
      (response: any) => {
        if (response.success) {
          // Response was successfull, but there are no rooms created yet:
          if (response.data === null) {
            this.roomStatusMessage =
              'There are no rooms created yet! Come back later when some content is added.';
          } else {
            this.rooms = response.data.content;
          }
        } else {
          this.roomStatusMessage =
            'An error occured while trying to get rooms. Please try again later';
          console.error('Error occurred while fetching rooms\n', response);
        }
      },
      error => {
        this.roomStatusMessage =
          'An error occured while trying to connect to the API to get all rooms.';
        console.error(`${this.roomStatusMessage}\n`, error);
      }
    );
    // const response = await fetch(`${env.roomsApi}/?size=50`);
    // const result = await response.json();

    // if (result.success) {
    //   this.rooms = result.data.content;
    //   console.log(result);
    // } else {
    //   this.roomStatusMessage =
    //     'An error occured while trying to get rooms. Please try again later';
    //   console.error('Error occurred while fetching rooms\n', result);
    // }
  }
}
