import { Component, ElementRef, EventEmitter, inject, Input, OnDestroy, Output, Signal, signal, ViewChild, viewChild, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService, SelectItemGroup } from 'primeng/api';
import { DrawerModule } from 'primeng/drawer';
import { distinctUntilChanged, finalize, Subject, takeUntil } from 'rxjs';
import { DeliveriesService } from '../../../deliveries-service';
import { PackageType, packageTypeObj, Package, PACKAGE_STATUS, PackageForm, PackageStatus } from '@shared/types/package';
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
import { DeliveryMenService } from 'app/pages/delivery-men/delivery-men-service';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { FormatImageSizePipe } from '@shared/pipes/format-image-size-pipe';
import { ImageModule } from 'primeng/image';

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
    InputMaskModule,
    FileUploadModule,
    FormatImageSizePipe,
    ImageModule
  ],
  templateUrl: './delivery-package-form.html',
  styleUrl: './delivery-package-form.css',
})
export class DeliveryPackageForm implements OnDestroy {
  // services
  private formBuilder: FormBuilder = inject(FormBuilder);
  protected deliveriesService: DeliveriesService = inject(DeliveriesService);
  protected deliveryPricesService: DeliveryPricesService = inject(DeliveryPricesService);
    private readonly deliveryMenService: DeliveryMenService = inject(DeliveryMenService);
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
  protected menOptions: Signal<InputSelectOptions[]> = this.deliveryMenService.options;
  protected locationCityOptions: Signal<SelectItemGroup[]> = this.deliveryPricesService.cityOptions;
  protected locationCooperativeOptions: Signal<SelectItemGroup[]> = this.deliveryPricesService.cooperativeOptions;

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
      deliveryManId: [data?.deliveryMan.id ?? null, [Validators.required, Validators.min(0)]],
      price: [data?.price ?? 0, [Validators.required, Validators.min(0)]],
      deliveryPrice: [{ value: data?.deliveryPrice ?? '', disabled: true }, [Validators.required, Validators.min(0)]],
      isFragile: [data?.isFragile ?? false, [Validators.required]],
      status: [data?.status ?? PACKAGE_STATUS.inProgress, [Validators.required, Validators.min(1), Validators.max(4)]],
      driverInformation: [{ value: data?.driverInformation ?? null, disabled: true }],
    });

    
    this.packageTypeListener();
    this.packageStatusListener();
    this.locationInCityListener();
    this.locationOutCityListener();

    this.packageTypeSignal.set(data?.type ?? packageTypeObj.inCity);
    this.initialFormValues.set(this._form.getRawValue());
    this._data.set(data);
  }
  get form(): FormGroup {
    return this._form;
  }
  get packageStatusControl(): FormControl {
    return this.form.get('status') as FormControl;
  }
  get driverInformationControl(): FormControl {
    return this.form.get('driverInformation') as FormControl;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  handleSubmit(close: boolean = true): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const values = this.form.getRawValue();
    const formData: FormData = new FormData();
    formData.append("deliveryId", this.deliveryId!.toString());
    formData.append("type", values.type);
    formData.append("gender", values.gender);
    formData.append("customer", values.customer);
    formData.append("phone", values.phone);
    formData.append("deliveryManId", values.deliveryManId);
    formData.append("price", values.price);
    formData.append("deliveryPrice", values.deliveryPrice);
    formData.append("isFragile", values.isFragile);
    formData.append("status", values.status);
    // append place city
    if (values.type === packageTypeObj.inCity) {
      formData.append("placeId", values.location.placeId);
      formData.append("precision", values.location.precision);
    }
    // append cooperative
    if (values.type === packageTypeObj.outCity) {
      formData.append("destination", values.location.destination);
      formData.append("cooperativeId", values.location.cooperativeId);
    }
    // append image
    if (values.driverInformation instanceof File) {
      const file: File = values.driverInformation as File;
      formData.append("driverInformation", file, file.name);
    }

    if (this.isUpdate()) {
      this.update(formData);
      return;
    }

    this.create(formData, close);
  }

  create(data: FormData, close: boolean): void {
    this.deliveriesService.createPackage(data).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.loading.set(false))
    ).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Création réussie',
        detail: 'Le colis a été créé avec succès.'
      });
      
      close && this.handleClose();
    });
  }

  update(data: FormData): void {
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

  handleOnSelectFile(event: FileSelectEvent): void {
    const file = event.currentFiles[0];
    this.form.patchValue({
      driverInformation: file
    });
    this.form.get("driverInformation")?.markAsTouched();
  }

  handleOnRemoveFile(): void {
    this.form.patchValue({
      driverInformation: null
    });
    this.form.get("driverInformation")?.markAsTouched();
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

  private packageStatusListener(): void {
    this.form.get("status")?.valueChanges.pipe(
      takeUntil(this.unsubscribe$),
      distinctUntilChanged()
    ).subscribe((value: PackageStatus) => {
      if (value === PACKAGE_STATUS.delivered && this.packageTypeSignal() === packageTypeObj.outCity) {
        this.form.setControl("driverInformation", this.formBuilder.control('', [Validators.required]));
        this.form.get("driverInformation")?.enable();
      } else {
        this.form.get("driverInformation")?.disable();
        this.form.removeControl("driverInformation");
        this.form.patchValue({
          driverInformation: null
        });
        this.form.get("driverInformation")?.markAsTouched();
      }
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
