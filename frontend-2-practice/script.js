const MONTHS_NOMINATIVE = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const MONTHS_GENITIVE = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const DAYS_OF_WEEK = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

const ALL_SLOTS = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'];
const BUSY_SLOTS = ['11:00', '13:00'];

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

const state = {
  currentYear: TODAY.getFullYear(),
  currentMonth: TODAY.getMonth(),
  selectedDay: TODAY.getDate(),
  selectedTime: null
};

function compareDates(date1, date2) {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

function isDateSelectable(day, month, year) {
  const date = new Date(year, month, day);
  return compareDates(date, TODAY) >= 0;
}

function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) { weeks.push(cells.slice(i, i + 7)); }
  return weeks;
}

const calendarDaysEl = document.getElementById('calendarDays');
const currentMonthEl = document.getElementById('currentMonth');
const slotsGridEl = document.getElementById('slotsGrid');
const bottomBarEl = document.getElementById('bottomBar');

function renderCalendar() {
  currentMonthEl.textContent = `${MONTHS_NOMINATIVE[state.currentMonth]} ${state.currentYear}`;
  const weeks = buildCalendarGrid(state.currentYear, state.currentMonth);
  let html = '';
  for (const week of weeks) {
    for (const day of week) {
      if (day === null) {
        html += `<span class="calendar__day calendar__day--empty"></span>`;
      } else {
        const selectable = isDateSelectable(day, state.currentMonth, state.currentYear);
        const isSelected = state.selectedDay === day;
        let classes = ['calendar__day'];
        if (!selectable) classes.push('calendar__day--disabled');
        if (isSelected) classes.push('calendar__day--selected');
        html += `<button class="${classes.join(' ')}" type="button" data-day="${day}" ${!selectable ? 'disabled' : ''}>${day}</button>`;
      }
    }
  }
  calendarDaysEl.innerHTML = html;
  calendarDaysEl.querySelectorAll('.calendar__day:not(.calendar__day--disabled):not(.calendar__day--empty)').forEach(btn => {
    btn.addEventListener('click', onDayClick);
  });
}

function renderTimeSlots() {
  let html = '';
  for (const time of ALL_SLOTS) {
    const isBusy = BUSY_SLOTS.includes(time);
    const isSelected = state.selectedTime === time;
    let classes = ['slot'];
    if (isBusy) classes.push('slot--busy');
    if (isSelected) classes.push('slot--selected');
    html += `<button class="${classes.join(' ')}" type="button" data-time="${time}" ${isBusy ? 'disabled' : ''}>${time}</button>`;
  }
  slotsGridEl.innerHTML = html;
  slotsGridEl.querySelectorAll('.slot:not(.slot--busy)').forEach(btn => {
    btn.addEventListener('click', onTimeSlotClick);
  });
}

function updateBottomBar() {
  if (!state.selectedDay) {
    bottomBarEl.innerHTML = `<span class="bottom-bar__text">Выберите дату и время</span>`;
    return;
  }
  const date = new Date(state.currentYear, state.currentMonth, state.selectedDay);
  const dayName = DAYS_OF_WEEK[date.getDay()];
  const monthName = MONTHS_GENITIVE[state.currentMonth];
  let text = `${dayName}, ${state.selectedDay} ${monthName} ${state.currentYear}`;
  text += state.selectedTime ? ` • ${state.selectedTime}` : ' • время не выбрано';
  bottomBarEl.innerHTML = `<span class="bottom-bar__text">${text}</span>`;
}

function onDayClick(event) {
  state.selectedDay = Number(event.currentTarget.dataset.day);
  state.selectedTime = null;
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

function onTimeSlotClick(event) {
  state.selectedTime = event.currentTarget.dataset.time;
  renderTimeSlots();
  updateBottomBar();
}

document.getElementById('prevMonth').addEventListener('click', () => {
  state.currentMonth--;
  if (state.currentMonth < 0) { state.currentMonth = 11; state.currentYear--; }
  state.selectedDay = null; state.selectedTime = null;
  renderCalendar(); renderTimeSlots(); updateBottomBar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
  state.currentMonth++;
  if (state.currentMonth > 11) { state.currentMonth = 0; state.currentYear++; }
  state.selectedDay = null; state.selectedTime = null;
  renderCalendar(); renderTimeSlots(); updateBottomBar();
});

document.getElementById('nextBtn').addEventListener('click', () => {
  if (!state.selectedDay) return alert('Сначала выберите день');
  if (!state.selectedTime) return alert('Сначала выберите время');
  const date = new Date(state.currentYear, state.currentMonth, state.selectedDay);
  alert(`Запись подтверждена:\n${DAYS_OF_WEEK[date.getDay()]}, ${state.selectedDay} ${MONTHS_GENITIVE[state.currentMonth]} ${state.currentYear} в ${state.selectedTime}`);
});

renderCalendar();
renderTimeSlots();
updateBottomBar();