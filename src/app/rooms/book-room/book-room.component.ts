import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RoomService } from 'app/service/rooms/room.service';
import { Room } from '../model/room';
@Component({
  selector: 'app-book-room',
  templateUrl: './book-room.component.html',
  styleUrls: ['./book-room.component.css']
})
export class BookRoomComponent implements OnInit {
  room: Room;

  constructor(
    private route: ActivatedRoute,
    private _roomService: RoomService
  ) {}
  /**
   * Retrieves the ID from the route
   */
  ngOnInit() {
    this.route.params.subscribe(params => {
      this._roomService.getRoomWithBookedTime(params.id).subscribe(
        (response: any) => {
          if (response.success) {
            // Room fetching was good, bind it to component
            this.room = response.data;
          } else {
            // Something went wrong with getting the room
            // this.gettingRoomInfo = 'Sorry, the selected room was not found.';
            console.error(
              'An error occurred while trying to fetch the room:\n',
              response
            );
          }
        },
        error => {
          // Something went wrong when connecting to the API
          // this.gettingRoomInfo =
          //   'An error occurred while trying to connecet to the API to get the room';
          console.error(
            'An error occurred while trying to connecet to the API to get the room',
            error
          );
        }
      );
    });
    // })
    // this.roomId = params.id;
    // });
  }
}
