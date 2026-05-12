import { Pipe, PipeTransform } from '@angular/core';
import { DeliveryStatus } from '@shared/types/delivery';

@Pipe({
  name: 'deliveryStatusIcon',
})
export class DeliveryStatusIconPipe implements PipeTransform {
  transform(value: DeliveryStatus): string {
    switch(value) {
      case 0:
        return "pi pi-times-circle";

      case 1:
        return "pi pi-hourglass";

      case 2:
        return "pi pi-cart-arrow-down";

      case 3:
        return "pi pi-bolt";

      case 4:
        return "pi pi-check";

      default:
        return "pi pi-question";
    }
  }
}
