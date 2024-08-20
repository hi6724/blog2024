import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko'); // 한국어 로케일 설정

// 옵션 객체의 타입 정의
interface FormatDateOptions {
  day?: boolean;
  time?: boolean;
}

/**
 * 날짜 문자열 또는 타임스탬프를 받아서 한글로 요일과 시간을 포함한 포맷으로 변환하는 함수
 * @param {string | number} dateInput - "YYYY-MM-DD" 형식의 날짜 문자열 또는 타임스탬프
 * @param {FormatDateOptions} options - 옵션 객체 (day, time)
 * @returns {string} - "YYYY.MM.DD(요일) 오후HH:mm" 또는 "YYYY.MM.DD" 형식의 문자열
 */
export function formatDateWithDay(dateInput: string | number, options: FormatDateOptions = {}): string {
  const { day = false, time = false } = options;

  // dateInput이 문자열일 경우 dayjs로 변환, 타임스탬프일 경우 dayjs로 변환
  const date = typeof dateInput === 'string' ? dayjs(dateInput) : dayjs(Number(dateInput));

  // 기본 날짜 포맷팅 (YYYY.MM.DD)
  let formattedDate = date.format('YYYY.MM.DD');

  if (day) {
    // 요일 추가 (월, 화, 수 등)
    const dayOfWeek = date.format('ddd');
    formattedDate += `(${dayOfWeek})`;
  }

  if (time) {
    // 시간 포맷팅 (오전/오후 HH:mm)
    const timeFormat = date.format('A h:mm');
    formattedDate += ` ${timeFormat}`;
  }

  return formattedDate;
}