import { Component, OnInit } from '@angular/core';
import { fakeData } from '../fake-data';
import { Room } from '../model/room';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-room',
  templateUrl: './edit-room.component.html',
  styleUrls: ['./edit-room.component.css']
})
export class EditRoomComponent implements OnInit {
  roomId: number | null = null;

  constructor(private route: ActivatedRoute) {}

  /**
   * Retrieves the ID from the route
   */
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.roomId = params.id;
    });
  }
}
