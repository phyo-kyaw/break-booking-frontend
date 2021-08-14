import { Component, OnInit } from '@angular/core';
import { environment as env } from 'environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Room } from '../model/room';

@Component({
  selector: 'app-view-room',
  templateUrl: './view-room.component.html',
  styleUrls: ['./view-room.component.css']
})
export class ViewRoomComponent implements OnInit {
  room: Room | null = null;

  constructor(private route: ActivatedRoute) {}

  /**
   * Retrieve the ID from the route and get the room from API
   */
  ngOnInit() {
    // Get room ID
    this.route.params.subscribe(params => {
      this.fetchRoom(params.id);
    });
  }

  /**
   * Get room from API
   *
   * @param {string} id - room id
   */
  async fetchRoom(id: string): Promise<void> {
    const response = await fetch(`${env.roomsApi}/byId/${id}`);
    const result = await response.json();

    if (result.success) {
      console.log(result);
      this.room = result.data;
    } else {
      console.error('Error occurred while retrieving room:\n', result);
    }
  }

  /**
   * Checks if the passed variable is a number
   *
   * @param {any} num - variable to check if its a number
   *
   * @returns boolean
   */
  isNumber(num: any): boolean {
    return !Number.isNaN(num);
  }
}
