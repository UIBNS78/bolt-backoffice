import { Pipe, PipeTransform } from '@angular/core';
import { PAYMENT_STATUS, PaymentStatus } from 'app/pages/delivery-men/types/delivery-men-payments';

@Pipe({
  name: 'paymentStatusIcon',
})
export class PaymentStatusIconPipe implements PipeTransform {
  transform(status: PaymentStatus): string {
    return {
      [PAYMENT_STATUS.pending]: 'pi pi-hourglass',
      [PAYMENT_STATUS.processing]: 'pi pi-wrench',
      [PAYMENT_STATUS.paid]: 'pi pi-check',
      [PAYMENT_STATUS.failed]: 'pi pi-times',
      [PAYMENT_STATUS.onHold]: 'pi pi-ban',
    }[status];
  }
}
