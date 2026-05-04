import { Component, EventEmitter, inject, Input, OnDestroy, Output, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { format } from 'date-fns';
import { ImageModule } from 'primeng/image';
import { FormatImageSizePipe } from '@shared/pipes/format-image-size-pipe';
import { NgClass } from '@angular/common';

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
    FileUploadModule,
    ImageModule,
    FormatImageSizePipe,
    NgClass
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
      password: [{ value: this.isUpdate() ? null : DEFAULT_USER_PASSWORD, disabled: true }, [Validators.minLength(8)]],
      totalPackages: [data?.totalPackages ?? 0, [Validators.pattern("[0-9]*"), Validators.min(0)]],
      transport: [data?.transport ?? 1, [Validators.required, Validators.max(3)]],
      profilePicture: [data?.profilePicture ?? null, [Validators.required]],
      cin: [data?.cin ?? null, [Validators.required]],
      residence: [data?.residence ?? null, [Validators.required]],
    });
    this._initialValues.set(this._form.getRawValue());
  };
  get form(): FormGroup {
    return this._form;
  }

  get profilePictureControl(): FormControl {
    return this.form.get('profilePicture') as FormControl;
  }

  get cinControl(): FormControl {
    return this.form.get('cin') as FormControl;
  }

  get residenceControl(): FormControl {
    return this.form.get('residence') as FormControl;
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
    const values = this.form.getRawValue();
    const formData: FormData = new FormData();
    formData.append("name", values.name);
    formData.append("firstName", values.firstName);    
    formData.append("gender", values.gender);
    formData.append("email", values.email);
    formData.append("birthday", new Date(values.birthday).toISOString());
    formData.append("phone", values.phone);
    formData.append("address", values.address);
    formData.append("totalPackages", values.totalPackages);
    formData.append("transport", values.transport);
    // append profile picture
    if (values.profilePicture instanceof File) {
      const file: File = values.profilePicture as File;
      formData.append("profilePicture", file, file.name);
    }
    // append CIN
    if (values.cin instanceof File) {
      const file: File = values.cin as File;
      formData.append("cin", file, file.name);
    }
    // append residence
    if (values.residence instanceof File) {
      const file: File = values.residence as File;
      formData.append("residence", file, file.name);
    }
    
    if (this.isUpdate()) {
      this.update(values.id, formData);
      return;
    }

    this.create(formData);
  }

  update(id: number, data: FormData): void {
    this.deliveryManService.update(id, data).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.loading.set(false))
    ).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Mise à jour réussie',
        detail: `Le livreur a été mis à jour avec succès.`
      });
      
      this.handleClose();
    });
  }

  create(data: FormData): void {
    this.deliveryManService.create(data).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.loading.set(false))
    ).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Création réussie',
        detail: `Le livreur a été créé avec succès.`
      });
      
      this.handleClose();
    });
  }
  
  handleOnSelectFile(event: FileSelectEvent, field: string): void {
    const file = event.currentFiles[0];
    this.form.patchValue({
      [field]: file
    });
    this.form.get(field)?.markAsTouched();
  }

  handleOnRemoveFile(field: string): void {
    this.form.patchValue({
      [field]: null
    });
    this.form.get(field)?.markAsTouched();
  }

  handleClose(): void {
    this.form.reset(this._initialValues());
    this.onCloseEmitter.emit();
  }
}
