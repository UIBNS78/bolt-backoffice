import { NgClass } from '@angular/common';
import { Component, computed, EventEmitter, inject, input, InputSignal, OnDestroy, Output, signal, Signal, WritableSignal } from '@angular/core';
import { PaymentStatusIconPipe } from '@shared/pipes/payment-pipes/payment-status-icon-pipe';
import { PaymentStatusPipe } from '@shared/pipes/payment-pipes/payment-status-pipe';
import { PaymentStatusSeverityPipe } from '@shared/pipes/payment-pipes/payment-status-severity-pipe';
import { DMPayment, PAYMENT_STATUS, PaymentMode, PaymentStatus, UpdatePaymentStatusType } from 'app/pages/delivery-men/types/delivery-men-payments';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { MenuModule } from 'primeng/menu';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { DmPaymentsConfirmDialog } from '../dm-payments-confirm-dialog/dm-payments-confirm-dialog';
import { filter, Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dm-payments-status-editable',
  imports: [
    MenuModule,
    TagModule,
    ProgressSpinnerModule,
    NgClass,
    PaymentStatusPipe,
    PaymentStatusIconPipe,
    PaymentStatusSeverityPipe
  ],
  templateUrl: './dm-payments-status-editable.html',
  styleUrl: './dm-payments-status-editable.css',
})
export class DmPaymentsStatusEditable implements OnDestroy {
  // services
  private readonly dialogService: DialogService = inject(DialogService);
  
  // outputs
  @Output() onStatusChangeEmitter: EventEmitter<UpdatePaymentStatusType> = new EventEmitter();

  // inputs
  private readonly unsubscribe$: Subject<void> = new Subject<void>();
  payment: InputSignal<DMPayment> = input.required<DMPayment>();
  protected isSwitching: WritableSignal<boolean> = signal(false);
  protected items: MenuItem[] = [
    {
      id: PAYMENT_STATUS.pending,
      label: "En attente",
      icon: 'pi pi-hourglass',
      command: () => this.handleConfirm(PAYMENT_STATUS.pending)
    },
    {
      id: PAYMENT_STATUS.processing,
      label: "Traitement",
      icon: 'pi pi-wrench',
      command: () => this.handleConfirm(PAYMENT_STATUS.processing)
    },
    {
      id: PAYMENT_STATUS.paid,
      label: "Payer",
      icon: 'pi pi-check',
      command: () => this.handleConfirm(PAYMENT_STATUS.paid)
    },
    {
      id: PAYMENT_STATUS.failed,
      label: "Échouer",
      icon: 'pi pi-times',
      command: () => this.handleConfirm(PAYMENT_STATUS.failed)
    },
    {
      id: PAYMENT_STATUS.onHold,
      label: "Suspendre",
      icon: 'pi pi-ban',
      command: () => this.handleConfirm(PAYMENT_STATUS.onHold)
    }
  ];

  protected statuses: Signal<MenuItem[]> = computed(() => {
    return this.items.filter(s => s.id !== this.payment().status);
  });

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  
  handleConfirm(status: PaymentStatus): void {
    const modalRef = this.dialogService.open(DmPaymentsConfirmDialog, {
      showHeader: false,
      data: {
        showPaymentModeSelection: status === PAYMENT_STATUS.paid || status === PAYMENT_STATUS.failed,
        payment: this.payment(),
        newStatus: status
      },
      width: '22rem'
    });

    modalRef?.onClose.pipe(
      take(1),
      filter((confirmed) => !!confirmed),
      takeUntil(this.unsubscribe$)
    ).subscribe((paymentMode) => {
      this.onStatusChangeEmitter.emit({ status, paymentMode });
    });
  }
}
