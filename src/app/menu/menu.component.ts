import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Store } from '@ngrx/store';
import { login, role } from 'app/store/action';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  isLoggedIn: boolean = false;
  role: boolean;
  constructor(
    protected readonly keycloakService: KeycloakService,
    private store: Store
  ) {}

  async ngOnInit(): Promise<any> {
    // return (this.isLoggedIn = await this.keycloakService.isLoggedIn());
    this.isLoggedIn = await this.keycloakService.isLoggedIn();

    this.role = await this.keycloakService.isUserInRole('booking-admin');

    if (this.isLoggedIn) {
      this.store.dispatch(login({ isLogin: true }));
      // this.store.dispatch(staff({ isStaff: res.isStaff }));
    }
    //this.keycloakService.
  }

  doLogin(): void {
    this.keycloakService.login();
  }

  doLogout(): void {
    this.keycloakService.logout();
  }
}
