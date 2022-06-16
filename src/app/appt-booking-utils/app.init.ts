import { KeycloakService } from 'keycloak-angular';
import { environment } from '../../environments/environment';

export function initializeKeycloak(
  keycloak: KeycloakService
): () => Promise<boolean> {
  //var URL = `${environment.homeUrl}/auth`;
<<<<<<< HEAD
    return () =>
        keycloak.init({
            config: {
                //url: 'https://break-booking.online:8443/auth',
                url: 'http://breakbookings.com/auth',
                realm: 'break-booking',
                clientId: 'break-booking-frontend-client',
            },
            initOptions: {
                checkLoginIframe: false,
                checkLoginIframeInterval: 25
            },
            loadUserProfileAtStartUp: true
        });
=======
  return () =>
    keycloak.init({
      config: {
        //url: 'https://break-booking.online:8443/auth',
        url: 'http://localhost:8181/auth',
        realm: 'break-booking',
        clientId: 'break-booking-frontend-client'
      },
      initOptions: {
        checkLoginIframe: false,
        checkLoginIframeInterval: 25
      },
      loadUserProfileAtStartUp: true
    });
>>>>>>> b733908adb70f5b2a16bddfa0c2d3bdbafe8f2f9
}
