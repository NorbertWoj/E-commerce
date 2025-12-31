import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, from } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  private securedEndpoints = [
  `${environment.api.baseUrl}/api/orders`,
  `${environment.api.baseUrl}/api/checkout`
];

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const isSecured = this.securedEndpoints.some(url =>
      req.url.startsWith(url)
    );

    if (!isSecured) {
      return next.handle(req);
    }

    return from(this.auth.getAccessTokenSilently()).pipe(
      switchMap(token => {
        console.log('🔐 Adding token to request:', req.url);

        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });

        return next.handle(authReq);
      }),
      catchError(() => next.handle(req))
    );
  }
}
