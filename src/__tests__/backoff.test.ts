import { from } from 'rxjs';
import { backoff } from '..';
import { toArray, map } from 'rxjs/operators';

describe('backoff', () => {
  const time = 0;
  it('doesnt do anything if the original observable worked fine', async () => {
    const tries = 10;
    // tslint:disable-next-line: no-magic-numbers
    const test = [1, 2, 3, 4];
    const result = await from(test).pipe(
      backoff(tries, time),
      toArray()
    ).toPromise();
    expect(result).toEqual(test);
  });

  it('retries the expected amount of times', async () => {
    const tries = 2;
    // tslint:disable-next-line: no-magic-numbers
    const test = [1, 2, 3, 4];
    const failTwice = jest.fn(a => a)
      .mockImplementationOnce(() => { throw new Error(); })
      .mockImplementationOnce(() => { throw new Error(); });
    const result = from(test).pipe(
      map(v => failTwice(v)),
      backoff(tries, time),
      toArray()
    ).toPromise();
    await expect(result).resolves.toEqual(test);
  });
  it('fails if it exceeds the expected amount of times', async () => {
    const tries = 2;
    // tslint:disable-next-line: no-magic-numbers
    const test = [1, 2, 3, 4];
    const failThrice = jest.fn(a => a)
      .mockImplementationOnce(() => { throw new Error('first'); })
      .mockImplementationOnce(() => { throw new Error('second'); })
      .mockImplementationOnce(() => { throw new Error('last'); });
    const result = from(test).pipe(
      map(v => failThrice(v)),
      backoff(tries, time),
      toArray()
    ).toPromise();
    await expect(result).rejects.toThrow('last');
  });
});
