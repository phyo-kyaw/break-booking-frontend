import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-delete-room',
  templateUrl: './delete-room.component.html',
  styleUrls: ['./delete-room.component.css']
})
export class DeleteRoomComponent implements OnInit {
  @Output() deleteRoomSuccess = new EventEmitter();
  @Input() roomId: number | null = null;
  @Input() roomName: string = '';

  constructor(private modalService: NgbModal) {}

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
   *
   * @param id - room ID
   */
  async deleteRoom(id: number): Promise<void> {
    const response = await fetch(`${environment.roomsApi}/delete/${id}`, {
      method: 'DELETE'
    });

    const result = await response.json();

    if (result.success) {
      this.deleteRoomSuccess.emit();

      this.modalService.dismissAll();
    } else {
      console.log('Could not delete the room');
    }
  }
}
