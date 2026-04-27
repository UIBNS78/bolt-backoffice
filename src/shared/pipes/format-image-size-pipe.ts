import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatImageSize',
})
export class FormatImageSizePipe implements PipeTransform {
  transform(value: number): string {
    if (value === 0) return '0 Octet';

    const k = 1024;
    const dm = 3;
    const sizes = ['Octets', 'Ko', 'Mo', 'Go', 'To'];

    // On calcule l'index de l'unité (0 pour Octets, 1 pour Ko, etc.)
    const i = Math.floor(Math.log(value) / Math.log(k));

    return parseFloat((value / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
