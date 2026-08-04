import { Pipe, PipeTransform } from '@angular/core';
import { PAYMENT_STATUS, paymentStatus } from 'app/pages/delivery-men/types/delivery-men-payments';

@Pipe({
  name: 'paymentStatus',
})
export class PaymentStatusPipe implements PipeTransform {
  transform(status: paymentStatus): string {
    return {
      [PAYMENT_STATUS.pending]: 'En attente',
      [PAYMENT_STATUS.processing]: 'En cours',
      [PAYMENT_STATUS.paid]: 'Payé',
      [PAYMENT_STATUS.failed]: 'Échoué',
      [PAYMENT_STATUS.onHold]: 'En attente',
    }[status];
  }
}
