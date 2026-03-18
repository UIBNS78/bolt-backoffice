import { Pipe, PipeTransform } from '@angular/core';
import { transportObj } from '@shared/types/delivery-men';

@Pipe({
  name: 'transport',
  standalone: true
})
export class TransportPipe implements PipeTransform {

  transform(value: number,): string {
    const nSecured: number = Math.floor(Math.max(value, 1));
    switch(nSecured) {
      case transportObj.foot:
        return "A pieds";
      
      case transportObj.bicyle:
        return "En vélo";

      case transportObj.motorcycle:
        return "En moto"
        
      default:
        return "A pieds"
    }
  }

}
