import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; //remplace HttpClienModule pour Angular 18
import { provideAuth0 } from '@auth0/auth0-angular';
import { routes } from './app.routes';
import myAppConfig from './config/my-app-config';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideAuth0({
      domain: myAppConfig.auth.domain,
      clientId: myAppConfig.auth.clientId,
      authorizationParams: {
        redirect_uri: myAppConfig.auth.authorizationParams.redirect_uri || window.location.origin,
        audience: myAppConfig.auth.authorizationParams.audience,
        scope: 'openid profile email'
      },
      httpInterceptor: {
        allowedList: myAppConfig.httpInterceptor.allowedList
      }
    }),
    provideHttpClient(withInterceptorsFromDi()),
  ]
};
