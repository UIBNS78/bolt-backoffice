import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideStore } from '@ngxs/store';
import { AppState } from 'store/app/app.state';
import { UserState } from 'store/user/user.state';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppInterceptor } from './app-interceptor';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SocialAuthServiceConfig, GoogleLoginProvider, SOCIAL_AUTH_CONFIG } from '@abacritt/angularx-social-login';
import { environment } from 'environments/environment';
import { MessageService } from 'primeng/api';
import { provideNgxMask } from 'ngx-mask';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // routing
    provideRouter(routes),
    // animations
    provideAnimationsAsync(),
    // primeNG
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: ".none",
          cssLayer: false
        }
      }
    }),
    MessageService,
    // google auth
    {
      provide: SOCIAL_AUTH_CONFIG,
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
    // store
    provideStore([
      AppState,
      UserState
    ]),
    // httpClient with interceptor
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptor,
      multi: true
    },
    // ngx-mask
    provideNgxMask()
  ]
};
