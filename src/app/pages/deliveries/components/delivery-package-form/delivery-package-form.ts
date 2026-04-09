import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService, SelectItemGroup } from 'primeng/api';
import { DrawerModule } from 'primeng/drawer';
import { distinctUntilChanged, finalize, Subject, takeUntil } from 'rxjs';
import { DeliveriesService } from '../../deliveries-service';
import { PackageType, packageTypeObj, Package, PACKAGE_STATUS } from '@shared/types/package';
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
import { packageTypeOptions as packageTypeOpt } from '@shared/constants/delivery-type';
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
  private _data: WritableSignal<Package | null> = signal(null);
  private initialFormValues: WritableSignal<Package | null> = signal(null);
  protected packageTypeOptions: InputSelectOptions[] = packageTypeOpt;
  protected packageStatusOptions: InputSelectOptions[] = packageStatusOpt;
  protected genderOptions: { value: string; label: string }[] = genderOpts;
  protected isUpdate: WritableSignal<boolean> = signal(false);
  protected loading: WritableSignal<boolean> = signal(false);
  protected locationCityOptions: WritableSignal<SelectItemGroup[]> = signal([]);
  protected locationCooperativeOptions: WritableSignal<SelectItemGroup[]> = signal([]);

  @Output() onCloseEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Input() open: boolean = false;
  @Input() 
  set pkg(data: Package | null) {
    this.isUpdate.set(data !== null);

    this._form = this.formBuilder.group({
      id: data?.id ?? null,
      type: [data?.type ?? packageTypeObj.inCity, [Validators.required, Validators.min(1), Validators.max(2)]],
      gender: [data?.customer.gender ?? GENDER.MAN, [Validators.required, Validators.min(1), Validators.max(2)]],
      customer: [data?.customer.name ?? '', [Validators.required, Validators.minLength(3)]],
      phone: [data?.customer.phone ?? '', [Validators.required]],
      location: 
        (data && data.type === packageTypeObj.outCity) ? 
          this.formBuilder.group({
            destination: [{ value: data?.customer.outCity?.destination ?? '', disabled: this.locationCooperativeOptions().length <= 0 }, [Validators.required, Validators.minLength(3)]],
            cooperative: [{ value: data?.customer.outCity?.cooperative.id ?? '', disabled: this.locationCooperativeOptions().length <= 0 }, [Validators.required]]
          }) : this.formBuilder.group({
            place: [{ value: data?.customer.inCity?.place.id ?? '', disabled: this.locationCityOptions().length <= 0 }, [Validators.required]],
            precision: data?.customer.inCity?.precision ?? '',
          }),
      price: [data?.price ?? 0, [Validators.required, Validators.min(0)]],
      deliveryPrice: [{ value: data?.deliveryPrice ?? '', disabled: true }, [Validators.required, Validators.min(0)]],
      isFragile: [data?.isFragile ?? false, [Validators.required]],
      status: [data?.status ?? PACKAGE_STATUS.inProgress, [Validators.required, Validators.min(1), Validators.max(4)]],
    });

    this.initialFormValues.set(this._form.getRawValue());
    this._data.set(data);
  }
  get form(): FormGroup {
    return this._form;
  }

  ngOnInit(): void {
    this.loadCityOptions();
    this.packageTypeListener();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadCityOptions(): void {
    this.loading.set(true);
    this.deliveryPricesService.getAllCityOptions().pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.loading.set(false))
    ).subscribe(locations => {
      this.locationCityOptions.set(locations);
      this.form.get('location.place')?.enable();
    });
  }

  loadCooperativeOptions(): void {
    this.loading.set(true);
    this.deliveryPricesService.getAllCooperativeOptions().pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.loading.set(false))
    ).subscribe(locations => {
      this.locationCooperativeOptions.set(locations);
      this.form.get('location.destination')?.enable();
      this.form.get('location.cooperative')?.enable();
    });
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    console.log(this.form.getRawValue());
    this.loading.set(false);
  }

  handleClose(): void {
    this.form.reset(this.initialFormValues());
    this.onCloseEmitter.emit();
  }

  private packageTypeListener(): void {
    this.form.get('type')?.valueChanges.pipe(
      takeUntil(this.unsubscribe$),
      distinctUntilChanged()
    ).subscribe((value: PackageType) => {
      if (value === packageTypeObj.outCity) {
        this.loadCooperativeOptions();
      }
      
      this.rebuildForm(value);
    });
  }

  private rebuildForm(packageType: PackageType): void {
    let locationControl: FormGroup = this.formBuilder.group({});
    
    switch (packageType) {
      case packageTypeObj.inCity:
        locationControl = this.formBuilder.group({
          place: [{ value: this._data()?.customer.inCity?.place ?? '', disabled: this.locationCityOptions().length <= 0 }, [Validators.required]],
          precision: this._data()?.customer.inCity?.precision ?? '',
        });
        break;
      case packageTypeObj.outCity:
        locationControl = this.formBuilder.group({
          destination: [{ value: this._data()?.customer.outCity?.destination ?? '', disabled: this.locationCooperativeOptions().length <= 0 }, [Validators.required, Validators.minLength(3)]],
          cooperative: [{ value: this._data()?.customer.outCity?.cooperative.id ?? '', disabled: this.locationCooperativeOptions().length <= 0 }, [Validators.required]]
        });
        break;
    }

    this.form.setControl("location", locationControl)
  }
}
