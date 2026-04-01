import { Component, EventEmitter, inject, Input, Output, signal, WritableSignal } from '@angular/core';
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

@Component({
  selector: 'app-delivery-man-form',
  imports: [
    DrawerModule,
    ButtonModule,
    InputTextModule,
    MessageModule,
    DatePickerModule,
    IconFieldModule,
    InputIconModule,
    SelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './delivery-man-form.html',
  styleUrl: './delivery-man-form.css',
})
export class DeliveryManForm {
  private _form: FormGroup = new FormGroup({});
  
  // services
  protected formBuilder: FormBuilder = inject(FormBuilder);
  // vars
  protected isUpdate: WritableSignal<boolean> = signal(false);
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
      birthday: [data?.birthday ?? '', [Validators.required]],
      phone: [data?.phone ?? '', [Validators.required]],
      address: [data?.address ?? '', [Validators.required, Validators.minLength(3)]],
      password: [{ value: data !== null ? '' : DEFAULT_USER_PASSWORD, disabled: true }, [Validators.minLength(8)]],
      totalPackages: [data?.totalPackages ?? 0, [Validators.pattern("[0-9]*"), Validators.min(0)]],
      transport: [data?.transport ?? 1, [Validators.required, Validators.max(3)]]
    });
  };
  get form(): FormGroup {
    return this._form;
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log(this.form.getRawValue());
  }

  handleClose(): void {
    this.form.reset();
    this.onCloseEmitter.emit();
  }
}
