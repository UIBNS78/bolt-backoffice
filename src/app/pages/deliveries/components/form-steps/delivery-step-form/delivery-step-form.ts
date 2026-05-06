import { Component, EventEmitter, inject, Output, Signal, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputSelectOptions } from '@shared/components/types/input-select-options';
import { DeliveryMenService } from 'app/pages/delivery-men/delivery-men-service';
import { OwnersService } from 'app/pages/owners/owners-service';
import { deliveryStatusOptions as deliveryStatusOpt } from '@shared/constants/delivery';
import { format } from 'date-fns';
import { deliveryStatusObj } from '@shared/types/delivery';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { NgClass } from '@angular/common';
import { DeliveryForm } from 'app/pages/deliveries/types/delivery-form';

@Component({
  selector: 'app-delivery-step-form',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    FieldsetModule,
    MessageModule,
    SelectModule,
    InputNumberModule,
    InputTextModule,
    DatePickerModule,
    NgClass
  ],
  templateUrl: './delivery-step-form.html',
  styleUrl: './delivery-step-form.css',
})
export class DeliveryStepForm {
  // services
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  protected ownersService: OwnersService = inject(OwnersService);
  protected deliveryMenService: DeliveryMenService = inject(DeliveryMenService);

  // vars
  @Output() nextEmitter: EventEmitter<DeliveryForm> = new EventEmitter<DeliveryForm>();
  protected loading: WritableSignal<boolean> = signal(false);
  protected form: FormGroup = new FormGroup({});
  protected ownersOptions: Signal<InputSelectOptions[]> = this.ownersService.options;
  protected menOptions: Signal<InputSelectOptions[]> = this.deliveryMenService.options;
  protected deliveryStatusOptions: InputSelectOptions[] = deliveryStatusOpt;
  
  constructor() {
    this.form = this.formBuilder.group({
      name: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      ownerId: [null, [Validators.required, Validators.min(0)]],
      packageNumber: [{ value: 0, disabled: true }, [Validators.required, Validators.min(1)]],
      payment: [0, [Validators.required, Validators.min(0)]],
      deliveryManId: [null, [Validators.required, Validators.min(0)]],
      recuperationPlace: ["", [Validators.required]],
      collectDate: [format(new Date(), "dd MMMM yyyy"), [Validators.required]],
      deliveryDate: [format(new Date(), "dd MMMM yyyy"), [Validators.required]],
      status: [deliveryStatusObj.pending, [Validators.required, Validators.min(1), Validators.max(4)]]
    });
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.nextEmitter.emit(this.form.getRawValue() as DeliveryForm);
  }
}
