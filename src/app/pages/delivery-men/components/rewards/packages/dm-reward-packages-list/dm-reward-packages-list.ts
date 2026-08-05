import { UpperCasePipe } from '@angular/common';
import { Component, computed, effect, inject, OnDestroy, Signal, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BigramPipe } from '@shared/pipes/bigram.pipe';
import { CivilityPipe } from '@shared/pipes/civility-pipe';
import { FilterDateWithMode } from '@shared/types/common';
import { DeliveryMenRewardsListPlaceholder } from 'app/pages/delivery-men/components/placeholders/delivery-men-rewards-list-placeholder/delivery-men-rewards-list-placeholder';
import { DmRewardPackagesService } from 'app/pages/delivery-men/services/dm-reward-packages-service';
import { DMRewardPackagesList as DMRewardPackagesListType } from 'app/pages/delivery-men/types/delivery-men-reward-package';
import { endOfWeek, format, isThisMonth, isThisWeek, isThisYear, isToday, startOfWeek } from 'date-fns';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { IconFieldModule } from 'primeng/iconfield';
import { ImageModule } from 'primeng/image';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Popover, PopoverModule } from 'primeng/popover';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dm-reward-packages-list',
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
    PaginatorModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    BigramPipe,
    UpperCasePipe,
    CivilityPipe,
    DeliveryMenRewardsListPlaceholder
  ],
  templateUrl: './dm-reward-packages-list.html',
  styleUrl: './dm-reward-packages-list.css',
})
export class DmRewardPackagesList implements OnDestroy {
  // services
  private readonly dmRewardPackagesService: DmRewardPackagesService = inject(DmRewardPackagesService);

  // vars
  private readonly unsubscribe$: Subject<void> = new Subject<void>();
  @ViewChild("datepicker") datepicker!: Popover;
  protected today: Date = new Date();
  protected first: WritableSignal<number> = signal(0);
  protected rows: WritableSignal<number> = signal(10);
  protected selectedDate: WritableSignal<Date> = signal(this.today);
  protected isLoading: WritableSignal<boolean> = signal(false);
  protected data: WritableSignal<DMRewardPackagesListType> = signal({
    deliveryMenRewards: [],
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
    this.dmRewardPackagesService.getDmRewardPackages(this.filter()).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.isLoading.set(false))
    ).subscribe(response => {
      this.data.set(response);
    });
  }
}
