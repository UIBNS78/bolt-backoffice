import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { finalize, Subject, takeUntil } from 'rxjs';
import { DeliveryManSalary, DeliveryMenSalaryList } from '../../types/delivery-men-salary';
import { TableModule } from 'primeng/table';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ImageModule } from 'primeng/image';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { AvatarModule } from 'primeng/avatar';
import { CivilityPipe } from '@shared/pipes/civility-pipe';
import { DatePipe, NgClass, UpperCasePipe } from '@angular/common';
import { BigramPipe } from '@shared/pipes/bigram.pipe';
import { DeliveryManSalariesPlaceholder } from '../../components/placeholders/delivery-man-salaries-placeholder/delivery-man-salaries-placeholder';
import { DeliveryManSalariesForm } from '../../components/salary/delivery-man-salaries-form/delivery-man-salaries-form';
import { DialogService } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';
import { DurationPipe } from '@shared/pipes/duration-pipe';
import { DeliveryManSalaryHistory } from '../../components/salary/delivery-man-salary-history/delivery-man-salary-history';
import { DmSalariesService } from '../../services/dm-salaries-service';
import { isBefore, startOfMonth } from 'date-fns';

@Component({
  selector: 'app-delivery-man-salaries',
  imports: [
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TableModule,
    PaginatorModule,
    ImageModule,
    OverlayBadgeModule,
    AvatarModule,
    TooltipModule,
    CivilityPipe,
    UpperCasePipe,
    BigramPipe,
    DatePipe,
    DurationPipe,
    DeliveryManSalariesPlaceholder,
    NgClass,
    DeliveryManSalaryHistory
  ],
  templateUrl: './delivery-man-salaries.html',
  styleUrl: './delivery-man-salaries.css',
})
export class DeliveryManSalaries implements OnInit, OnDestroy {
  // services
  private readonly dmSalariesService: DmSalariesService = inject(DmSalariesService);
  private readonly dialogService: DialogService = inject(DialogService);

  // vars
  private readonly unsubscribe$: Subject<void> = new Subject<void>();
  protected first: WritableSignal<number> = signal(0);
  protected rows: WritableSignal<number> = signal(10);
  protected showForm: WritableSignal<boolean> = signal(false);
  protected showHistory: WritableSignal<boolean> = signal(false);
  protected selectedSalary: WritableSignal<DeliveryManSalary | null> = signal(null);
  protected isLoading: WritableSignal<boolean> = signal(false);
  protected data: WritableSignal<DeliveryMenSalaryList> = signal({
    salaries: [],
    totalItems: 0,
  });

  ngOnInit(): void {
    this.isLoading.set(true);
    this.loadData();
  }
  
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
    
  handleOpenForm(salary: DeliveryManSalary | null = null): void {
    const ref = this.dialogService.open(DeliveryManSalariesForm, {
      showHeader: false,
      data: {
        salary
      },
      width: '25rem'
    });

    ref?.onClose.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((refresh: boolean) => {
      if (refresh) {
        this.loadData();
      }
    });
  }

  onPageChange(event: PaginatorState) {
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? 10);
  }

  isApplied(applyAt: Date): boolean {
    return new Date(applyAt).getTime() < new Date().getTime();
  }

  isPastMonth(applyAt: Date): boolean {
    const startOfCurrentMonth = startOfMonth(new Date());
    return isBefore(applyAt, startOfCurrentMonth);
  }

  handleOpenHistory(salary: DeliveryManSalary | null = null): void {
    this.selectedSalary.set(salary);
    this.showHistory.set(!!salary);
  }

  private loadData(): void {
    this.dmSalariesService.getSalaries({ page: this.first() / this.rows() + 1, itemsPerPage: this.rows()}).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.isLoading.set(false))
    ).subscribe((response: DeliveryMenSalaryList) => {
      this.data.set(response);
    });
  }
}
