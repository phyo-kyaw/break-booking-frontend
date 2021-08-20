import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoomService } from 'app/service/rooms/room.service';

@Component({
  selector: 'app-delete-room',
  templateUrl: './delete-room.component.html',
  styleUrls: ['./delete-room.component.css']
})
export class DeleteRoomComponent implements OnInit {
  @Output() deleteRoomSuccess = new EventEmitter();
  @Input() roomId: number | null = null;
  @Input() roomName: string = '';

  constructor(
    private modalService: NgbModal,
    private _roomService: RoomService
  ) {}

  ngOnInit(): void {}

  /**
   * Opens a modal
   */
  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'delete-room-modal' });
  }

  /**
   * Submits a DELETE request to destory the room with the given ID.
   * When deleted, it emits an event to parent component to hide the room row
   *
   * @param {string} id - room ID
   */
  deleteRoom(id: string): void {
    this._roomService.deleteRoom(id).subscribe(
      (response: any) => {
        if (response.success) {
          this.deleteRoomSuccess.emit();

          this.modalService.dismissAll();
        } else {
          console.log('Could not delete the room');
        }
      },
      error =>
        console.error(
          'Error occurred while trying to connect to API to delete a room',
          error
        )
    );
  }
}
