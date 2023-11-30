/** yyyy-mm-dd 형식의 체크인 체크아웃 정보를 통해 숙박 일수(박)를 계산 */
export function calculateNumberOfNights(checkIn: string, checkOut: string): number {
  const date1 = new Date(checkIn);
  const date2 = new Date(checkOut);

  const diffInTime = date2.getTime() - date1.getTime();
  const diffInDays = diffInTime / (1000 * 3600 * 24);

  return Math.floor(diffInDays);
}
  
/** yyyy-mm-dd 형식의 날짜를 yyyy.mm.dd(요일) 형식으로 리턴함 */
export function formatDate(dateString: string): string {
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  const formattedDate = `${year}.${month}.${day}(${daysOfWeek[date.getDay()]})`;
  return formattedDate;
}

/** yyyy-mm-dd 형식을 yyyymmdd 형식으로 변환 */
export function removeHyphensFromDate(dateString: string): string {
  return dateString.replace(/-/g, '');
}