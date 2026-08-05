import { NgClass, UpperCasePipe } from '@angular/common';
import { Component, computed, effect, inject, OnDestroy, Signal, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BigramPipe } from '@shared/pipes/bigram.pipe';
import { CivilityPipe } from '@shared/pipes/civility-pipe';
import { FilterDateWithMode } from '@shared/types/common';
import { DmRewardRatesService } from 'app/pages/delivery-men/services/dm-reward-rates-service';
import { DMRewardRatesList } from 'app/pages/delivery-men/types/delivery-men-reward-rate';
import { endOfWeek, format, isThisMonth, isThisWeek, isThisYear, isToday, startOfWeek } from 'date-fns';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { ImageModule } from 'primeng/image';
import { MenuModule } from 'primeng/menu';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Popover, PopoverModule } from 'primeng/popover';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { finalize, Subject, takeUntil } from 'rxjs';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { DmRewardRatesPlaceholder } from '../../components/placeholders/dm-reward-rates-placeholder/dm-reward-rates-placeholder';
import { DmRewardRatesHandler } from '../../components/rewards/rates/dm-reward-rates-handler/dm-reward-rates-handler';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-delivery-man-rates',
  imports: [
    FormsModule,
    TableModule,
    ImageModule,
    AvatarModule,
    OverlayBadgeModule,
    PopoverModule,
    DatePickerModule,
    ButtonModule,
    MenuModule,
    TagModule,
    RatingModule,
    PaginatorModule,
    TooltipModule,
    DividerModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    BigramPipe,
    UpperCasePipe,
    CivilityPipe,
    NgClass,
    DmRewardRatesHandler,
    DmRewardRatesPlaceholder
  ],
  templateUrl: './delivery-man-rates.html',
  styleUrl: './delivery-man-rates.css',
})
export class DeliveryManRates implements OnDestroy {
  // services
  private readonly dmRewardRatesService: DmRewardRatesService = inject(DmRewardRatesService);

  // vars
  private readonly unsubscribe$: Subject<void> = new Subject<void>();
  @ViewChild("datepicker") datepicker!: Popover;
  protected today: Date = new Date();
  protected first: WritableSignal<number> = signal(0);
  protected rows: WritableSignal<number> = signal(10);
  protected selectedDate: WritableSignal<Date> = signal(this.today);
  protected isLoading: WritableSignal<boolean> = signal(false);
  protected isRefreshing: WritableSignal<boolean> = signal(false);
  protected data: WritableSignal<DMRewardRatesList> = signal({
    dmRewardRates: [],
    totalItems: 0
  });
  protected filterLabel: Signal<string> = computed(() => {
    switch (this.filter().filter) {
      case "day":
        return isToday(this.filter().date) ? "Aujourd'hui" : "Jour";
      case "week":
        return isThisWeek(this.filter().date) ? "Cette semaine" : "Semaine";
      case "month":
        return isThisMonth(this.filter().date) ? "Ce mois" : "Mois";
      case "year":
        return isThisYear(this.filter().date) ? "Cette année" : "Année";
      default:
        return "Mois";
    }
  });
  protected filterDateLabel: Signal<string> = computed(() => {
    const date: Date = this.filter().date;
    switch (this.filter().filter) {
      case "day":
        return format(date, "dd MMM yyyy");
      case "week":
        const monday: Date = startOfWeek(date, { weekStartsOn: 1 });
        const sunday: Date = endOfWeek(date, { weekStartsOn: 1 });
        return `${format(monday, "dd MMM")} - ${format(sunday, "dd MMM yyyy")}`;
      case "month":
        return format(date, "MMMM yyyy");
      case "year":
        return `${date.getFullYear()}`;
      default:
        return format(date, "dd MMM yyyy");
    }
  });
  protected filter: WritableSignal<FilterDateWithMode> = signal({
    filter: "month",
    date: new Date()
  });    
  protected filterItems: MenuItem[] = [
    {
      label: "Filtres",
      items: [
        { 
          label: 'Jour',
          icon: 'pi pi-calendar-times',
          command: () => this.handleSelectFilter("day")
        },
        { 
          label: 'Semaine',
          icon: 'pi pi-calendar',
          command: () => this.handleSelectFilter("week")
        },
        { 
          label: 'Mois',
          icon: 'pi pi-calendar-times',
          command: () => this.handleSelectFilter("month")
        },
        { 
          label: 'Année',
          icon: 'pi pi-calendar',
          command: () => this.handleSelectFilter("year")
        },
      ]
    },
  ];
  
  constructor() {
    effect(() => {
      this.loadData();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  handleRefresh(): void {
    this.isRefreshing.set(true);
    this.loadData();
  }
  
  handleSelectFilter(filter: FilterDateWithMode['filter']): void {
    this.filter.update(prev => ({
      filter,
      date: prev.date
    }));
  }
  
  handleSelectDate(date: Date): void {
    this.selectedDate.set(date);
    this.datepicker.hide();
    this.filter.update(prev => ({
      filter: prev.filter,
      date
    }));
  }

  onPageChange(event: PaginatorState) {
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? 10);
  }

  private loadData(): void {
    this.isLoading.set(true);
    this.dmRewardRatesService.getDmRewardRates(this.filter()).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.isLoading.set(false);
        this.isRefreshing.set(false);
      })
    ).subscribe(response => {
      this.data.set(response);
    });
  }
}