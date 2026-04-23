import { DatePipe, NgClass } from '@angular/common';
import { Component, computed, effect, EventEmitter, inject, OnDestroy, Output, Signal, signal, ViewChild, WritableSignal } from '@angular/core';
import { DeliveryStatusSeverityPipe } from '@shared/pipes/delivery-pipes/delivery-status-severity-pipe';
import { DeliveryStatusPipe } from '@shared/pipes/delivery-pipes/delivery-status.pipe';
import { TodayYesterdayTomorrowPipe } from '@shared/pipes/today-yesterday.pipe';
import { DeliveriesService } from 'app/pages/deliveries/deliveries-service';
import { DeliveryList } from 'app/pages/deliveries/types/delivery-list';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { debounceTime, distinctUntilChanged, finalize, Subject, takeUntil } from 'rxjs';
import { DeliveriesPlaceholder } from '../deliveries-placeholder/deliveries-placeholder';
import { CivilityPipe } from '@shared/pipes/civility-pipe';
import { Delivery, DeliveryByDate } from '@shared/types/delivery';
import { DeliveryStatusIconPipe } from '@shared/pipes/delivery-pipes/delivery-status-icon-pipe';
import { AvatarModule } from 'primeng/avatar';
import { BigramPipe } from '@shared/pipes/bigram.pipe';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { DatePickerModule } from 'primeng/datepicker';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Popover, PopoverModule } from 'primeng/popover';
import { format } from 'date-fns';
import { toSignal } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-deliveries-list',
  imports: [
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TagModule,
    DeliveryStatusPipe,
    DeliveryStatusIconPipe,
    DeliveryStatusSeverityPipe,
    NgClass,
    DividerModule,
    ButtonModule,
    TooltipModule,
    TodayYesterdayTomorrowPipe,
    DeliveriesPlaceholder,
    CivilityPipe,
    AvatarModule,
    BigramPipe,
    OverlayBadgeModule,
    DatePickerModule,
    FormsModule,
    PopoverModule,
    DatePipe,
    ReactiveFormsModule
  ],
  templateUrl: './deliveries-list.html',
  styleUrl: './deliveries-list.css',
})
export class DeliveriesList implements OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject<void>();

  // servives
  private readonly deliviverisService: DeliveriesService = inject(DeliveriesService);
  private readonly messageService: MessageService = inject(MessageService);
  private readonly router: Router = inject(Router);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  // vars
  @Output() onSelectEmitter: EventEmitter<Delivery> = new EventEmitter<Delivery>();
  @ViewChild("datepicker") datepicker!: Popover;
  protected today: Date = new Date();
  protected selectedDate: WritableSignal<Date> = signal(this.today);
  protected deliveryIdQueryParam: WritableSignal<number | null> = signal(null);
  protected showScroll: WritableSignal<boolean> = signal(false);
  protected selectedDelivery: WritableSignal<Delivery | null> = signal(null);
  protected first: WritableSignal<number> = signal(0);
  protected rows: WritableSignal<number> = signal(10);
  protected isLoading: WritableSignal<boolean> = signal(false);
  protected data: WritableSignal<DeliveryList> = signal({
    deliveries: [],
    totalItems: 0
  });
  protected searchControl: FormControl<string> = new FormControl({ value: "", disabled: true }, { nonNullable: true });
  protected searchValue: Signal<string> = toSignal(
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ),
    { initialValue: "" }
  );
  protected filteredData: Signal<DeliveryByDate[]> = computed(() => {
    if (this.searchValue() === "") return this.data().deliveries;

    return this.data().deliveries.map(group => ({
      ...group,
      deliveries: group.deliveries.filter(d => {
        return d.owner.name.toLowerCase().includes(this.searchValue().toLowerCase()) 
          || d.owner.firstName.toLowerCase().includes(this.searchValue().toLowerCase())
          || d.owner.commercialName.toLowerCase().includes(this.searchValue().toLowerCase())
          || d.deliveryMan.firstName.toLowerCase().includes(this.searchValue().toLowerCase())
          || d.recuperationPlace.toLowerCase().includes(this.searchValue().toLowerCase())
      })
    })).filter(group => group.deliveries.length > 0);
  });

  constructor() {
    effect(() => {
      const newData: DeliveryList = this.data();
      const newSelectedDelivery: Delivery | undefined = newData.deliveries.flatMap(d => d.deliveries).find(d => d.id === this.selectedDelivery()?.id);
      if (newSelectedDelivery) this.handleSelectDelivery(newSelectedDelivery);
    });

    effect(() => {
      this.loadData();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.deliviverisService.getDeliveriesByOwners({ 
      startDate: format(this.selectedDate(), "yyyy-MM-dd"), 
      endDate: format(this.selectedDate(), "yyyy-MM-dd") 
    }).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.isLoading.set(false))
    ).subscribe(response => {
      if (response.totalItems > 0) this.searchControl.enable();
      else this.searchControl.disable();
      
      this.data.set(response);
      if (this.deliveryIdQueryParam()) this.selectDeliveryWithId(this.deliveryIdQueryParam()!);
    });
  }

  handleSelectDelivery(delivery: Delivery): void {
    this.selectedDelivery.set(delivery);
    this.onSelectEmitter.emit(delivery);
  }
  
  handleSelectDate(date: Date): void {
    this.selectedDate.set(date);
    this.clearQueryParams();
    this.deliveryIdQueryParam.set(null);
    this.selectedDelivery.set(null);
    this.datepicker.hide();
  }

  onScroll(event: any) {
    this.showScroll.set(event.target.scrollTop > 200);
  }

  scrollToTop(container: HTMLElement) {
    container.scrollTo({ top: 0, behavior: 'smooth' });
  }

  public loadByQueryParams(deliveryId: number): void {
    this.isLoading.set(true);
    this.deliviverisService.getDeliveryByIdWithDate(deliveryId).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.isLoading.set(false))
    ).subscribe(response => {
      if (response) {
        this.selectedDate.set(new Date(response.date));
        this.deliveryIdQueryParam.set(deliveryId);
      } else {
        this.searchControl.disable();
        this.data.set({ deliveries: [], totalItems: 0 });
        this.deliveryIdQueryParam.set(null);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'La livraison demandée est introuvable.'
        });
      }
    })
  }

  private selectDeliveryWithId(deliveryId: number): void {
    const delivery = this.data().deliveries.flatMap(d => d.deliveries).find(d => d.id === deliveryId);
    if (delivery) this.handleSelectDelivery(delivery);
  }

  private clearQueryParams() {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {},
      replaceUrl: true
    });
  }
}
