import { inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, EMPTY, finalize, Observable, switchMap, throwError } from 'rxjs';
import { Store } from '@ngxs/store';
import { SetBusyAction, SetRefreshTokenAction, SetTokenAction } from '../store/app/app.action';
import { AppState } from '../store/app/app.state';
import { Authentication } from 'app/pages/authentication/authentication';
import { SetUserAction } from 'store/user/user.action';
import { REFRESH_TOKEN, TOKEN, USER } from '@shared/constants/storage';
import { MessageService } from 'primeng/api';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  private httpCalls: number = 0;
  private authService: Authentication = inject(Authentication);
  private store: Store = inject(Store);
  private messageService: MessageService = inject(MessageService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token: string | null = this.store.selectSnapshot<string | null>(AppState.token);
    const refreshToken: string | null = this.store.selectSnapshot<string | null>(AppState.refreshToken);

    this.httpCallsBusy();
    
    const requestCloned: HttpRequest<unknown> = this.injectToken(request, token);
    return next.handle(requestCloned).pipe(
      catchError((error: HttpErrorResponse) => {
        switch(error.status) {
          case 400: {
            this.messageService.add({
              severity: 'error',
              summary: "Erreur",
              detail: error.error.message ?? "Certain champ sont invalide.",
              life: 5000
            });
            console.log(error.error.message ?? "Certain champ sont invalide.", "Erreur");
            break;
          }
          case 401: {
            if (refreshToken) {
              return this.authService.refreshToken(refreshToken).pipe(
                switchMap(response => {
                  this.store.dispatch([
                    new SetUserAction(response.user),
                    new SetTokenAction(response.token),
                    new SetRefreshTokenAction(response.refreshToken)
                  ]).subscribe(() => {
                    localStorage.setItem(USER, JSON.stringify(response.user));
                    localStorage.setItem(TOKEN, response.token);
                    localStorage.setItem(REFRESH_TOKEN, response.refreshToken);
                  });
                  return next.handle(this.injectToken(request, response.token))
                }),
                catchError(() => {
                  this.messageService.add({
                    severity: 'error',
                    summary: "Session expirée",
                    detail: "Veuillez vous reconnecter.",
                    life: 5000
                  });
                  console.log("Veuillez vous reconnecter.", "Session expirée");
                  this.authService.logout();
                  return EMPTY;
                })
              );
            } else {
              this.messageService.add({
                severity: 'error',
                summary: "Session expirée",
                detail: "Veuillez vous reconnecter.",
                life: 5000
              });
              console.log("Veuillez vous reconnecter.", "Session expirée");
              this.authService.logout();
            }
            break;
          }
          case 402: {
            this.messageService.add({
              severity: 'error',
              summary: "Erreur",
              detail: error.error.message,
              life: 5000
            });
            console.log(error.error.message, "Erreur");
            break;
          }
          case 403: {
            this.messageService.add({
              severity: 'error',
              summary: "Erreur",
              detail: error.error.message ?? "Forbidden.",
              life: 5000
            });
            console.log(error.error.message ?? "Forbidden.", "Erreur");
            break;
          }
          default: 
            this.messageService.add({
              severity: 'error',
              summary: "Erreur",
              detail: "Une erreur inattendue s'est produite dans le serveur.",
              life: 5000
            });
            console.log("Une erreur inattendue s'est produite dans le serveur.", "Erreur");
            break;
        }

        return throwError(() => error);
      }),
      finalize(() => this.httpCallsFree())
    );
  }

  private injectToken(request: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> {
    if (token) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return request
  }

  private httpCallsBusy(): void {
    if (this.httpCalls === 0) {
      this.store.dispatch(new SetBusyAction(true));
    }
    this.httpCalls++;
  }

  private httpCallsFree(): void {
    this.httpCalls--;
    if (this.httpCalls === 0) {
      this.store.dispatch(new SetBusyAction(false));
    }
  }
}
