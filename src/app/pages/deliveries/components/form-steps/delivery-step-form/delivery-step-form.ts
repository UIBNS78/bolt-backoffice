import { Component, EventEmitter, inject, OnDestroy, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputSelectOptions } from '@shared/components/types/input-select-options';
import { DeliveryMenService } from 'app/pages/delivery-men/delivery-men-service';
import { OwnersService } from 'app/pages/owners/owners-service';
import { combineLatest, finalize, Subject, takeUntil } from 'rxjs';
import { deliveryStatusOptions as deliveryStatusOpt } from '@shared/constants/delivery';
import { GENDER } from '@shared/types/user';
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
export class DeliveryStepForm implements OnInit, OnDestroy {
  // services
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  protected ownersService: OwnersService = inject(OwnersService);
  protected deliveryMenService: DeliveryMenService = inject(DeliveryMenService);

  // vars
  @Output() nextEmitter: EventEmitter<DeliveryForm> = new EventEmitter<DeliveryForm>();
  private unsubscribe$: Subject<void> = new Subject<void>();
  protected loading: WritableSignal<boolean> = signal(false);
  protected form: FormGroup = new FormGroup({});
  protected ownersOptions: WritableSignal<InputSelectOptions[]> = signal([]);
  protected menOptions: WritableSignal<InputSelectOptions[]> = signal([]);
  protected deliveryStatusOptions: InputSelectOptions[] = deliveryStatusOpt;
  
  constructor() {
    this.form = this.formBuilder.group({
      name: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      ownerId: [{ value: null, disabled: true }, [Validators.required, Validators.min(0)]],
      recuperationPlace: ["", [Validators.required]],
      packageNumber: [{ value: 0, disabled: true }, [Validators.required, Validators.min(1)]],
      payment: [0, [Validators.required, Validators.min(0)]],
      deliveryManId: [{ value: null, disabled: true }, [Validators.required, Validators.min(0)]],
      deliveryDate: [format(new Date(), "dd MMMM yyyy"), [Validators.required]],
      status: [deliveryStatusObj.pending, [Validators.required, Validators.min(1), Validators.max(4)]]
    });
  }
  
  ngOnInit(): void {
    this.loading.set(true);
    this.loadOptions();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  
  loadOptions(): void {
    combineLatest([
      this.ownersService.getAllAsOptions(),
      this.deliveryMenService.getAllAsOptions()
    ]).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.loading.set(false))
    ).subscribe(([ownerOpt, menOpt]) => {
      this.ownersOptions.set(ownerOpt.map(o => ({ id: o.id, label: o.commercialName })));
      this.menOptions.set(menOpt.map(m => ({ id: m.id, label: `${m.gender === GENDER.WOMAN ? "Mme" : "Mr"} ${m.firstName}` })));
      this.form.get('ownerId')?.enable();
      this.form.get('deliveryManId')?.enable();
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
