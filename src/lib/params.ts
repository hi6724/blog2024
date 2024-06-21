export function formatSearchParams(obj: any) {
  let params = new URLSearchParams(obj);
  let keysForDel: string[] = [];
  params.forEach((value, key) => {
    if (value == '') {
      keysForDel.push(key);
    }
  });

  keysForDel.forEach((key) => {
    params.delete(key);
  });

  return params.toString();
}
