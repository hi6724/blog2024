/**
 * 주어진 문자열을 특정 구분자로 지정된 횟수만큼 분할하여 배열로 반환하는 함수
 * @param {string} str - 분할할 문자열
 * @param {string} separator - 문자열을 분할할 구분자
 * @param {number} [limit=1] - 분할할 횟수 (기본값: 1)
 * @returns {string[]} - 분할된 문자열의 배열
 */
export function splitFirst(str: string, separator: string, limit = 1) {
  const result = [];
  let remainingStr = str;

  // 지정된 횟수만큼 반복
  for (let i = 0; i < limit; i++) {
    const index = remainingStr.indexOf(separator);

    if (index === -1) {
      break; // 구분자가 더 이상 없으면 반복 종료
    }

    // 현재 분할된 부분을 결과 배열에 추가
    result.push(remainingStr.slice(0, index));

    // 남은 문자열 갱신
    remainingStr = remainingStr.slice(index + separator.length);
  }

  // 남은 문자열을 결과 배열에 추가
  result.push(remainingStr);

  return result;
}
