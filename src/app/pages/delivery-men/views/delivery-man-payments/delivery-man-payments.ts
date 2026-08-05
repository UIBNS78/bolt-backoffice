import { Component, computed, effect, inject, OnDestroy, Signal, signal, ViewChild, WritableSignal } from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Popover, PopoverModule } from 'primeng/popover';
import { finalize, Subject, takeUntil } from 'rxjs';
import { DMPaymentsList, UpdatePaymentStatusType } from '../../types/delivery-men-payments';
import { format } from 'date-fns';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { DmPaymentsService } from '../../services/dm-payments-service';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ImageModule } from 'primeng/image';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { CivilityPipe } from '@shared/pipes/civility-pipe';
import { TagModule } from 'primeng/tag';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { BigramPipe } from '@shared/pipes/bigram.pipe';
import { AriaryPipe } from '@shared/pipes/ariary-pipe';
import { PaymentModePipe } from '@shared/pipes/payment-pipes/payment-mode-pipe';
import { DmPaymentsPlaceholder } from '../../components/placeholders/dm-payments-placeholder/dm-payments-placeholder';
import { DmPaymentsStatusEditable } from '../../components/payments/dm-payments-status-editable/dm-payments-status-editable';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-delivery-man-payments',
  imports: [
    FormsModule,
    DatePickerModule,
    TableModule,
    ButtonModule,
    PopoverModule,
    PaginatorModule,
    AvatarModule,
    ImageModule,
    OverlayBadgeModule,
    TagModule,
    BigramPipe,
    UpperCasePipe,
    CivilityPipe,
    DatePipe,
    PaymentModePipe,
    AriaryPipe,
    DmPaymentsPlaceholder,
    DmPaymentsStatusEditable
  ],
  templateUrl: './delivery-man-payments.html',
  styleUrl: './delivery-man-payments.css',
})
export class DeliveryManPayments implements OnDestroy {
  // services
  private readonly dmPaymentsService: DmPaymentsService = inject(DmPaymentsService);
  private readonly messageService: MessageService = inject(MessageService);

  // vars
  private readonly unsubscribe$: Subject<void> = new Subject<void>();
  @ViewChild("datepicker") datepicker!: Popover;
  protected today: Date = new Date();
  protected first: WritableSignal<number> = signal(0);
  protected rows: WritableSignal<number> = signal(10);
  protected selectedDate: WritableSignal<Date> = signal(this.today);
  protected isLoading: WritableSignal<boolean> = signal(false);
  protected isFiltering: WritableSignal<boolean> = signal(false);
  protected data: WritableSignal<DMPaymentsList> = signal({
    payments: [],
    totalItems: 0
  });
  protected filterDateLabel: Signal<string> = computed(() => format(this.selectedDate(), "MMMM yyyy"));

  constructor() {
    effect(() => {
      this.loadData();
    });
  }
  
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  
  handleSelectDate(date: Date): void {
    this.isFiltering.set(true);
    this.selectedDate.set(date);
    this.datepicker.hide();
  }

  onPageChange(event: PaginatorState) {
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? 10);
  }

  handleChangeStatus(id: number, data: UpdatePaymentStatusType): void {
    this.dmPaymentsService.updatePaymentStatus(id, data).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Paiement mis à jour avec succès'
      });
      this.loadData();
    });
  }
  
  private loadData(): void {
    this.isLoading.set(true);
    this.dmPaymentsService.getDmPayments({
      date: this.selectedDate(),
      page: this.first() + 1,
      itemsPerPage: this.rows()
    }).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.isLoading.set(false);
        this.isFiltering.set(false);
      })
    ).subscribe(response => this.data.set(response));
  }
}
