import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  isLoggedIn: boolean = false;

  constructor(
    protected readonly keycloakService: KeycloakService,
  ) {}

  async ngOnInit(): Promise<any> {
    return this.isLoggedIn = await this.keycloakService.isLoggedIn();
    //this.keycloakService.
  }

  doLogin(): void {
    this.keycloakService.login();
  }

  doLogout(): void {
    this.keycloakService.logout();
  }

}
