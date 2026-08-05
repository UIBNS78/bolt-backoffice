import { Pipe, PipeTransform } from '@angular/core';
import { PAYMENT_STATUS, PaymentStatus } from 'app/pages/delivery-men/types/delivery-men-payments';

type PrimeNgSeverity = 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast';

@Pipe({
  name: 'paymentStatusSeverity',
})
export class PaymentStatusSeverityPipe implements PipeTransform {
  transform(status: PaymentStatus): PrimeNgSeverity {
    return {
      [PAYMENT_STATUS.pending]: 'secondary',
      [PAYMENT_STATUS.processing]: 'info',
      [PAYMENT_STATUS.paid]: 'success',
      [PAYMENT_STATUS.failed]: 'danger',
      [PAYMENT_STATUS.onHold]: 'warn',
    }[status] as PrimeNgSeverity;
  }
}
