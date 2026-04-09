import { Component, EventEmitter, inject, Input, OnDestroy, Output, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DrawerModule } from 'primeng/drawer';
import { Subject } from 'rxjs';
import { DeliveriesService } from '../../deliveries-service';
import { Package } from '@shared/types/package';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { genderOptions as genderOpts } from '@shared/constants/user';
import { InputNumberModule } from 'primeng/inputnumber';
import { FieldsetModule } from 'primeng/fieldset';
import { GENDER } from '@shared/types/user';

@Component({
  selector: 'app-delivery-package-form',
  imports: [
    DrawerModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    SelectModule,
    InputNumberModule,
    FieldsetModule
  ],
  templateUrl: './delivery-package-form.html',
  styleUrl: './delivery-package-form.css',
})
export class DeliveryPackageForm implements OnDestroy {
  // services
  private formBuilder: FormBuilder = inject(FormBuilder);
  protected deliveriesService: DeliveriesService = inject(DeliveriesService);
  protected messageService: MessageService = inject(MessageService);

  // vars
  private unsubscribe$: Subject<void> = new Subject<void>();
  private _form: FormGroup = new FormGroup({});
  protected genderOptions: { value: string; label: string }[] = genderOpts;
  protected isUpdate: WritableSignal<boolean> = signal(false);
  protected loading: WritableSignal<boolean> = signal(false);

  @Output() onCloseEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Input() open: boolean = false;
  @Input() 
  set pkg(data: Partial<Package> | null) {
    this.isUpdate.set(data !== null);

    this._form = this.formBuilder.group({
      id: data?.id ?? null,
      gender: [data?.customer?.gender ?? GENDER.MAN, [Validators.required, Validators.min(1), Validators.max(2)]],
      customer: [data?.customer?.name ?? '', [Validators.required, Validators.minLength(3)]],
      phone: [data?.customer?.phone ?? '', [Validators.required]],
      place: [data?.customer?.place ?? '', [Validators.required, Validators.minLength(3)]],
      precision: data?.customer?.place ?? '',
      price: [data?.price ?? '', [Validators.required, Validators.min(0)]],
      deliveryPrice: [data?.deliveryPrice ?? '', [Validators.required, Validators.min(0)]],
      status: [data?.status ?? '', [Validators.required, Validators.min(1), Validators.max(4)]],
    });
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
    console.log(this.form.getRawValue());
  }

  handleClose(): void {
    this.form.reset();
    this.onCloseEmitter.emit();
  }
}
