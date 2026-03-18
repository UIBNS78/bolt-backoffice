import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { map, Observable, of, Subject } from 'rxjs';
import { Store } from '@ngxs/store';
import { SetRefreshTokenAction, SetTokenAction } from '../store/app/app.action';
import { AppState } from '../store/app/app.state';
import { AsyncPipe } from '@angular/common';
import { REFRESH_TOKEN, TOKEN, USER } from '@shared/constants/storage';
import { SetUserAction } from 'store/user/user.action';
import { User } from '@shared/types/user';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AsyncPipe
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject<void>();
  protected connected$: Observable<boolean> = of(false);
  protected busy$: Observable<boolean> = of(false);

  constructor(
    private store: Store,
  ) {
    this.connected$ = this.store.select(AppState.token).pipe(map(t => !!t));
    this.busy$ = this.store.select(AppState.isBusy);
}
  
  ngOnInit(): void {
    this.initGlobalState();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initGlobalState(): void {
    const user: string | null = localStorage.getItem(USER);
    const token: string | null = localStorage.getItem(TOKEN);
    const refreshToken: string | null = localStorage.getItem(REFRESH_TOKEN);
    if (user && token && refreshToken) {
      this.store.dispatch([
        new SetUserAction(JSON.parse(user) as User),
        new SetTokenAction(token),
        new SetRefreshTokenAction(refreshToken)
      ]);
    }
  }
}
