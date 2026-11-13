export async function fetchToday() {
  const res = await fetch('/api/booking/today');
  if (!res.ok) throw new Error('Не удалось загрузить дату');
  return await res.json();
}

export async function fetchSlots(day, month, year) {
  const url = `/api/slots?day=${day}&month=${month}&year=${year}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Не удалось загрузить слоты');
  return await res.json();
}