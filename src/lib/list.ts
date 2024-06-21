export function calculateArray<T>(arr?: T[], key?: string) {
  if (!arr || !key) return [0];
  let result: number[] = [0];
  let sum = 0;

  arr.forEach((obj: any) => {
    if (obj[key]) {
      sum += 2;
    } else {
      sum += 1;
    }
    result.push(sum);
  });

  return result;
}
