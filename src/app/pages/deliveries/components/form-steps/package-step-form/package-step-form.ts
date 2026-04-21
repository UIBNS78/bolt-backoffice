import { NgClass } from '@angular/common';
import { Component, EventEmitter, inject, OnDestroy, Output, signal, WritableSignal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputSelectOptions } from '@shared/components/types/input-select-options';
import { PACKAGE_STATUS, PackageForm, PackageStatus, PackageType, packageTypeObj } from '@shared/types/package';
import { GENDER, Gender } from '@shared/types/user';
import { DeliveryPricesService } from 'app/pages/delivery-prices/delivery-prices-service';
import { MessageService, SelectItemGroup } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { combineLatest, distinctUntilChanged, finalize, Subject, takeUntil } from 'rxjs';
import { packageTypeOptions as packageTypeOpt } from '@shared/constants/package';
import { packageStatusOptions as packageStatusOpt } from '@shared/constants/package';
import { genderOptions as genderOpts } from '@shared/constants/user';
import { TableModule } from 'primeng/table';
import { CivilityPipe } from '@shared/pipes/civility-pipe';
import { NgxMaskPipe } from 'ngx-mask';
import { TagModule } from 'primeng/tag';
import { PackageStatusSeverityPipe } from '@shared/pipes/package-pipes/package-status-severity-pipe';
import { PackageStatusPipe } from '@shared/pipes/package-pipes/package-status-pipe';
import { PackageStatusIconPipe } from '@shared/pipes/package-pipes/package-status-icon-pipe';

type LocationForm = {
  placeId: FormControl<number | null>;
  precision: FormControl<string | null>;
  destination?: FormControl<string | null>;
  cooperativeId?: FormControl<number | null>;
}

type PackageArrayType = {
  type: FormControl<PackageType | null>;
  gender: FormControl<Gender | null>;
  customer: FormControl<string | null>;
  phone: FormControl<string | null>;
  location: FormGroup<LocationForm>;
  price: FormControl<number | null>;
  deliveryPrice: FormControl<number | null>;
  isFragile: FormControl<boolean | null>;
  status: FormControl<PackageStatus | null>;
}

@Component({
  selector: 'app-package-step-form',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    MessageModule,
    SelectModule,
    InputNumberModule,
    FieldsetModule,
    ToggleSwitchModule,
    NgClass,
    InputMaskModule,
    TableModule,
    CivilityPipe,
    NgxMaskPipe,
    TagModule,
    PackageStatusPipe,
    PackageStatusIconPipe,
    PackageStatusSeverityPipe
  ],
  templateUrl: './package-step-form.html',
  styleUrl: './package-step-form.css',
})
export class PackageStepForm implements OnDestroy {
  // services
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  protected deliveryPricesService: DeliveryPricesService = inject(DeliveryPricesService);
  protected messageService: MessageService = inject(MessageService);

  // vars
  private unsubscribe$: Subject<void> = new Subject<void>();
  private _initialFormValues: WritableSignal<PackageForm | null> = signal(null);
  @Output() previousEmitter: EventEmitter<number> = new EventEmitter<number>();
  @Output() nextEmitter: EventEmitter<PackageForm[]> = new EventEmitter<PackageForm[]>();
  protected editIndex: WritableSignal<number> = signal(-1); // -1 for create
  protected form: FormGroup = new FormGroup({});
  protected loading: WritableSignal<boolean> = signal(false);
  protected packageTypeOptions: InputSelectOptions[] = packageTypeOpt;
  protected packageStatusOptions: InputSelectOptions[] = packageStatusOpt;
  protected genderOptions: { value: string; label: string }[] = genderOpts;
  protected packageTypeSignal: WritableSignal<PackageType> = signal(packageTypeObj.inCity);
  protected locationCityOptions: SelectItemGroup[] = this.deliveryPricesService.cityOptions();
  protected locationCooperativeOptions: SelectItemGroup[] = this.deliveryPricesService.cooperativeOptions();
  protected packages: FormArray<FormGroup<PackageArrayType>> = new FormArray<FormGroup<PackageArrayType>>([]);

