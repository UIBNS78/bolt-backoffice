import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plural',
  standalone: true
})
export class PluralPipe implements PipeTransform {

  transform(word: string, n: number, pluralWord?: string): string {
    const nSecured: number = Math.floor(Math.max(n, 1));
    const plural: string = pluralWord ?? `${word}s`;
    
    return nSecured > 1 ? plural : word;
  }

}
