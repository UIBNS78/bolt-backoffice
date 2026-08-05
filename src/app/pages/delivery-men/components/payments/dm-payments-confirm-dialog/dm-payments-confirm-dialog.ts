import { NgClass } from '@angular/common';
import { Component, computed, inject, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentStatusIconPipe } from '@shared/pipes/payment-pipes/payment-status-icon-pipe';
import { PaymentStatusSeverityPipe } from '@shared/pipes/payment-pipes/payment-status-severity-pipe';
import { DMPayment, PAYMENT_MODE, PAYMENT_STATUS, PaymentMode, PaymentStatus } from 'app/pages/delivery-men/types/delivery-men-payments';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-dm-payments-confirm-dialog',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    MessageModule,
    NgClass,
    PaymentStatusIconPipe,
    PaymentStatusSeverityPipe
  ],
  templateUrl: './dm-payments-confirm-dialog.html',
  styleUrl: './dm-payments-confirm-dialog.css',
})
export class DmPaymentsConfirmDialog implements OnInit {
  // services
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly dialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private readonly dialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);
  
  // vars
  protected form: FormGroup = new FormGroup({});
  protected showPaymentModeSelection: WritableSignal<boolean> = signal(true);
  protected newStatus: WritableSignal<PaymentStatus | null> = signal(null);
  protected payment: WritableSignal<DMPayment | null> = signal(null);
  protected message: Signal<string> = computed(() => {
    const newStatus: PaymentStatus | null = this.newStatus();
    if (!newStatus) {
      return "Information";
    }
    
    return {
      [PAYMENT_STATUS.pending]: "Etes-vous sûr de vouloir remettre le statut en \"en attente\" ?",
      [PAYMENT_STATUS.processing]: "Etes-vous sûr de vouloir mettre le statut en \"en cours\" ?",
      [PAYMENT_STATUS.paid]: "Etes-vous sûr de vouloir valider ce paiement ?",
      [PAYMENT_STATUS.failed]: "Etes-vous sûr de vouloir marquer ce paiement comme échoué ?",
      [PAYMENT_STATUS.onHold]: "Etes-vous sûr de vouloir suspendre ce paiement ?"
    }[newStatus];
  });
  protected paymentModeOptions: { label: string, value: PaymentMode }[] = [
    {label: "Especes", value: PAYMENT_MODE.cash},
    {label: "Mobile Money", value: PAYMENT_MODE.mobileMoney},
    {label: "Banque", value: PAYMENT_MODE.bank}
  ];

  constructor() {
    this.form = this.formBuilder.group({
      paymentMode: [PAYMENT_MODE.cash, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.newStatus.set(this.dialogConfig.data?.newStatus ?? null);
    this.payment.set(this.dialogConfig.data?.payment ?? null);

    const showSelection: boolean = this.dialogConfig.data?.showPaymentModeSelection ?? true; 
    if (!showSelection) {
      this.form.get('paymentMode')?.removeValidators([Validators.required]);
    }
    this.showPaymentModeSelection.set(showSelection);
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.form.getRawValue().paymentMode as PaymentMode);
  }

  handleClose(): void {
    this.dialogRef.close(null);
  }  

  protected getColor(): string {
    switch (this.newStatus()) {
      case PAYMENT_STATUS.pending:
        return 'text-gray-500';
      case PAYMENT_STATUS.processing:
        return 'text-blue-500';
      case PAYMENT_STATUS.paid:
        return 'text-green-500';
      case PAYMENT_STATUS.failed:
        return 'text-red-500';
      case PAYMENT_STATUS.onHold:
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  }

  protected getBgColor(): string {
    switch (this.newStatus()) {
      case PAYMENT_STATUS.pending:
        return 'bg-gray-500/10';
      case PAYMENT_STATUS.processing:
        return 'bg-blue-500/10';
      case PAYMENT_STATUS.paid:
        return 'bg-green-500/10';
      case PAYMENT_STATUS.failed:
        return 'bg-red-500/10';
      case PAYMENT_STATUS.onHold:
        return 'bg-orange-500/10';
      default:
        return 'bg-gray-500/10';
    }
  }
}
