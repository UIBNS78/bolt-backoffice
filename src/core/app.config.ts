import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideStore } from '@ngxs/store';
import { AppState } from 'store/app/app.state';
import { UserState } from 'store/user/user.state';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppInterceptor } from './app-interceptor';
import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { environment } from 'environments/environment';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeuix/themes/lara';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // routing
    provideRouter(routes),
    // primeNG
    providePrimeNG({
      theme: {
        preset: Lara,
        options: {
          prefix: "bolt",
          darkModeSelector: ".none",
          cssLayer: {
            name: "primeng",
            order: "tailwind-base, primeng, tailwind-utilities"
          }
        }
      }
    }),
    // store
    provideStore([
      AppState,
      UserState
    ]),
    // google auth
    {
      provide: "SocialAuthServiceConfig",
      useValue: {
        autoLogin: true,
        lang: "fr",
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleClientID, {
              oneTapEnabled: false
            })
          }
        ],
        onError: (err: unknown) => {
          console.log("Error from app.config :", err);
        }
      } as SocialAuthServiceConfig,
    },
    // httpClient with interceptor
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptor,
      multi: true
    },
  ]
};
