import { inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, catchError, filter, finalize, Observable, switchMap, take, throwError } from 'rxjs';
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

  private isRefreshingToken: boolean = false;
  private refreshTokenSubject$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token: string | null = this.store.selectSnapshot<string | null>(AppState.token);

    this.httpCallsBusy();
    
    const requestCloned: HttpRequest<unknown> = this.injectToken(request, token);
    return next.handle(requestCloned).pipe(
      catchError((error: HttpErrorResponse) => {
        switch(error.status) {
          case 400: {
            this.showErrorMessage(error.error.message ?? "Certain champ sont invalide.");
            break;
          }
          case 401: {
            return this.handle401Error(request, next, error);
          }
          case 402: {
            this.showErrorMessage(error.error.message);
            break;
          }
          case 403: {
            this.showErrorMessage(error.error.message ?? "Forbidden.");
            break;
          }
          default: 
            this.showErrorMessage("Une erreur inattendue s'est produite dans le serveur.");
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

  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler, error: HttpErrorResponse): Observable<HttpEvent<unknown>> {
    const refreshToken: string | null = this.store.selectSnapshot<string | null>(AppState.refreshToken);
    
    if (!refreshToken) {
      this.triggerLogout();
      return throwError(() => error);
    }

    if (this.isRefreshingToken) {
      return this.refreshTokenSubject$.pipe(
        filter(token => !!token),
        take(1),
        switchMap(token => next.handle(this.injectToken(request, token))),
        catchError(err => throwError(() => err))
      );
    }

    this.isRefreshingToken = true;
    this.refreshTokenSubject$.next(null);

    return this.authService.refreshToken(refreshToken).pipe(
      switchMap(response => {
        this.isRefreshingToken = false;

        this.refreshTokenSubject$.next(response.token);

        this.store.dispatch([
            new SetUserAction(response.user),
            new SetTokenAction(response.token),
            new SetRefreshTokenAction(response.refreshToken)
          ]).subscribe(() => {
            localStorage.setItem(USER, JSON.stringify(response.user));
            localStorage.setItem(TOKEN, response.token);
            localStorage.setItem(REFRESH_TOKEN, response.refreshToken);
          });

          return next.handle(this.injectToken(request, response.token));
      }),
      catchError(err => {
        this.isRefreshingToken = false;
        this.refreshTokenSubject$.error(err);
        this.triggerLogout();
        return throwError(() => err);
      })
    );
  }

  private showErrorMessage(detail: string, summary: string = "Erreur"): void {
    this.messageService.add({
      severity: "error",
      summary,
      detail,
      life: 5000
    });
  }

  private triggerLogout(): void {
    this.showErrorMessage("Veuillez vous reconnecter.", "Session expirée");
    this.authService.logout();
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
