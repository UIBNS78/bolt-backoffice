import { Component, computed, EventEmitter, inject, Input, OnDestroy, Output, Signal, signal, WritableSignal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DrawerModule } from 'primeng/drawer';
import { DeliveryPricesService } from '../../../delivery-prices-service';
import { MessageService } from 'primeng/api';
import { finalize, first, Subject, takeUntil } from 'rxjs';
import { deliveryLocationOptions as dlOptions, type DeliveryPriceProvince, type DeliveryPricePlace, DeliveryPriceProvinceUpdateForm } from '@shared/types/delivery-price';
import { InputSelectOptions } from '@shared/components/types/input-select-options';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ChipModule } from 'primeng/chip';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-delivery-price-cooperative-form',
  imports: [
    DrawerModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    MessageModule,
    InputNumberModule,
    InputTextModule,
    ChipModule
  ],
  templateUrl: './delivery-price-cooperative-form.html',
  styleUrl: './delivery-price-cooperative-form.css',
})
export class DeliveryPriceCooperativeForm implements OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();
  private _defaultCooperatives: DeliveryPricePlace[] = [];
  private _cooperativesToAdd: DeliveryPricePlace[] = [];
  private _cooperativesToRemove: number[] = [];
  
  // services
  protected formBuilder: FormBuilder = inject(FormBuilder);
  protected deliveryPricesService: DeliveryPricesService = inject(DeliveryPricesService);
  protected messageService: MessageService = inject(MessageService);
  protected deliveryLocationOptions: InputSelectOptions[] = dlOptions;
  
  // form
  private _form: FormGroup = this.formBuilder.group({
    id: [null],
    location: [{ value: 1, disabled: true }, [Validators.required, Validators.min(1), Validators.max(3)]],
    price: [{ value: 0, disabled: true }, [Validators.required, Validators.pattern("[0-9]*"), Validators.min(0)]],
    promotion: [{ value: 0, disabled: true }, [Validators.required, Validators.pattern("[0-9]*"), Validators.min(0)]],
    cooperatives: ["", [Validators.maxLength(524288)]]
  });

  // vars
  protected cooperatives: WritableSignal<DeliveryPricePlace[]> = signal([]);
  protected loading: WritableSignal<boolean> = signal(false);
  protected cooperativesSignal: Signal<string> = toSignal(this.form.get("cooperatives")!.valueChanges, { initialValue: this.form.get("cooperatives")?.value ?? "" });
  
  @Output() onCloseEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Input() open: boolean = false;
  @Input() 
  set deliveryPrice(data: Partial<DeliveryPriceProvince> | undefined) {
    if (!data) {
      this.form.reset();
      return;
    }

    // const places: string = ((data?.places ?? [])).map(p => p.name).join("; ") ?? "";    
    this._form.patchValue({
      id: data.id ?? null,
      location: data.id ?? 1,
      price: data.price ?? 0,
      promotion: data.promotion ?? 0,
      cooperatives: ""
    });
    
    this._defaultCooperatives = data?.cooperatives ?? [];
    this.cooperatives.set(data?.cooperatives ?? []);
  }
  get form(): FormGroup {
    return this._form;
  }

  protected cooperativesComputed: Signal<DeliveryPricePlace[]> = computed(() => {
    const currentValue: DeliveryPricePlace[] = this.cooperativesSignal()?.split(";").filter(v => v.trim() !== "").map(v => ({ id: Math.random(), name: v.trim() })) ?? [];
    this._cooperativesToAdd = currentValue;
    return [
      ...this._defaultCooperatives,
      ...currentValue
    ];
  });

  constructor() {
    effect(() => {
      this.cooperatives.set(this.cooperativesComputed());
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const rawValue: DeliveryPriceProvince = this.form.getRawValue() as DeliveryPriceProvince;

    this.deliveryPricesService.updateCooperative(
      {
        id: rawValue.id,
        location: rawValue.location,
        price: rawValue.price,
        promotion: rawValue.promotion,
        cooperativesToAdd: this._cooperativesToAdd.map(pta => pta.name),
        cooperativesToRemove: this._cooperativesToRemove
      } as unknown as DeliveryPriceProvinceUpdateForm
    ).pipe(
      first(),
      takeUntil(this.unsubscribe$),
      finalize(() => this.loading.set(false))
    ).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Mise à jour réussie',
        detail: 'L\'emplacement a été mis à jour avec succès.'
      });
      this.handleClose();
    });
  }

  removePlace(cooperativeId: number): void {
    const isInDefaultCooperative: boolean = !!this._defaultCooperatives.find(dc => dc.id === cooperativeId);
    const isInCooperativeToAdd: boolean = !!this._cooperativesToAdd.find(cta => cta.id === cooperativeId);
    if (isInDefaultCooperative) {
      this._cooperativesToRemove = [
        ...this._cooperativesToRemove,
        cooperativeId
      ];
      const newDefaultCooperatives: DeliveryPricePlace[] = this._defaultCooperatives.filter(dc => dc.id !== cooperativeId);
      this._defaultCooperatives = newDefaultCooperatives;
      this.cooperatives.update(prev => prev.filter(c => c.id !== cooperativeId));
    } else if (isInCooperativeToAdd) {
      const cooperativeToAddFiltered: DeliveryPricePlace[] = this._cooperativesToAdd.filter(cta => cta.id !== cooperativeId);
      const item: DeliveryPricePlace | undefined = this.cooperatives().find(c => c.id === cooperativeId);
      if (item) {
        const currentCooperativesFiltered: string = (this.form.get("cooperatives")?.value ?? "").split(";").filter((v: string, i: number) => v.trim() !== "" && v.trim() !== item.name).join(";");
        this.form.get("cooperatives")?.setValue(currentCooperativesFiltered, { emitEvent: false });
        this._cooperativesToAdd = cooperativeToAddFiltered;
        this.cooperatives.set([
          ...this._defaultCooperatives,
          ...cooperativeToAddFiltered
        ]);
      }
    }
  }

  handleClose(): void {
    this.form.reset();
    this.onCloseEmitter.emit();
  }
}
