import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AppState } from '../../store/app/app.state';

export const authGuard: CanActivateFn = (route, state) => {
  const store: Store = inject(Store);
  const router: Router = inject(Router);
  const token: string | null = store.selectSnapshot<string | null>(AppState.token);
  
  return token ? router.parseUrl("/") : true;
};
