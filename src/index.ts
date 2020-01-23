import { pipe, range, zip, timer, concat, throwError } from 'rxjs';
import { retryWhen, map, flatMap, shareReplay, skip } from 'rxjs/operators';
const throwLast = (maxTries: number) => pipe(
  skip(maxTries),
  flatMap(e => throwError(e))
);

export const backoff = <T>(maxTries: number, ms: number) => pipe(
  retryWhen<T>(pipe(
    shareReplay(),
    attempts => concat(
      zip(range(1, maxTries), attempts).pipe(
        map(([i]) => i * i),
        flatMap(i => timer(i * ms))
      ),
      throwLast(maxTries)(attempts)
    )
  ))
);
