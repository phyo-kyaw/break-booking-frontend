import { Component, OnInit, ViewChildren } from '@angular/core';
import { Room } from '../../model/room';
import { RoomService } from 'app/service/rooms/room.service';
import { Store } from '@ngrx/store';
import { Status } from 'app/store/reducer';
@Component({
  selector: 'app-admin-room-list',
  templateUrl: './admin-room-list.component.html',
  styleUrls: ['./admin-room-list.component.css']
})
export class AdminRoomListComponent implements OnInit {
  @ViewChildren('roomRow') roomRows;
  reducer$: Status;
  rooms: Room[] = [];
  roomStatusMessage: string = 'Loading room information...';
  constructor(
    private _roomService: RoomService,
    private store: Store<{ reducer: Status }>
  ) {
    this.store.select('reducer').subscribe(res => (this.reducer$ = res));
  }

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
              "There are no rooms yet. Click the blue 'Add room' button at the top right corner to get started.";
          } else {
            // Bind the rooms to the component
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
