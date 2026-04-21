import { Component, inject, OnDestroy, Signal, signal, viewChild, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Stepper, StepperModule } from 'primeng/stepper';
import { NgClass } from '@angular/common';
import { InputSelectOptions } from '@shared/components/types/input-select-options';
import { Subject } from 'rxjs';
import { MessageService, SelectItemGroup } from 'primeng/api';
import { packageTypeOptions as packageTypeOpt } from '@shared/constants/package';
import { packageStatusOptions as packageStatusOpt } from '@shared/constants/package';
import { genderOptions as genderOpts } from '@shared/constants/user';
import { PackageForm, PackageType, packageTypeObj } from '@shared/types/package';
import { DeliveryPricesService } from 'app/pages/delivery-prices/delivery-prices-service';
import { DeliveryStepForm } from '../../components/delivery/delivery-step-form/delivery-step-form';
import { DeliveryForm as DeliveryFormType } from '../../types/delivery-form';
import { PackageStepForm } from '../../components/package/package-step-form/package-step-form';

@Component({
  selector: 'app-delivery-form',
  imports: [
    RouterLink,
    ButtonModule,
    StepperModule,
    NgClass,
    DeliveryStepForm,
    PackageStepForm
  ],
  templateUrl: './delivery-form.html',
  styleUrl: './delivery-form.css',
})
export class DeliveryForm implements OnDestroy {
  // services
  protected deliveryPricesService: DeliveryPricesService = inject(DeliveryPricesService);
  protected messageService: MessageService = inject(MessageService);

  // vars
  private unsubscribe$: Subject<void> = new Subject<void>();
  protected stepper: Signal<Stepper | undefined> = viewChild(Stepper);
  protected loading: WritableSignal<boolean> = signal(false);
  protected activeStep: WritableSignal<number> = signal(1);
  protected genderOptions: { value: string; label: string }[] = genderOpts;
  protected packageTypeOptions: InputSelectOptions[] = packageTypeOpt;
  protected packageStatusOptions: InputSelectOptions[] = packageStatusOpt;
  protected packageTypeSignal: WritableSignal<PackageType> = signal(packageTypeObj.inCity);
  protected locationCityOptions: WritableSignal<SelectItemGroup[]> = signal([]);
  protected locationCooperativeOptions: WritableSignal<SelectItemGroup[]> = signal([]);
  protected data: WritableSignal<DeliveryFormType | null> = signal(null);

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  handleNextDelivery(delivery: DeliveryFormType): void {
    this.data.set(delivery);

    this.handleStepChange(2);
  }

  handleNextPackages(packages: PackageForm[]): void {
    this.data.update(d => {
      d!.packages = packages;
      d!.packageNumber = packages.length;
      return d!;
    });

    this.handleStepChange(3);
  }
  
  handleStepChange(event: number | undefined): void {
    this.activeStep.set(event ?? 1);
  }

  handleSubmit(): void {
    if (!this.data()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez créer une livraison avant de continuer'
      });

      return;
    }

    if (this.data()!.packages.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez ajouter au moins un colis avant de continuer'
      });

      return;
    }

    console.log(this.data());
  }
}
