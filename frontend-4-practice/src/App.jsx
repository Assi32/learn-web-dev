import { useState, useEffect } from 'react';
import { fetchToday, fetchSlots } from './api.js';

const MONTHS_NOMINATIVE = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const MONTHS_GENITIVE = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const DAYS_OF_WEEK = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

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
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export default function App() {
  const [today, setToday] = useState(null);
  const [isLoadingToday, setIsLoadingToday] = useState(true);
  const [errorToday, setErrorToday] = useState(null);

  const [slots, setSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [errorSlots, setErrorSlots] = useState(null);

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    async function loadToday() {
      try {
        setIsLoadingToday(true);
        const data = await fetchToday();
        setToday(data);
        setCurrentYear(data.year);
        setCurrentMonth(data.month);
        setSelectedDay(data.day);
      } catch (err) {
        setErrorToday(err.message);
      } finally {
        setIsLoadingToday(false);
      }
    }
    loadToday();
  }, []);

  useEffect(() => {
    if (!selectedDay) return;
    let ignore = false;
    async function loadSlots() {
      try {
        setIsLoadingSlots(true);
        setErrorSlots(null);
        setSelectedTime(null);
        const data = await fetchSlots(selectedDay, currentMonth, currentYear);
        if (!ignore) setSlots(data.slots);
      } catch (err) {
        if (!ignore) setErrorSlots(err.message);
      } finally {
        if (!ignore) setIsLoadingSlots(false);
      }
    }
    loadSlots();
    return () => { ignore = true; };
  }, [selectedDay, currentMonth, currentYear]);

  if (isLoadingToday) return <div style={{display:'flex',justifyContent:'center',marginTop:'100px'}}><h2>Загрузка…</h2></div>;
  if (errorToday) return <div style={{display:'flex',justifyContent:'center',marginTop:'100px',color:'red'}}><h2>{errorToday}</h2></div>;

  const weeks = buildCalendarGrid(currentYear, currentMonth);
  
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
          <h1 className="page-title">Выбор даты и времени</h1>
          <div className="booking-grid">
            <section className="calendar">
              <div className="calendar__header">
                <button className="calendar__arrow" onClick={() => {
                  if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
                  else setCurrentMonth(currentMonth - 1);
                  setSelectedDay(null);
                }}>←</button>
                <span className="calendar__month">{MONTHS_NOMINATIVE[currentMonth]} {currentYear}</span>
                <button className="calendar__arrow" onClick={() => {
                  if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
                  else setCurrentMonth(currentMonth + 1);
                  setSelectedDay(null);
                }}>→</button>
              </div>
              <div className="calendar__weekdays">
                <span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span><span>Вс</span>
              </div>
              <div className="calendar__days">
                {weeks.map((week, wIdx) =>
                  week.map((day, dIdx) => {
                    if (day === null) return <span key={`empty-${wIdx}-${dIdx}`} className="calendar__day calendar__day--empty"></span>;
                    const isPast = new Date(currentYear, currentMonth, day) < new Date(today.year, today.month, today.day);
                    const isSelected = selectedDay === day;
                    let cls = 'calendar__day';
                    if (isPast) cls += ' calendar__day--disabled';
                    if (isSelected) cls += ' calendar__day--selected';
                    return (
                      <button key={`day-${day}`} className={cls} disabled={isPast} onClick={() => setSelectedDay(day)}>
                        {day}
                      </button>
                    );
                  })
                )}
              </div>
            </section>
            <section className="slots">
              <h2 className="slots__title">Свободное время</h2>
              {isLoadingSlots ? (
                <div style={{ margin: '40px 0', textAlign: 'center' }}>Загрузка слотов…</div>
              ) : errorSlots ? (
                <div style={{ margin: '40px 0', textAlign: 'center', color: 'red' }}>{errorSlots}</div>
              ) : (
                <div className="slots__grid">
                  {slots.map(slot => {
                    const isSelected = selectedTime === slot.time;
                    let cls = 'slot';
                    if (!slot.available) cls += ' slot--busy';
                    if (isSelected) cls += ' slot--selected';
                    return (
                      <button key={slot.time} className={cls} disabled={!slot.available} onClick={() => setSelectedTime(slot.time)}>
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
              )}
              <button className="btn-primary" type="button" disabled={isLoadingSlots || errorSlots || !selectedTime}>Далее</button>
            </section>
          </div>
          <div className="bottom-bar"><span className="bottom-bar__text">{bottomText}</span></div>
        </div>
      </main>
      <footer className="footer"><div className="footer__container"><div className="footer__logo">Barbershop</div></div></footer>
    </>
  );
}
