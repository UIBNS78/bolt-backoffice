import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Store } from '@ngxs/store';
import { SetUserAction } from '../../../store/user/user.action';
import { SetRefreshTokenAction, SetTokenAction } from '../../../store/app/app.action';
import { Router } from '@angular/router';
import { SigninResponse } from './types/signin-response';
import { REFRESH_TOKEN, TOKEN, USER } from '@shared/constants/storage';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class Authentication {
  private http: HttpClient = inject(HttpClient);
  private store: Store = inject(Store);
  private router: Router = inject(Router);
  protected socialAuthService: SocialAuthService = inject(SocialAuthService);

  
  signin(user: SocialUser): Observable<SigninResponse> {
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
        this.socialAuthService.authState.subscribe((user: SocialUser) => user && this.socialAuthService.signOut());
    });
  }
}