  constructor() {
    this.form = this.formBuilder.group({
      type: new FormControl<PackageType>(packageTypeObj.inCity, { validators: [Validators.required], nonNullable: true }),
      gender: new FormControl<Gender>(GENDER.MAN, { validators: [Validators.required], nonNullable: true }),
      customer: new FormControl('', { validators: [Validators.required, Validators.minLength(3)], nonNullable: true }),
      phone: new FormControl('', { validators: [Validators.required], nonNullable: true }),
      location: this.formBuilder.group({
        placeId: new FormControl<number | null>(null, [Validators.required]),
        precision: new FormControl<string | null>(null),
      }) as FormGroup<LocationForm>,
      price: new FormControl<number>(0, { validators: [Validators.required, Validators.min(0)], nonNullable: true }),
      deliveryPrice: new FormControl<number>({ value: 0, disabled: true }, { validators: [Validators.required, Validators.min(0)], nonNullable: true }),
      isFragile: new FormControl<boolean>(false, { validators: [Validators.required], nonNullable: true }),
      status: new FormControl<PackageStatus>(PACKAGE_STATUS.inProgress, { validators: [Validators.required], nonNullable: true }),
    });

    this._initialFormValues.set(this.form.getRawValue());
    this.packageTypeListener();
    this.locationInCityListener();
    this.locationOutCityListener();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  handlePrevious(): void {
    this.previousEmitter.emit();
  }

  addPackage(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.editIndex() === -1) {
      this.packages.push(this.createPackageGroup(this.form.getRawValue()));
    } else {
      this.packages.at(this.editIndex()).patchValue(this.form.getRawValue());
      this.editIndex.set(-1);
    }

    this.resetForm();
  }

  private createPackageGroup(values: any): FormGroup<PackageArrayType> {
    const locationGroup = this.formBuilder.group({
      placeId: [values.location.placeId, values.type === packageTypeObj.inCity ? [Validators.required] : []],
      precision: [values.location.precision],
      destination: [values.location.destination, values.type === packageTypeObj.outCity ? [Validators.required, Validators.minLength(3)] : []],
      cooperativeId: [values.location.cooperativeId, values.type === packageTypeObj.outCity ? [Validators.required] : []]
    }) as FormGroup<LocationForm>;

    return this.formBuilder.group({
      type: [values.type, [Validators.required]],
      gender: [values.gender, [Validators.required]],
      customer: [values.customer, [Validators.required, Validators.minLength(3)]],
      phone: [values.phone, [Validators.required]],
      location: locationGroup,
      price: [values.price, [Validators.required, Validators.min(0)]],
      deliveryPrice: [values.deliveryPrice, [Validators.required, Validators.min(0)]],
      isFragile: [values.isFragile, [Validators.required]],
      status: [values.status, [Validators.required]],
    }) as FormGroup<PackageArrayType>;
  }

  editPackage(index: number) {
    this.editIndex.set(index);
    this.form.patchValue(this.packages.at(index).value);
  }
  
  removePackage(index: number) {
    this.packages.removeAt(index);
    if (this.editIndex() === index) this.resetForm();
  }

  handleSubmit(): void {
    if (this.packages.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez ajouter au moins un colis avant de continuer'
      });

      return;
    }

    this.nextEmitter.emit(this.packages.value.map(p => ({
      deliveryId: -1,
      type: p.type,
      gender: p.gender,
      customer: p.customer,
      phone: p.phone,
      placeId: p.location?.placeId,
      precision: p.location?.precision,
      destination: p.location?.destination,
      cooperativeId: p.location?.cooperativeId,
      price: p.price,
      deliveryPrice: p.deliveryPrice,
      isFragile: p.isFragile ? 1 : 0,
      status: p.status,
    })) as PackageForm[]);
  }

  getPlaceName(id: number): string {
    return this.locationCityOptions.flatMap(lco => lco.items).find(i => i.value === id)?.label ?? '';
  }

  getCooperativeName(id: number): string {
    return this.locationCooperativeOptions.flatMap(lco => lco.items).find(i => i.value === id)?.label ?? ''; 
  }

  resetForm() {
    this.editIndex.set(-1);
    this.form.reset(this._initialFormValues());
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
          placeId: [{ value: null, disabled: this.locationCityOptions.length <= 0 }, [Validators.required]],
          precision: '',
        });
        break;
      case packageTypeObj.outCity:
        locationControl = this.formBuilder.group({
          destination: [{ value: null, disabled: this.locationCooperativeOptions.length <= 0 }, [Validators.required, Validators.minLength(3)]],
          cooperativeId: [{ value: '', disabled: this.locationCooperativeOptions.length <= 0 }, [Validators.required]]
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
      const locationCity: SelectItemGroup | undefined = this.locationCityOptions.find(lco => lco.items.find(i => i.value === value))
      this.form.get("deliveryPrice")?.setValue(locationCity ? locationCity.value : 0);
    });
  }

  private locationOutCityListener(): void {
    // out city
    this.form.get('location.cooperativeId')?.valueChanges.pipe(
      takeUntil(this.unsubscribe$),
      distinctUntilChanged()
    ).subscribe((value: number) => {
      const locationCity: SelectItemGroup | undefined = this.locationCooperativeOptions.find(lco => lco.items.find(i => i.value === value))
      this.form.get("deliveryPrice")?.setValue(locationCity ? locationCity.value : 0);
    });
  }
}
