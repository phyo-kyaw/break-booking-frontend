import { Component, OnInit, ViewChildren } from '@angular/core';
import { Room } from './model/room';
import { RoomService } from 'app/service/rooms/room.service';

@Component({
  selector: 'app-room-booking',
  templateUrl: './room-booking.component.html',
  styleUrls: ['./room-booking.component.css']
})
export class RoomBookingComponent implements OnInit {
  @ViewChildren('roomRow') roomRows;
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
          this.rooms = response.data.content;
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
