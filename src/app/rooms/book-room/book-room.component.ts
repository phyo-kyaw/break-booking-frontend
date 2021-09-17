import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoomService } from 'app/service/rooms/room.service';
import { Room } from '../model/room';
import { environment as env } from 'environments/environment';
// import { formatDate } from '@angular/common';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-book-room',
  templateUrl: './book-room.component.html',
  styleUrls: ['./book-room.component.css']
})
export class BookRoomComponent implements OnInit {
  room: Room;
  selectedTimes: BookedTime[] = [];
  bookingStatus = '';

  constructor(
    private route: ActivatedRoute,
    private _roomService: RoomService
  ) {}

  onMouseReleased(eventData: BookedTime[]) {
    this.selectedTimes = eventData;
  }

  // prettyDate(isoDate: string): string {
  //   return formatDate(isoDate, 'd MMMM y', 'en-AU');
  // }

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
            console.log('ROOM', response.data);
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
  }

  onSubmit(f: NgForm) {
    console.log(f.form.value);

    fetch(`${env.roomBooking}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: '*/*'
      },
      body: JSON.stringify(f.form.value)
    })
      .then(response => response.json())
      .then(result => {
        console.log('reuslt:', result);
      })
      .catch(error =>
        console.error(
          'An error occurred while trying to connecet to the API to book the room',
          error
        )
      );
  }
}

type BookedTime = {
  start: string;
  end: string;
};
