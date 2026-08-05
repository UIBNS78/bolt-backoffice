import { Pipe, PipeTransform } from '@angular/core';
import { PAYMENT_STATUS, PaymentStatus } from 'app/pages/delivery-men/types/delivery-men-payments';

@Pipe({
  name: 'paymentStatus',
})
export class PaymentStatusPipe implements PipeTransform {
  transform(status: PaymentStatus): string {
    return {
      [PAYMENT_STATUS.pending]: 'En attente',
      [PAYMENT_STATUS.processing]: 'Traitement',
      [PAYMENT_STATUS.paid]: 'Payé',
      [PAYMENT_STATUS.failed]: 'Échoué',
      [PAYMENT_STATUS.onHold]: 'Suspendu',
    }[status];
  }
}
