import { NgClass } from '@angular/common';
import { Component, EventEmitter, inject, OnDestroy, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputSelectOptions } from '@shared/components/types/input-select-options';
import { PACKAGE_STATUS, PackageForm, PackageType, packageTypeObj } from '@shared/types/package';
import { GENDER } from '@shared/types/user';
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

type PackageArrayType = {
  type: FormControl<string>;
  gender: FormControl<string>;
  customer: FormControl<string>;
  phone: FormControl<string>;
  location: FormGroup;
  price: FormControl<number>;
  deliveryPrice: FormControl<number>;
  isFragile: FormControl<boolean>;
  status: FormControl<string>;
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
    TableModule
  ],
  templateUrl: './package-step-form.html',
  styleUrl: './package-step-form.css',
})
export class PackageStepForm implements OnInit, OnDestroy {
  // services
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  protected deliveryPricesService: DeliveryPricesService = inject(DeliveryPricesService);
  protected messageService: MessageService = inject(MessageService);

  // vars
  private unsubscribe$: Subject<void> = new Subject<void>();
  @Output() previousEmitter: EventEmitter<number> = new EventEmitter<number>();
  @Output() nextEmitter: EventEmitter<PackageForm> = new EventEmitter<PackageForm>();
  protected editIndex: WritableSignal<number> = signal(-1); // -1 for create
  protected form: FormGroup = new FormGroup({});
  protected loading: WritableSignal<boolean> = signal(false);
  protected packageTypeOptions: InputSelectOptions[] = packageTypeOpt;
  protected packageStatusOptions: InputSelectOptions[] = packageStatusOpt;
  protected genderOptions: { value: string; label: string }[] = genderOpts;
  protected packageTypeSignal: WritableSignal<PackageType> = signal(packageTypeObj.inCity);
  protected locationCityOptions: WritableSignal<SelectItemGroup[]> = signal([]);
  protected locationCooperativeOptions: WritableSignal<SelectItemGroup[]> = signal([]);
  protected packages = new FormArray<FormGroup<PackageArrayType>>([]);

  constructor() {
    this.form = this.formBuilder.group({
      type: [packageTypeObj.inCity, [Validators.required, Validators.min(1), Validators.max(2)]],
      gender: [GENDER.MAN, [Validators.required, Validators.minLength(4), Validators.maxLength(6)]],
      customer: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required]],
      location: this.formBuilder.group({
        placeId: [{ value: null, disabled: this.locationCityOptions().length <= 0 }, [Validators.required]],
        precision: '',
      }),        
      price: [0, [Validators.required, Validators.min(0)]],
      deliveryPrice: [{ value: '', disabled: true }, [Validators.required, Validators.min(0)]],
      isFragile: [false, [Validators.required]],
      status: [PACKAGE_STATUS.inProgress, [Validators.required, Validators.min(1), Validators.max(4)]],
    });

    this.packageTypeListener();
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

  handlePrevious(): void {
    this.previousEmitter.emit();
  }

  addPackage(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    if (this.editIndex() === -1) {
      // create
      this.packages.push(this.formBuilder.group(this.form.getRawValue() as PackageArrayType));
    } else {
      // update
      this.packages.at(this.editIndex()).patchValue(this.form.value);
      this.editIndex.set(-1);
    }

    this.resetLeftForm();
  }

  editPackage(index: number) {
    this.editIndex.set(index);
    this.form.patchValue(this.packages.at(index));
  }
  
  removePackage(index: number) {
    this.packages.removeAt(index);
    if (this.editIndex() === index) this.resetLeftForm();
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

    this.nextEmitter.emit(this.form.getRawValue() as PackageForm);
  }

  private resetLeftForm() {
    this.editIndex.set(-1);
    this.form.reset();
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
          placeId: [{ value: null, disabled: this.locationCityOptions().length <= 0 }, [Validators.required]],
          precision: '',
        });
        break;
      case packageTypeObj.outCity:
        locationControl = this.formBuilder.group({
          destination: [{ value: null, disabled: this.locationCooperativeOptions().length <= 0 }, [Validators.required, Validators.minLength(3)]],
          cooperativeId: [{ value: '', disabled: this.locationCooperativeOptions().length <= 0 }, [Validators.required]]
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
