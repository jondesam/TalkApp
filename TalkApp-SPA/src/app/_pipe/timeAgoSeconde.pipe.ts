import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgoSeconde',
})
export class TimeAgoSecondePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    const split = value.split(' ', 2);
    if (+split[0] <= 59 && split[1] === 'seconds') {
      return 'Less than a minute ago';
    } else {
      return value;
    }
  }
}
