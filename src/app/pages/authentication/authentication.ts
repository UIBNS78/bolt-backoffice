import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Store } from '@ngxs/store';
import { SetUserAction } from '../../../store/user/user.action';
import { SetRefreshTokenAction, SetTokenAction } from '../../../store/app/app.action';
import { Router } from '@angular/router';
import { SigninResponse } from './types/signin-response';
import { REFRESH_TOKEN, TOKEN, USER } from '@shared/constants/storage';

@Injectable({
  providedIn: 'root'
})
export class Authentication {

  constructor(
    private http: HttpClient,
    private store: Store,
    private router: Router
  ) { }

  signin(user: any): Observable<SigninResponse> {
    return this.http.post<SigninResponse>(`${environment.apiURL}/auth/signin`, { user });
  }

  refreshToken(refreshToken: string): Observable<SigninResponse> {
    return this.http.post<SigninResponse>(`${environment.apiURL}/auth/refresh-token`, { refreshToken });
  }

  logout(): void {
    this.store.dispatch([
      new SetUserAction(null),
      new SetTokenAction(null),
      new SetRefreshTokenAction(null)
    ]).subscribe(() => {
        localStorage.removeItem(USER);
        localStorage.removeItem(TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        this.router.navigate(["/authentication"]);
        // this.googleAuthService.authState.subscribe((user: SocialUser) => user && this.googleAuthService.signOut());
    });
  }
}
