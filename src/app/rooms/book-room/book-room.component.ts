import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from 'app/service/rooms/room.service';
import { environment as env } from 'environments/environment';
import { Room } from '../model/room';
import * as dayjs from 'dayjs';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-book-room',
  templateUrl: './book-room.component.html',
  styleUrls: ['./book-room.component.css']
})
export class BookRoomComponent implements OnInit {
  room: Room;
  selectedTimes: BookedTime[] = [];
  spinnerScreenText = 'Loading...';
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private _roomService: RoomService,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {
    this.viewportScroller.setOffset([0, 70]);
  }

  onMouseReleased(eventData: BookedTime[]) {
    this.selectedTimes = eventData;
  }

  prettyDate(times: BookedTime): string {
    // console.log(dayjs(times));
    return (
      dayjs(times.start).format('D MMMM (dddd) [from] ha [- ]') +
      dayjs(times.end).format('ha')
    );
    // return dayjs(isoDate, 'd MMMM y', 'en-AU');
  }

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
        },
        () => {
          this.isLoading = false;
        }
      );
    });
  }

  onSubmit(f: NgForm) {
    console.log(f.form.value);
    if (f.valid) {
      this.isLoading = true;
      this.spinnerScreenText = 'Saving room...';

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
          if (result.success) {
            this.spinnerScreenText = 'Booking successful. Redirecting...';

            setTimeout(() => {
              this.router.navigateByUrl('/rooms');
            }, 1500);
          }
          console.log('reuslt:', result);
        })
        .catch(error =>
          console.error(
            'An error occurred while trying to connecet to the API to book the room',
            error
          )
        );
    } else {
      // Not all fields are valid, tell user to fix the inputs
      setTimeout(() => {
        this.viewportScroller.scrollToAnchor('alert');
      }, 0);
      // console.error('Room booking form is invalid', f);
    }
  }
}

type BookedTime = {
  start: string;
  end: string;
};
