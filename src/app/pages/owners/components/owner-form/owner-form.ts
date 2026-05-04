import { Component, EventEmitter, inject, Input, OnDestroy, Output, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DEFAULT_USER_PASSWORD, userStateOptions as userStateOpt } from '@shared/constants/user';
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
import { GENDER, USER_STATE } from '@shared/types/user';
import { InputMaskModule } from 'primeng/inputmask';
import { NgClass } from '@angular/common';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { FieldsetModule } from 'primeng/fieldset';
import { FormatImageSizePipe } from '@shared/pipes/format-image-size-pipe';

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
    FieldsetModule,
    NgClass,
    FileUploadModule,
    ImageModule,
    FormatImageSizePipe
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
  protected userStateOptions: { value: string; label: string }[]= userStateOpt;
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
      state: [data?.state ?? USER_STATE.pending, [Validators.required]],
      planId: [data?.planId ?? 1, [Validators.required, Validators.max(3)]],
      profilePicture: [null, [Validators.required]],
    });
    this._initialValues.set(this._form.getRawValue());
  }  
  get form(): FormGroup {
    return this._form;
  }

  get profilePictureControl(): FormControl {
    return this.form.get('profilePicture') as FormControl;
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
    formData.append("commercialName", values.commercialName);
    formData.append("name", values.name);
    formData.append("firstName", values.firstName);
    formData.append("gender", values.gender);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("state", values.state);
    formData.append("planId", values.planId);
    // append image
    if (values.profilePicture instanceof File) {
      const file: File = values.profilePicture as File;
      formData.append("profilePicture", file, file.name);
    }

    this.ownerService.create(formData).pipe(
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

  handleOnSelectFile(event: FileSelectEvent): void {
    const file = event.currentFiles[0];
    this.form.patchValue({
      profilePicture: file
    });
    this.form.get("profilePicture")?.markAsTouched();
  }

  handleOnRemoveFile(): void {
    this.form.patchValue({
      profilePicture: null
    });
    this.form.get("profilePicture")?.markAsTouched();
  }

  handleClose(): void {
    this.form.reset(this._initialValues());
    this.onCloseEmitter.emit();
  }
}
