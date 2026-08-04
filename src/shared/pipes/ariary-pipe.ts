import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ariary',
})
export class AriaryPipe implements PipeTransform {
  transform(value: number): string {
    return new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(value);
  }
}
