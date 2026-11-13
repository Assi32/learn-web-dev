import { useState } from 'react';

// --- ДАННЫЕ И ЧИСТЫЕ ФУНКЦИИ ---
const MONTHS_NOMINATIVE = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const MONTHS_GENITIVE = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const DAYS_OF_WEEK = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

const ALL_SLOTS = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'];
const BUSY_SLOTS = ['11:00', '13:00'];

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

const compareDates = (d1, d2) => {
  const date1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const date2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());
  if (date1 < date2) return -1;
  if (date1 > date2) return 1;
  return 0;
};

const isDateSelectable = (day, month, year) => {
  const date = new Date(year, month, day);
  return compareDates(date, TODAY) >= 0;
};

const buildCalendarGrid = (year, month) => {
  const firstDay = new Date(year, month, 1);
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
};

// --- КОМПОНЕНТ APP ---
export default function App() {
  const [currentYear, setCurrentYear] = useState(TODAY.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(TODAY.getMonth());
  const [selectedDay, setSelectedDay] = useState(TODAY.getDate());
  const [selectedTime, setSelectedTime] = useState(null);

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setSelectedTime(null); // Сброс времени
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(null);
    setSelectedTime(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null);
    setSelectedTime(null);
  };

  const handleNextClick = () => {
    if (!selectedDay) return alert('Сначала выберите день');
    if (!selectedTime) return alert('Сначала выберите время');
    const date = new Date(currentYear, currentMonth, selectedDay);
    alert(`Запись подтверждена:\n${DAYS_OF_WEEK[date.getDay()]}, ${selectedDay} ${MONTHS_GENITIVE[currentMonth]} ${currentYear} в ${selectedTime}`);
  };

  const weeks = buildCalendarGrid(currentYear, currentMonth);

  // Формирование текста нижней панели
  let bottomText = 'Выберите дату и время';
  if (selectedDay) {
    const date = new Date(currentYear, currentMonth, selectedDay);
    bottomText = `${DAYS_OF_WEEK[date.getDay()]}, ${selectedDay} ${MONTHS_GENITIVE[currentMonth]} ${currentYear} • ${selectedTime || 'время не выбрано'}`;
  }

  return (
    <>
      <header className="header">
        <div className="header__container">
          <a href="#" className="header__logo">Barbershop</a>
          <nav className="header__nav">
            <a href="#" className="header__link">Услуги</a>
            <a href="#" className="header__link">Мастера</a>
            <a href="#" className="header__link">Контакты</a>
          </nav>
          <a href="tel:+79990000000" className="header__phone">+7 (999) 123-45-67</a>
        </div>
      </header>

      <main className="main">
        <div className="main__container">
          <div className="steps">
            <div className="steps__item steps__item--done"><span className="steps__icon">✓</span> Услуга</div>
            <div className="steps__line"></div>
            <div className="steps__item steps__item--done"><span className="steps__icon">✓</span> Мастер</div>
            <div className="steps__line"></div>
            <div className="steps__item steps__item--active"><span className="steps__icon">3</span> Время</div>
          </div>

          <h1 className="page-title">Выбор даты и времени</h1>

          <div className="booking-grid">
            {/* КАЛЕНДАРЬ */}
            <section className="calendar">
              <div className="calendar__header">
                <button className="calendar__arrow" onClick={handlePrevMonth}>←</button>
                <span className="calendar__month">{MONTHS_NOMINATIVE[currentMonth]} {currentYear}</span>
                <button className="calendar__arrow" onClick={handleNextMonth}>→</button>
              </div>

              <div className="calendar__weekdays">
                <span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span><span>Вс</span>
              </div>

              <div className="calendar__days">
                {weeks.map((week, wIdx) =>
                  week.map((day, dIdx) => {
                    if (day === null) {
                      return <span key={`empty-${wIdx}-${dIdx}`} className="calendar__day calendar__day--empty"></span>;
                    }
                    const selectable = isDateSelectable(day, currentMonth, currentYear);
                    const isSelected = selectedDay === day;
                    let cls = 'calendar__day';
                    if (!selectable) cls += ' calendar__day--disabled';
                    if (isSelected) cls += ' calendar__day--selected';

                    return (
                      <button key={`day-${day}`} className={cls} disabled={!selectable} onClick={() => handleDayClick(day)}>
                        {day}
                      </button>
                    );
                  })
                )}
              </div>
            </section>

            {/* СЛОТЫ */}
            <section className="slots">
              <h2 className="slots__title">Свободное время</h2>
              <div className="slots__grid">
                {ALL_SLOTS.map(time => {
                  const isBusy = BUSY_SLOTS.includes(time);
                  const isSelected = selectedTime === time;
                  let cls = 'slot';
                  if (isBusy) cls += ' slot--busy';
                  if (isSelected) cls += ' slot--selected';

                  return (
                    <button key={time} className={cls} disabled={isBusy} onClick={() => setSelectedTime(time)}>
                      {time}
                    </button>
                  );
                })}
              </div>
              <button className="btn-primary" onClick={handleNextClick}>Далее</button>
            </section>
          </div>

          {/* НИЖНЯЯ ПАНЕЛЬ */}
          <div className="bottom-bar">
            <span className="bottom-bar__text">{bottomText}</span>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer__container">
          <div className="footer__logo">Barbershop</div>
          <div className="footer__links">
            <a href="#">Политика конфиденциальности</a>
            <a href="#">Оферта</a>
          </div>
          <div className="footer__socials">
            <a href="#">VK</a>
            <a href="#">TG</a>
          </div>
        </div>
      </footer>
    </>
  );
}