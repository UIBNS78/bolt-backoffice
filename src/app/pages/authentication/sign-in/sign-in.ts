import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Authentication } from '../authentication';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngxs/store';
import { SetUserAction } from 'store/user/user.action';
import { SetRefreshTokenAction, SetTokenAction } from 'store/app/app.action';
import { mockRefreshToken, mockToken, mockUser } from '@shared/constants/mocks';
import { MessageModule } from 'primeng/message';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sign-in',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    MessageModule
  ],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();
  
  protected form: FormGroup = new FormGroup({});
  protected formBuilder: FormBuilder = inject(FormBuilder);
  protected authService: Authentication = inject(Authentication);
  protected router: Router = inject(Router);
  protected store: Store = inject(Store);

  ngOnInit(): void {
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

    this.authService.signin().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.store.dispatch([
        new SetUserAction(mockUser),
        new SetTokenAction(mockToken),
        new SetRefreshTokenAction(mockRefreshToken)
      ]).subscribe(() => {
        this.form.reset();
        this.router.navigate(["/"]);
      });
    });
  }
}
