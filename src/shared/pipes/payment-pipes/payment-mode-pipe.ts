import { Pipe, PipeTransform } from '@angular/core';
import { PAYMENT_MODE, PaymentMode } from 'app/pages/delivery-men/types/delivery-men-payments';

@Pipe({
  name: 'paymentMode',
})
export class PaymentModePipe implements PipeTransform {
  transform(mode: PaymentMode): string {
    return {
      [PAYMENT_MODE.bank]: 'Banque',
      [PAYMENT_MODE.cash]: 'Espèces',
      [PAYMENT_MODE.mobileMoney]: 'Mobile money'
    }[mode];
  }
}
