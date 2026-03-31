import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
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
    ButtonModule
  ],
  templateUrl: './owner-form.html',
  styleUrl: './owner-form.css',
})
export class OwnerForm {
  private _form: FormGroup = new FormGroup({});

  // services
  private formBuilder: FormBuilder = inject(FormBuilder);
  private ownerService: OwnersService = inject(OwnersService);
  private messageService: MessageService = inject(MessageService);

  // vars
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
			email: [data?.email ?? '', [Validators.required, Validators.email]],
      phone: [data?.phone ?? '', [Validators.required]],
			password: [{ value: this.isUpdate ? '' : DEFAULT_USER_PASSWORD, disabled: true }, [Validators.minLength(8)]],
      planId: [data?.planId ?? 1, [Validators.required, Validators.max(3)]]
    });
  }  
  get form(): FormGroup {
    return this._form;
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log(this.form.getRawValue() as Owner);
  }

  handleClose(): void {
    this.onCloseEmitter.emit();
  }
}
