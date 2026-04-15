import { Pipe, PipeTransform } from '@angular/core';
import { format, isToday, isTomorrow, isValid, isYesterday, toDate } from 'date-fns';
import { fr } from 'date-fns/locale';

@Pipe({
  name: 'todayYesterdayTomorrow',
  standalone: true
})
export class TodayYesterdayTomorrowPipe implements PipeTransform {

  transform(value: string | Date, dateFormat: string, time?: "H:mm:ss" | "H:mm"): string {
    const date: Date = typeof value === 'string' ? toDate(value) : value;
    if (typeof value === 'string' && !isValid(date)) {
      return value;
    }
    
    return (
      isToday(date) ? 
        "Aujourd'hui" 
        : isYesterday(date) ? 
          "Hier" 
          : isTomorrow(date) ?
            "Demain"
            : format(date, dateFormat, { locale: fr })
    ) + (time ? (' à ' + format(date, time)) : '');
  }

}
