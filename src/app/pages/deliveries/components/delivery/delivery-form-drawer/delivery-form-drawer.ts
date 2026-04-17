import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DrawerModule } from 'primeng/drawer';
import { DeliveriesService } from '../../../deliveries-service';
import { MessageService } from 'primeng/api';
import { combineLatest, finalize, Subject, takeUntil } from 'rxjs';
import { Delivery } from '@shared/types/delivery';
import { OwnersService } from 'app/pages/owners/owners-service';
import { DeliveryMenService } from 'app/pages/delivery-men/delivery-men-service';
import { InputSelectOptions } from '@shared/components/types/input-select-options';
import { GENDER } from '@shared/types/user';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { deliveryStatusOptions as deliveryStatusOpt } from '@shared/constants/delivery';
import { NgClass } from '@angular/common';
import { format } from 'date-fns';
import { InputTextModule } from 'primeng/inputtext';
import { DeliveryDrawerForm } from '../../../types/delivery-drawer-form';

@Component({
  selector: 'app-delivery-form-drawer',
  imports: [
    DrawerModule,
    ButtonModule,
    ReactiveFormsModule,
    FieldsetModule,
    MessageModule,
    SelectModule,
    InputNumberModule,
    InputTextModule,
    DatePickerModule,
    NgClass
  ],
  templateUrl: './delivery-form-drawer.html',
  styleUrl: './delivery-form-drawer.css',
})
export class DeliveryFormDrawer implements OnInit, OnDestroy {
  // services
  private formBuilder: FormBuilder = inject(FormBuilder);
  protected deliveriesService: DeliveriesService = inject(DeliveriesService);
  protected ownersService: OwnersService = inject(OwnersService);
  protected deliveryMenService: DeliveryMenService = inject(DeliveryMenService);
  protected messageService: MessageService = inject(MessageService);

  // vars
  private unsubscribe$: Subject<void> = new Subject<void>();
  private _form: FormGroup = this.formBuilder.group({
    id: null,
    name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    ownerId: [{ value: null, disabled: true }, [Validators.required, Validators.min(0)]],
    recuperationPlace: [null, [Validators.required]],
    packageNumber: [{ value: null, disabled: true }, [Validators.required, Validators.min(1)]],
    payment: [null, [Validators.required, Validators.min(0)]],
    deliveryManId: [{ value: null, disabled: true }, [Validators.required, Validators.min(0)]],
    deliveryDate: [null, [Validators.required]],
    status: [null, [Validators.required, Validators.min(1), Validators.max(4)]]
  });
  private _initialValues: WritableSignal<Delivery | null> = signal(null);
  protected loading: WritableSignal<boolean> = signal(false);
  protected ownersOptions: WritableSignal<InputSelectOptions[]> = signal([]);
  protected menOptions: WritableSignal<InputSelectOptions[]> = signal([]);
  protected deliveryStatusOptions: InputSelectOptions[] = deliveryStatusOpt;

  @Output() onCloseEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() open: boolean = false;
  @Input()
  set delivery(data: Delivery | null) {
    if (!data) {
      return;
    }

    this._form.patchValue({
      id: data.id,
      name: data.name,
      ownerId: data.owner.id,
      recuperationPlace: data.recuperationPlace,
      packageNumber: data.packageNumber,
      payment: data.payment,
      deliveryManId: data.deliveryMan.id,
      deliveryDate: format(data.deliveryDate, "dd MMMM yyyy"),
      status: data.status
    });

    this._initialValues.set(this._form.getRawValue());
  };
  get form(): FormGroup {
    return this._form;
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

    this.loading.set(true);
    this.deliveriesService.update({
      ...this.form.getRawValue(),
      deliveryDate: new Date(this.form.get('deliveryDate')!.value + ' 12:00:00')
    } as DeliveryDrawerForm).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.loading.set(false))
    ).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'La livraison a été mise à jour avec succès'
      })
      
      this.handleClose();
    });
  }
  
  handleClose(isCancel: boolean = false): void {
    this.form.reset(this._initialValues());
    this.onCloseEmitter.emit(isCancel);
  }
}
