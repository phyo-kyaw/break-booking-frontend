import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  ngOnInit(): void { }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'delete-room-modal' });
  }

  deleteRoom(id: number): void {
    this.deleteRoomSuccess.emit();

    this.modalService.dismissAll();
  }
}
