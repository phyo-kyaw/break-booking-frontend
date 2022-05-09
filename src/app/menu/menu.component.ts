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
  constructor(
    protected readonly keycloakService: KeycloakService,
    private store: Store<{ reducer: Status }>
  ) {
    this.store.select('reducer').subscribe(res => (this.reducer$ = res));
  }

  async ngOnInit(): Promise<any> {
    console.log(this.reducer$);

    const isLogin = await this.keycloakService.isLoggedIn();
    const isAdmin = await this.keycloakService.isUserInRole('booking-admin');

    if (isLogin) {
      this.store.dispatch(login({ isLogin: true }));
      localStorage.setItem('isLogin', 'true');
      localStorage.setItem('role', isAdmin ? 'admin' : 'default');
      if (isAdmin) {
        this.store.dispatch(role({ role: 'admin' }));
      } else {
        this.store.dispatch(role({ role: 'default' }));
      }
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
