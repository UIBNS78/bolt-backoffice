import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'bigram',
    standalone: true
})

export class BigramPipe implements PipeTransform {
    transform(value: string): string {
        let bigram = '';
        value.split(" ").slice(0, 2).forEach((val: string) => bigram += val.charAt(0));
        return bigram.toUpperCase();
    }
}