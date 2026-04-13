import { Component, EventEmitter, inject, Input, OnDestroy, Output, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DEFAULT_USER_PASSWORD } from '@shared/constants/user';
import { transportOptions as tOptions, type DeliveryMan } from '@shared/types/delivery-men';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { DatePickerModule } from 'primeng/datepicker';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { type InputSelectOptions } from '@shared/components/types/input-select-options';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { DeliveryMenService } from '../../delivery-men-service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { genderOptions as genderOpts } from '@shared/constants/user';
import { GENDER } from '@shared/types/user';
import { InputMaskModule } from 'primeng/inputmask';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { format } from 'date-fns';

@Component({
  selector: 'app-delivery-man-form',
  imports: [
    DrawerModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    MessageModule,
    DatePickerModule,
    IconFieldModule,
    InputIconModule,
    SelectModule,
    ReactiveFormsModule,
    InputMaskModule,
    FieldsetModule,
    FileUploadModule
  ],
  templateUrl: './delivery-man-form.html',
  styleUrl: './delivery-man-form.css',
})
export class DeliveryManForm implements OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();
  private _form: FormGroup = new FormGroup({});
  
  // services
  protected formBuilder: FormBuilder = inject(FormBuilder);
  protected deliveryManService: DeliveryMenService = inject(DeliveryMenService);
  protected messageService: MessageService = inject(MessageService);

  // vars
  protected genderOptions: { value: string; label: string }[] = genderOpts;
  private _initialValues: WritableSignal<Partial<DeliveryMan>> = signal({});
  protected isUpdate: WritableSignal<boolean> = signal(false);
  protected loading: WritableSignal<boolean> = signal(false);
  protected transportOptions: InputSelectOptions[] = tOptions;

  @Output() onCloseEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Input() open: boolean = false;
  @Input() 
  set deliveryMan(data: Partial<DeliveryMan> | null) {
    this.isUpdate.set(data !== null);

    this._form = this.formBuilder.group({
      id: data?.id ?? null,
      name: [data?.name ?? '', [Validators.required, Validators.minLength(3)]],
      firstName: [data?.firstName ?? '', [Validators.required, Validators.minLength(3)]],
      gender: [data?.gender ?? GENDER.MAN, [Validators.required, Validators.minLength(4), Validators.maxLength(6)]],
			email: [data?.email ?? '', [Validators.email]],
      birthday: [data && data.birthday ? format(data.birthday, "dd MMMM yyyy") : new Date(), [Validators.required]],
      phone: [data?.phone ?? '', [Validators.required]],
      address: [data?.address ?? '', [Validators.required, Validators.minLength(3)]],
      password: [{ value: data !== null ? '' : DEFAULT_USER_PASSWORD, disabled: true }, [Validators.minLength(8)]],
      totalPackages: [data?.totalPackages ?? 0, [Validators.pattern("[0-9]*"), Validators.min(0)]],
      transport: [data?.transport ?? 1, [Validators.required, Validators.max(3)]]
    });
    this._initialValues.set(this._form.getRawValue());
  };
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
    this.deliveryManService[this.isUpdate() ? 'update' : 'create']({
      ...this.form.getRawValue(),
      birthday: new Date(this.form.get('birthday')?.value),
    } as DeliveryMan).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.loading.set(false))
    ).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: this.isUpdate() ? 'Mise à jour réussie' : 'Création réussie',
        detail: `Le livreur a été ${this.isUpdate() ? 'mis à jour' : 'créé'} avec succès.`
      });
      this.handleClose();
    });
  }

  onUpload(file: FileUploadEvent): void {

  }

  handleClose(): void {
    this.form.reset(this._initialValues());
    this.onCloseEmitter.emit();
  }
}
