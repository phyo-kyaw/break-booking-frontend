import { KeycloakService } from 'keycloak-angular';
import { environment } from '../../environments/environment';

export function initializeKeycloak(keycloak: KeycloakService): () => Promise<boolean> {
  //var URL = `${environment.homeUrl}/auth`;
    return () =>
        keycloak.init({
            config: {
                //url: 'https://break-booking.online:8443/auth',
                url: 'http://120.159.30.85/auth',
                realm: 'break-booking',
                clientId: 'break-booking-frontend-client',
            },
            initOptions: {
                checkLoginIframe: false,
                checkLoginIframeInterval: 25
            },
            loadUserProfileAtStartUp: true
        });
}
