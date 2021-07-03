import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { _BookingEntity } from 'app/booking-entity/models';
import { BookingEntityDataService } from 'app/service/data/booking-entity-data.service';

@Component({
  selector: 'app-list-booking-entities',
  templateUrl: './list-booking-entities.component.html',
  styleUrls: ['./list-booking-entities.component.css']
})
export class ListBookingEntitiesComponent implements OnInit {

  bookingEntity: _BookingEntity;
  bookingEntityList: _BookingEntity[];

  constructor(
    private bookingEntityDataService: BookingEntityDataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    confirm("test username: linuxzen.561@gmail.com password: P6ssw0rd")
    console.log("In booking entity list init" );
    this.bookingEntityDataService.retrieveAllBookingEntities().subscribe(
      response => {
        console.log(response);
        this.bookingEntityList = response;
        console.log(this.bookingEntityList);
      }
    )
  }

  book(gid): void {
    console.log(gid);
    this.router.navigate(['select', gid]);
  }


  

}
