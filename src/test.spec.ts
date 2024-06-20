import exp from 'constants';

test('n is null or not', () => {
  const n = null;

  expect(n).toBeNull();
});

test('2+2 = 4', () => {
  const n = 2 + 2;
  expect(n).toEqual(4);
});
