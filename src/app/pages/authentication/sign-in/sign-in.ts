import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Authentication } from '../authentication';
import { first, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngxs/store';
import { SetUserAction } from 'store/user/user.action';
import { SetRefreshTokenAction, SetTokenAction } from 'store/app/app.action';
import { MessageModule } from 'primeng/message';
import { Router } from '@angular/router';
import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';
import { REFRESH_TOKEN, TOKEN, USER } from '@shared/constants/storage';
import { SigninResponse } from '../types/signin-response';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-sign-in',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    DividerModule,
    GoogleSigninButtonModule
  ],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();
  
  protected form: FormGroup = new FormGroup({});
  private formBuilder: FormBuilder = inject(FormBuilder);
  private authService: Authentication = inject(Authentication);
  private socialAuthService: SocialAuthService = inject(SocialAuthService);
  private router: Router = inject(Router);
  private store: Store = inject(Store);

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((user) => {
      if (user != null) {
        this.authService.signin(user).pipe(
          first(),
          takeUntil(this.unsubscribe$)
        ).subscribe((response: SigninResponse) => {
          this.store.dispatch([
            new SetUserAction(response.user),
            new SetTokenAction(response.token),
            new SetRefreshTokenAction(response.refreshToken)
          ]).subscribe(() => {
            localStorage.setItem(USER, JSON.stringify(response.user));
            localStorage.setItem(TOKEN, response.token);
            localStorage.setItem(REFRESH_TOKEN, response.refreshToken);
            this.router.navigate(["/"]);
          });
        });
      }
    });

    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log(this.form.getRawValue());
  }
}
