import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService, SelectItemGroup } from 'primeng/api';
import { DrawerModule } from 'primeng/drawer';
import { combineLatest, distinctUntilChanged, finalize, Subject, takeUntil } from 'rxjs';
import { DeliveriesService } from '../../deliveries-service';
import { PackageType, packageTypeObj, Package, PACKAGE_STATUS, PackageForm } from '@shared/types/package';
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
import { packageTypeOptions as packageTypeOpt } from '@shared/constants/package';
import { InputSelectOptions } from '@shared/components/types/input-select-options';
import { packageStatusOptions as packageStatusOpt } from '@shared/constants/package';
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
  protected packageTypeSignal: WritableSignal<PackageType> = signal(packageTypeObj.inCity);
  protected locationCityOptions: WritableSignal<SelectItemGroup[]> = signal([]);
  protected locationCooperativeOptions: WritableSignal<SelectItemGroup[]> = signal([]);

  @Output() onCloseEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() open: boolean = false;
  @Input() deliveryId?: number;
  @Input() 
  set pkg(data: Package | null) {
    this.isUpdate.set(data !== null);

    this._form = this.formBuilder.group({
      id: data?.id ?? null,
      type: [data?.type ?? packageTypeObj.inCity, [Validators.required, Validators.min(1), Validators.max(2)]],
      gender: [data?.customer.gender ?? GENDER.MAN, [Validators.required, Validators.minLength(4), Validators.maxLength(6)]],
      customer: [data?.customer.name ?? '', [Validators.required, Validators.minLength(3)]],
      phone: [data?.customer.phone ?? '', [Validators.required]],
      location: 
        (data && data.type === packageTypeObj.outCity) ? 
          this.formBuilder.group({
            destination: [{ value: data?.customer.outCity?.destination ?? '', disabled: this.locationCooperativeOptions().length <= 0 }, [Validators.required, Validators.minLength(3)]],
            cooperativeId: [{ value: data?.customer.outCity?.cooperative.id ?? '', disabled: this.locationCooperativeOptions().length <= 0 }, [Validators.required]]
          }) : this.formBuilder.group({
            placeId: [{ value: data?.customer.inCity?.place.id ?? '', disabled: this.locationCityOptions().length <= 0 }, [Validators.required]],
            precision: data?.customer.inCity?.precision ?? '',
          }),
      price: [data?.price ?? 0, [Validators.required, Validators.min(0)]],
      deliveryPrice: [{ value: data?.deliveryPrice ?? '', disabled: true }, [Validators.required, Validators.min(0)]],
      isFragile: [data?.isFragile ?? false, [Validators.required]],
      status: [data?.status ?? PACKAGE_STATUS.inProgress, [Validators.required, Validators.min(1), Validators.max(4)]],
    });

    
    this.packageTypeListener();
    this.locationInCityListener();
    this.locationOutCityListener();

    this.packageTypeSignal.set(data?.type ?? packageTypeObj.inCity);
    this.initialFormValues.set(this._form.getRawValue());
    this._data.set(data);
  }
  get form(): FormGroup {
    return this._form;
  }

  ngOnInit(): void {
    this.loadOptions();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadOptions(): void {
    this.loading.set(true);
    combineLatest([
      this.deliveryPricesService.getAllCityOptions(),
      this.deliveryPricesService.getAllCooperativeOptions()
    ]).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.loading.set(false))
    ).subscribe(([inCityOptions, outCityOptions]) => {
      this.locationCityOptions.set(inCityOptions);
      this.locationCooperativeOptions.set(outCityOptions);
      this.form.get('location.placeId')?.enable();
      this.form.get('location.destination')?.enable();
      this.form.get('location.cooperativeId')?.enable();
    });
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const values = this.form.getRawValue();
    const rawValue: PackageForm = {
      deliveryId: this.deliveryId,
      type: values.type,
      gender: values.gender,
      customer: values.customer,
      phone: values.phone,
      placeId: values.location.placeId,
      precision: values.location.precision,
      destination: values.location.destination,
      cooperativeId: values.location.cooperativeId,
      price: values.price,
      deliveryPrice: values.deliveryPrice,
      isFragile: values.isFragile,
      status: values.status,
    } as PackageForm;

    if (this.isUpdate()) {
      this.update(rawValue);
      return;
    }

    this.create(rawValue);
  }

  create(data: PackageForm): void {
    this.deliveriesService.createPackage(data).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.loading.set(false))
    ).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Création réussie',
        detail: 'Le colis a été créé avec succès.'
      });
      
      this.handleClose();
    });
  }

  update(data: PackageForm): void {
    this.deliveriesService.updatePackage(this._data()!.id, data).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.loading.set(false))
    ).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Mise à jour réussie',
        detail: 'Le colis a été mis à jour avec succès.'
      });

      this.handleClose();
    });
  }

  handleClose(isCancel: boolean = false): void {
    this.form.reset(this.initialFormValues());
    this.onCloseEmitter.emit(isCancel);
  }

  private packageTypeListener(): void {
    this.form.get('type')?.valueChanges.pipe(
      takeUntil(this.unsubscribe$),
      distinctUntilChanged()
    ).subscribe((value: PackageType) => {
      this.form.get("deliveryPrice")?.setValue(0);
      this.rebuildForm(value);
    });
  }

  private rebuildForm(packageType: PackageType): void {
    let locationControl: FormGroup = this.formBuilder.group({});
    
    switch (packageType) {
      case packageTypeObj.inCity:
        locationControl = this.formBuilder.group({
          placeId: [{ value: this._data()?.customer.inCity?.place.id ?? '', disabled: this.locationCityOptions().length <= 0 }, [Validators.required]],
          precision: this._data()?.customer.inCity?.precision ?? '',
        });
        break;
      case packageTypeObj.outCity:
        locationControl = this.formBuilder.group({
          destination: [{ value: this._data()?.customer.outCity?.destination ?? '', disabled: this.locationCooperativeOptions().length <= 0 }, [Validators.required, Validators.minLength(3)]],
          cooperativeId: [{ value: this._data()?.customer.outCity?.cooperative.id ?? '', disabled: this.locationCooperativeOptions().length <= 0 }, [Validators.required]]
        });
        break;
    }

    this.form.setControl("location", locationControl);

    this.packageTypeSignal.set(packageType);
    this.locationInCityListener();
    this.locationOutCityListener();
  }

  private locationInCityListener(): void {
    // in city
    this.form.get('location.placeId')?.valueChanges.pipe(
      takeUntil(this.unsubscribe$),
      distinctUntilChanged()
    ).subscribe((value: number) => {
      const locationCity: SelectItemGroup | undefined = this.locationCityOptions().find(lco => lco.items.find(i => i.value === value))
      this.form.get("deliveryPrice")?.setValue(locationCity ? locationCity.value : 0);
    });
  }

  private locationOutCityListener(): void {
    // out city
    this.form.get('location.cooperativeId')?.valueChanges.pipe(
      takeUntil(this.unsubscribe$),
      distinctUntilChanged()
    ).subscribe((value: number) => {
      const locationCity: SelectItemGroup | undefined = this.locationCooperativeOptions().find(lco => lco.items.find(i => i.value === value))
      this.form.get("deliveryPrice")?.setValue(locationCity ? locationCity.value : 0);
    });
  }
}
