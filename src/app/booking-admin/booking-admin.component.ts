
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { _BookingEntity } from 'app/booking-entity/models';
import { BookingEntityDataService } from 'app/service/data/booking-entity-data.service';

@Component({
  selector: 'app-booking-admin',
  templateUrl: './booking-admin.component.html',
  styleUrls: ['./booking-admin.component.css']
})
export class BookingAdminComponent implements OnInit {

  bookingEntity: _BookingEntity;
  bookingEntityList: _BookingEntity[];

  constructor(
    private bookingEntityDataService: BookingEntityDataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    confirm("admin username: break.booking.561 password: P6ssw0rd")
    console.log("In booking entity list init" );
    this.bookingEntityDataService.retrieveAllBookingEntities().subscribe(
      response => {
        console.log(response);
        this.bookingEntityList = response;
        console.log(this.bookingEntityList);
      }
    )
  }


  addBookingEntity(): void {
    this.router.navigate(['entity']);
  }
  
  update(gid): void {
    console.log(gid);
    this.router.navigate(['entity', gid]);
  }

  delete(gid): void {
    if (confirm("Confirm delete?")) {
      this.bookingEntityDataService.deleteBookingEntity(gid).subscribe(
        response => {
          console.log('Entity deleted. ' + gid);
        }
      )
      this.router.navigate(['list']);
    }
  }

}

