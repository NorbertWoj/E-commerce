import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; //remplace HttpClienModule pour Angular 18
import { authHttpInterceptorFn, provideAuth0 } from '@auth0/auth0-angular';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAuth0({
      domain: 'norwoj.us.auth0.com',
      clientId: 'fID6T0yQ0MEeOZSNrz8AEm3oZprU2FOF',
      authorizationParams: {
        redirect_uri: 'http://localhost:4200',
        audience: 'http://localhost:8080',
        scope: 'openid profile email'
      },
      httpInterceptor: {
        allowedList: [
          'http://localhost:8080/api/orders/*',
          'http://localhost:8080/api/checkout/*'
        ]
      }
    }),

    provideHttpClient(
      withInterceptors([authHttpInterceptorFn])
    )
  ]
};
