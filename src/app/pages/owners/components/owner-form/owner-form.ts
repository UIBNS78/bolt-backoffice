import { Component, EventEmitter, inject, Input, OnDestroy, Output, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DEFAULT_USER_PASSWORD } from '@shared/constants/user';
import { Owner } from '@shared/types/owner';
import { DrawerModule } from 'primeng/drawer';
import { OwnersService } from '../../owners-service';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { InputSelectOptions } from '@shared/components/types/input-select-options';
import { planObj } from '@shared/types/owner-plan';
import { ButtonModule } from 'primeng/button';
import { finalize, Subject, takeUntil } from 'rxjs';
import { genderOptions as genderOpts } from '@shared/constants/user';
import { GENDER } from '@shared/types/user';
import { InputMaskModule } from 'primeng/inputmask';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-owner-form',
  imports: [
    DrawerModule,
    ReactiveFormsModule,
    InputTextModule,
    MessageModule,
    IconFieldModule,
    InputIconModule,
    SelectModule,
    ButtonModule,
    InputMaskModule,
    ToggleSwitchModule
  ],
  templateUrl: './owner-form.html',
  styleUrl: './owner-form.css',
})
export class OwnerForm implements OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();
  private _form: FormGroup = new FormGroup({});

  // services
  private formBuilder: FormBuilder = inject(FormBuilder);
  private ownerService: OwnersService = inject(OwnersService);
  private messageService: MessageService = inject(MessageService);

  // vars
  protected genderOptions: { value: string; label: string }[] = genderOpts;
  private _initialValues: WritableSignal<Partial<Owner>> = signal({});
  protected loading: WritableSignal<boolean> = signal(false);
  protected ownerPlanOptions: InputSelectOptions[] = [
    { id: planObj.premium, label: "Premium" },
    { id: planObj.simple, label: "Simple" },
  ];
  @Output() onCloseEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Input() open: boolean = false;
  @Input() isUpdate: boolean = false;
  @Input()
  set owner(data: Partial<Owner> | undefined) {
    this._form = this.formBuilder.group({
      id: data?.id ?? null,
      commercialName: [data?.commercialName ?? '', [Validators.required, Validators.minLength(3)]],
      name: [data?.name ?? '', [Validators.required, Validators.minLength(3)]],
      firstName: [data?.firstName ?? '', [Validators.required, Validators.minLength(3)]],
      gender: [data?.gender ?? GENDER.MAN, [Validators.required, Validators.minLength(4), Validators.maxLength(6)]],
			email: [data?.email ?? '', [Validators.required, Validators.email]],
      phone: [data?.phone ?? '', [Validators.required]],
			password: [{ value: this.isUpdate ? '' : DEFAULT_USER_PASSWORD, disabled: true }, [Validators.minLength(8)]],
      state: [data?.state ?? false, [Validators.required]],
      planId: [data?.planId ?? 1, [Validators.required, Validators.max(3)]]
    });
    this._initialValues.set(this._form.getRawValue());
  }  
  get form(): FormGroup {
    return this._form;
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

    this.loading.set(true);
    this.ownerService.create(this.form.getRawValue() as Owner).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.loading.set(false))
    ).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Création réussie',
        detail: 'Le propriétaire a été créé avec succès.'
      });
      this.handleClose();
    });
  }

  handleClose(): void {
    this.form.reset(this._initialValues());
    this.onCloseEmitter.emit();
  }
}
