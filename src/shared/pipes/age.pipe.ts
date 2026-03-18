import { Pipe, PipeTransform } from '@angular/core';
import { differenceInYears, isDate, isValid } from 'date-fns';

@Pipe({
  name: 'age',
  standalone: true
})
export class AgePipe implements PipeTransform {

  transform(value: string, type: "full" | "short" = "full"): string {
    const date: Date = new Date(value);
    if (!isValid(date)) {
      return value;
    }

    const today: Date = new Date();
    const age: number = differenceInYears(today, date);
    return age + (type === "short" ? "" : " ans");
  }

}
