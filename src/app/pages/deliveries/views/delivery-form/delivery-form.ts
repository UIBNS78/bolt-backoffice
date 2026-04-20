import { Component, inject, OnDestroy, OnInit, Signal, signal, viewChild, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Stepper, StepperModule } from 'primeng/stepper';
import { NgClass } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputSelectOptions } from '@shared/components/types/input-select-options';
import { Subject } from 'rxjs';
import { MessageService, SelectItemGroup } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { packageTypeOptions as packageTypeOpt } from '@shared/constants/package';
import { packageStatusOptions as packageStatusOpt } from '@shared/constants/package';
import { genderOptions as genderOpts } from '@shared/constants/user';
import { PackageForm, PackageType, packageTypeObj } from '@shared/types/package';
import { DeliveryPricesService } from 'app/pages/delivery-prices/delivery-prices-service';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DeliveryStepForm } from '../../components/delivery/delivery-step-form/delivery-step-form';
import { DeliveryForm as DeliveryFormType } from '../../types/delivery-form';
import { PackageStepForm } from '../../components/package/package-step-form/package-step-form';

@Component({
  selector: 'app-delivery-form',
  imports: [
    RouterLink,
    ButtonModule,
    TooltipModule,
    StepperModule,
    NgClass,
    TableModule,
    ToggleSwitchModule,
    DeliveryStepForm,
    PackageStepForm
  ],
  templateUrl: './delivery-form.html',
  styleUrl: './delivery-form.css',
})
export class DeliveryForm implements OnInit, OnDestroy {
  // services
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  protected deliveryPricesService: DeliveryPricesService = inject(DeliveryPricesService);
  protected messageService: MessageService = inject(MessageService);

  // vars
  private unsubscribe$: Subject<void> = new Subject<void>();
  protected stepper: Signal<Stepper | undefined> = viewChild(Stepper);
  protected form: FormGroup = new FormGroup({});
  protected loading: WritableSignal<boolean> = signal(false);
  protected activeStep: WritableSignal<number> = signal(1);
  protected genderOptions: { value: string; label: string }[] = genderOpts;
  protected packageTypeOptions: InputSelectOptions[] = packageTypeOpt;
  protected packageStatusOptions: InputSelectOptions[] = packageStatusOpt;
  protected packageTypeSignal: WritableSignal<PackageType> = signal(packageTypeObj.inCity);
  protected locationCityOptions: WritableSignal<SelectItemGroup[]> = signal([]);
  protected locationCooperativeOptions: WritableSignal<SelectItemGroup[]> = signal([]);

  constructor() {
    this.form = this.formBuilder.group({
      packages: this.formBuilder.array([], [Validators.required, Validators.min(1)]),
    });
  }
  
  get packagesForm() {
    return this.form.get("packages") as FormArray;
  }
  
  ngOnInit(): void {
    this.loading.set(true);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  handleNextDelivery(delivery: DeliveryFormType): void {
    // add delivery value
    console.log("=====>", delivery);

    this.handleStepChange(2);
  }

  handleNextPackages(packages: PackageForm): void {
    // add packages value
    console.log("=====>", packages);

    this.handleStepChange(3);
  }
  
  handleStepChange(event: number | undefined): void {
    this.activeStep.set(event ?? 1);
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log(this.form.getRawValue());
  }
}
