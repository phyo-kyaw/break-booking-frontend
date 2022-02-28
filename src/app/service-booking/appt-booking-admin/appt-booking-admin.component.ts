
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApptBookingEntity } from 'app/service-booking/appt-booking-entity/models';
import { ApptBookingEntityDataService } from 'app/service/appt-booking-entity/appt-booking-entity-data.service';

@Component({
  selector: 'app-appt-booking-admin',
  templateUrl: './appt-booking-admin.component.html',
  styleUrls: ['./appt-booking-admin.component.css']
})
export class ApptBookingAdminComponent implements OnInit {

  apptBookingEntity: ApptBookingEntity;
  apptBookingEntityList: ApptBookingEntity[];

  constructor(
    private apptBookingEntityDataService: ApptBookingEntityDataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    //confirm("admin username: break.booking.561 password: P6ssw0rd")
    console.log("In booking entity list init" );
    this.apptBookingEntityDataService.retrieveAllBookingEntities().subscribe(
      response => {
        console.log(response);
        this.apptBookingEntityList = response;
        console.log(this.apptBookingEntityList);
      }
    )
  }


  addApptBookingEntity(): void {
    this.router.navigate(['entity']);
  }

  update(gid): void {
    console.log(gid);
    this.router.navigate(['entity', gid]);
  }

  delete(gid): void {
    if (confirm("Confirm delete?")) {
      this.apptBookingEntityDataService.deleteBookingEntity(gid).subscribe(
        response => {
          console.log('Entity deleted. ' + gid);
        }
      )
      this.router.navigate(['list']);
    }
  }

}

