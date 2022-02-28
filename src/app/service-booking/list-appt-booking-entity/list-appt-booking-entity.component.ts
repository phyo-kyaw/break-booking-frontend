import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApptBookingEntity } from 'app/service-booking/appt-booking-entity/models';
import { ApptBookingEntityDataService } from 'app/service/appt-booking-entity/appt-booking-entity-data.service';

@Component({
  selector: 'app-list-appt-booking-entity',
  templateUrl: './list-appt-booking-entity.component.html',
  styleUrls: ['./list-appt-booking-entity.component.css']
})
export class ListApptBookingEntityComponent implements OnInit {

  bookingEntity: ApptBookingEntity;
  bookingEntityList: ApptBookingEntity[];

  constructor(
    private bookingEntityDataService: ApptBookingEntityDataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    //confirm("test username: linuxzen.561@gmail.com password: P6ssw0rd")
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
