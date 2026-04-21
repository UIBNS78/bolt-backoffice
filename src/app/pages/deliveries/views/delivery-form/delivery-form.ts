import { Component, inject, OnDestroy, Signal, signal, viewChild, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Stepper, StepperModule } from 'primeng/stepper';
import { NgClass } from '@angular/common';
import { InputSelectOptions } from '@shared/components/types/input-select-options';
import { finalize, Subject, takeUntil } from 'rxjs';
import { MessageService, SelectItemGroup } from 'primeng/api';
import { packageTypeOptions as packageTypeOpt } from '@shared/constants/package';
import { packageStatusOptions as packageStatusOpt } from '@shared/constants/package';
import { genderOptions as genderOpts } from '@shared/constants/user';
import { PackageForm, PackageType, packageTypeObj } from '@shared/types/package';
import { DeliveryStepForm } from '../../components/form-steps/delivery-step-form/delivery-step-form';
import { DeliveryForm as DeliveryFormType } from '../../types/delivery-form';
import { PackageStepForm } from '../../components/form-steps/package-step-form/package-step-form';
import { DeliveriesService } from '../../deliveries-service';
import { DeliveryStepRecap } from '../../components/form-steps/delivery-step-recap/delivery-step-recap';

@Component({
  selector: 'app-delivery-form',
  imports: [
    RouterLink,
    ButtonModule,
    StepperModule,
    NgClass,
    DeliveryStepForm,
    PackageStepForm,
    DeliveryStepRecap
  ],
  templateUrl: './delivery-form.html',
  styleUrl: './delivery-form.css',
})
export class DeliveryForm implements OnDestroy {
  // services
  private readonly deliveriesService: DeliveriesService = inject(DeliveriesService);
  private readonly messageService: MessageService = inject(MessageService);
  private readonly router: Router = inject(Router);

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

    this.loading.set(true);
    this.deliveriesService.create(this.data()!).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.loading.set(false))
    ).subscribe(({ deliveryId }) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Création réussie',
        detail: 'La livraison a été créée avec succès.'
      });

      this.data.set(null);
      // this.router.navigate(['/deliveries/list', deliveryId]);
    });
  }
}
