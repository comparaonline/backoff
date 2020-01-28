# backoff

Simple backoff method to retry failed observables.

It takes two arguments, `maxTries` and `ms`, the amount of attempts and the number of
milliseconds that will be waited after the first failure. Any successive attempts
the method will backoff for the specified `ms` times increasing exponentially

## Usage:
```ts
import { from } from 'rxjs';
import { backoff } from '@comparaonline/backoff';

const result = from(axios('http://sometimesfails.com')).pipe(
  backoff(3, 10000)
).toPromise();
```

`result` will either resolve correctly or retry two more times if it fails,
waiting 10 seconds the first time, and 40 the second time. If it fails a third
time, it will be rejected.
