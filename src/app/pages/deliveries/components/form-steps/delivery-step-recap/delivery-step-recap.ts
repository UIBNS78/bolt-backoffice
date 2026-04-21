import { NgClass } from '@angular/common';
import { Component, EventEmitter, inject, input, InputSignal, Output, Signal } from '@angular/core';
import { CivilityPipe } from '@shared/pipes/civility-pipe';
import { PackageStatusIconPipe } from '@shared/pipes/package-pipes/package-status-icon-pipe';
import { PackageStatusPipe } from '@shared/pipes/package-pipes/package-status-pipe';
import { PackageStatusSeverityPipe } from '@shared/pipes/package-pipes/package-status-severity-pipe';
import { TodayYesterdayTomorrowPipe } from '@shared/pipes/today-yesterday.pipe';
import { DeliveryForm } from 'app/pages/deliveries/types/delivery-form';
import { DeliveryMenService } from 'app/pages/delivery-men/delivery-men-service';
import { DeliveryPricesService } from 'app/pages/delivery-prices/delivery-prices-service';
import { OwnersService } from 'app/pages/owners/owners-service';
import { NgxMaskPipe } from 'ngx-mask';
import { SelectItemGroup } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-delivery-step-recap',
  imports: [
    ButtonModule,
    FieldsetModule,
    TableModule,
    TagModule,
    CivilityPipe,
    NgxMaskPipe,
    TodayYesterdayTomorrowPipe,
    NgClass,
    PackageStatusPipe,
    PackageStatusSeverityPipe,
    PackageStatusIconPipe
  ],
  templateUrl: './delivery-step-recap.html',
  styleUrl: './delivery-step-recap.css',
})
export class DeliveryStepRecap {
  // services
  private readonly ownersService: OwnersService = inject(OwnersService);
  private readonly deliveryMenService: DeliveryMenService = inject(DeliveryMenService);
  private readonly deliveryPricesService: DeliveryPricesService = inject(DeliveryPricesService);
  
  // vars
  @Output() previousEmitter: EventEmitter<number> = new EventEmitter<number>();
  @Output() nextEmitter: EventEmitter<void> = new EventEmitter<void>();
  loading: InputSignal<boolean> = input<boolean>(false);
  data: InputSignal<DeliveryForm | null> = input<DeliveryForm | null>(null);
  protected locationCityOptions: Signal<SelectItemGroup[]> = this.deliveryPricesService.cityOptions;
  protected locationCooperativeOptions: Signal<SelectItemGroup[]> = this.deliveryPricesService.cooperativeOptions;

  handlePrevious(): void {
    this.previousEmitter.emit(2);
  }

  handleNext(): void {
    this.nextEmitter.emit();
  }

  getCommercialName(id: number): string {
    return this.ownersService.options().find(o => o.id === id)?.label ?? '';
  }

  getDeliveryManName(id: number): string {
    return this.deliveryMenService.options().find(o => o.id === id)?.label ?? '';
  }

  getPlaceName(id: number): string {
    return this.locationCityOptions().flatMap(lco => lco.items).find(i => i.value === id)?.label ?? '';
  }

  getCooperativeName(id: number): string {
    return this.locationCooperativeOptions().flatMap(lco => lco.items).find(i => i.value === id)?.label ?? ''; 
  }
}
