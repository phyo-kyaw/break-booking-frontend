import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Store } from '@ngrx/store';
import { login, role } from 'app/store/action';
import { Status } from 'app/store/reducer';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  reducer$: Status;
  username: string;
  level: string;
  public isMenuCollapsed = true;

  constructor(
    protected readonly keycloakService: KeycloakService,
    private store: Store<{ reducer: Status }>
  ) {
    this.store.select('reducer').subscribe(res => (this.reducer$ = res));
  }

  async ngOnInit(): Promise<any> {
    const isLogin = await this.keycloakService.isLoggedIn();
    const isAdmin = await this.keycloakService.isUserInRole('booking-admin');
    const userName = await this.keycloakService.loadUserProfile();
    console.log(userName);
    if (isLogin) {
      this.store.dispatch(login({ isLogin: true }));
      console.log(this.keycloakService.getUserRoles());
      localStorage.setItem('isLogin', 'true');
      localStorage.setItem(
        'role',
        isAdmin ? 'booking-admin' : 'default-roles-break-booking'
      );
      if (isAdmin) {
        this.store.dispatch(role({ role: 'booking-admin' }));
      } else {
        this.store.dispatch(role({ role: 'default-roles-break-booking' }));
      }

      this.username = userName.username;
      this.level = isAdmin ? 'Admin' : 'User';
    }
    // this.keycloakService.
  }

  doLogin(): void {
    this.keycloakService.login();
  }

  doLogout(): void {
    this.keycloakService.logout();
    this.store.dispatch(login({ isLogin: false }));
    localStorage.setItem('isLogin', 'false');
    localStorage.setItem('role', '');
  }
}
