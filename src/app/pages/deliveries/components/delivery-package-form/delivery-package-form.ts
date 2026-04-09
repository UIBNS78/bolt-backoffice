import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService, SelectItemGroup } from 'primeng/api';
import { DrawerModule } from 'primeng/drawer';
import { finalize, Subject, takeUntil } from 'rxjs';
import { DeliveriesService } from '../../deliveries-service';
import { Package, PACKAGE_STATUS } from '@shared/types/package';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { genderOptions as genderOpts } from '@shared/constants/user';
import { InputNumberModule } from 'primeng/inputnumber';
import { FieldsetModule } from 'primeng/fieldset';
import { GENDER } from '@shared/types/user';
import { DeliveryPricesService } from 'app/pages/delivery-prices/delivery-prices-service';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { deliveryTypeObj, deliveryTypeOptions as deliveryTypeOpt } from '@shared/constants/delivery-type';
import { InputSelectOptions } from '@shared/components/types/input-select-options';
import { packageStatusOptions as packageStatusOpt } from '@shared/constants/package-status';
import { NgClass } from '@angular/common';
import { InputMaskModule } from 'primeng/inputmask';

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
    FieldsetModule,
    ToggleSwitchModule,
    NgClass,
    InputMaskModule
  ],
  templateUrl: './delivery-package-form.html',
  styleUrl: './delivery-package-form.css',
})
export class DeliveryPackageForm implements OnInit, OnDestroy {
  // services
  private formBuilder: FormBuilder = inject(FormBuilder);
  protected deliveriesService: DeliveriesService = inject(DeliveriesService);
  protected deliveryPricesService: DeliveryPricesService = inject(DeliveryPricesService);
  protected messageService: MessageService = inject(MessageService);

  // vars
  private unsubscribe$: Subject<void> = new Subject<void>();
  private _form: FormGroup = new FormGroup({});
  protected deliveryTypeOptions: InputSelectOptions[] = deliveryTypeOpt;
  protected packageStatusOptions: InputSelectOptions[] = packageStatusOpt;
  protected genderOptions: { value: string; label: string }[] = genderOpts;
  protected isUpdate: WritableSignal<boolean> = signal(false);
  protected loading: WritableSignal<boolean> = signal(false);
  protected locationOptions: WritableSignal<SelectItemGroup[]> = signal([]);

  @Output() onCloseEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Input() open: boolean = false;
  @Input() 
  set pkg(data: Partial<Package> | null) {
    this.isUpdate.set(data !== null);

    this._form = this.formBuilder.group({
      id: data?.id ?? null,
      deliveryType: [data?.deliveryType ?? deliveryTypeObj.inCity, [Validators.required, Validators.min(1), Validators.max(2)]],
      gender: [data?.customer?.gender ?? GENDER.MAN, [Validators.required, Validators.min(1), Validators.max(2)]],
      customer: [data?.customer?.name ?? '', [Validators.required, Validators.minLength(3)]],
      phone: [data?.customer?.phone ?? '', [Validators.required]],
      place: [{ value: data?.customer?.place ?? '', disabled: this.locationOptions().length <= 0 }, [Validators.required, Validators.minLength(3)]],
      precision: data?.customer?.precision ?? '',
      price: [data?.price ?? '', [Validators.required, Validators.min(0)]],
      deliveryPrice: [{ value: data?.deliveryPrice ?? '', disabled: true }, [Validators.required, Validators.min(0)]],
      isFragile: [data?.isFragile ?? false, [Validators.required]],
      status: [data?.status ?? PACKAGE_STATUS.inProgress, [Validators.required, Validators.min(1), Validators.max(4)]],
    });
  };
  get form(): FormGroup {
    return this._form;
  }

  ngOnInit(): void {
    this.loadLocationOptions();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadLocationOptions(): void {
    this.loading.set(true);
    this.deliveryPricesService.getAllCityOptions().pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.loading.set(false))
    ).subscribe(locations => {
      this.locationOptions.set(locations);
      this.form.get('place')?.enable();
    });
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
