import { Component, computed, EventEmitter, inject, Input, OnDestroy, Output, Signal, signal, WritableSignal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DrawerModule } from 'primeng/drawer';
import { DeliveryPricesService } from '../../../delivery-prices-service';
import { MessageService } from 'primeng/api';
import { finalize, first, Subject, takeUntil } from 'rxjs';
import { DeliveryPriceCityUpdateForm, deliveryLocationOptions as dlOptions, type DeliveryPriceCity, type DeliveryPricePlace } from '@shared/types/delivery-price';
import { InputSelectOptions } from '@shared/components/types/input-select-options';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ChipModule } from 'primeng/chip';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-delivery-price-city-form',
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
  templateUrl: './delivery-price-city-form.html',
  styleUrl: './delivery-price-city-form.css',
})
export class DeliveryPriceCityForm implements OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();
  private _defaultPlaces: DeliveryPricePlace[] = [];
  private _placesToAdd: DeliveryPricePlace[] = [];
  private _placesToRemove: number[] = [];
  
  // services
  protected formBuilder: FormBuilder = inject(FormBuilder);
  protected deliveryPricesService: DeliveryPricesService = inject(DeliveryPricesService);
  protected messageService: MessageService = inject(MessageService);
  protected deliveryLocationOptions: InputSelectOptions[] = dlOptions;
  
  // form
  private _form: FormGroup = this.formBuilder.group({
    id: [null],
    location: [{ value: 1, disabled: true }, [Validators.required, Validators.min(1), Validators.max(3)]],
    price: [0, [Validators.required, Validators.pattern("[0-9]*"), Validators.min(0)]],
    promotion: [0, [Validators.required, Validators.pattern("[0-9]*"), Validators.min(0)]],
    places: ["", [Validators.maxLength(524288)]]
  });

  // vars
  protected places: WritableSignal<DeliveryPricePlace[]> = signal([]);
  protected loading: WritableSignal<boolean> = signal(false);
  protected placesSignal: Signal<string> = toSignal(this.form.get("places")!.valueChanges, { initialValue: this.form.get("places")?.value ?? "" });
  
  @Output() onCloseEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Input() open: boolean = false;
  @Input() 
  set deliveryPrice(data: Partial<DeliveryPriceCity> | undefined) {
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
      places: ""
    });
    
    this._defaultPlaces = data?.places ?? [];
    this.places.set(data?.places ?? []);
  }
  get form(): FormGroup {
    return this._form;
  }

  protected placesComputed: Signal<DeliveryPricePlace[]> = computed(() => {
    const currentValue: DeliveryPricePlace[] = this.placesSignal()?.split(";").filter(v => v.trim() !== "").map(v => ({ id: Math.random(), name: v.trim() })) ?? [];
    this._placesToAdd = currentValue;
    return [
      ...this._defaultPlaces,
      ...currentValue
    ];
  });

  constructor() {
    effect(() => {
      this.places.set(this.placesComputed());
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
    const rawValue: DeliveryPriceCity = this.form.getRawValue() as DeliveryPriceCity;

    this.deliveryPricesService.update(
      {
        id: rawValue.id,
        location: rawValue.location,
        price: rawValue.price,
        promotion: rawValue.promotion,
        placesToAdd: this._placesToAdd.map(pta => pta.name),
        placesToRemove: this._placesToRemove
      } as unknown as DeliveryPriceCityUpdateForm
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

  removePlace(placeId: number): void {
    const isInDefaultPlace: boolean = !!this._defaultPlaces.find(dp => dp.id === placeId);
    const isInPlaceToAdd: boolean = !!this._placesToAdd.find(pta => pta.id === placeId);
    if (isInDefaultPlace) {
      this._placesToRemove = [
        ...this._placesToRemove,
        placeId
      ];
      const newDefaultPlaces: DeliveryPricePlace[] = this._defaultPlaces.filter(dp => dp.id !== placeId);
      this._defaultPlaces = newDefaultPlaces;
      this.places.update(prev => prev.filter(p => p.id !== placeId));
    } else if (isInPlaceToAdd) {
      const placeToAddFiltered: DeliveryPricePlace[] = this._placesToAdd.filter(pta => pta.id !== placeId);
      const item: DeliveryPricePlace | undefined = this.places().find(p => p.id === placeId);
      if (item) {
        const currentPlacesFiltered: string = (this.form.get("places")?.value ?? "").split(";").filter((v: string, i: number) => v.trim() !== "" && v.trim() !== item.name).join(";");
        this.form.get("places")?.setValue(currentPlacesFiltered, { emitEvent: false });
        this._placesToAdd = placeToAddFiltered;
        this.places.set([
          ...this._defaultPlaces,
          ...placeToAddFiltered
        ]);
      }
    }
  }

  handleClose(): void {
    this.form.reset();
    this.onCloseEmitter.emit();
  }
}
