import { Pipe, PipeTransform } from '@angular/core';
import { DeliveryStatus } from '@shared/types/delivery';

@Pipe({
  name: 'deliveryStatusSeverity',
})
export class DeliveryStatusSeverityPipe implements PipeTransform {
  transform(value: DeliveryStatus): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    switch(value) {
      case 0:
        return "danger";

      case 1:
        return "contrast";

      case 2:
        return "warn";

      case 3:
        return "info";

      case 4:
        return "success";

      default:
        return "secondary";
    }
  }
}
