import { Pipe, PipeTransform } from '@angular/core';
import { isValid, isWithinInterval, subDays } from 'date-fns';

const today: Date = new Date();

@Pipe({
  name: 'recent',
})
export class RecentPipe implements PipeTransform {
  transform(value: Date): boolean {
    const date: Date = new Date(value);

    if (!isValid(date)) {
      return false;
    }
    
    
    return isWithinInterval(date, {
      start: subDays(today, 7),
      end: today
    });
  }
}
