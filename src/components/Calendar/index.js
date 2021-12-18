import { useMemo, useState } from 'react'
import './index.scss'

function Calendar() {
  const [date, setDate] = useState(new Date());
  const current = new Date();
  const dateNames = {
    month: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  }

  const currentDate = useMemo(() => {
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      date: date.getDate(),
      day: date.getDay(),
      currentMonthMaxDay: 32 - new Date(date.getFullYear(), date.getMonth(), 32).getDate(),
    }
  }, [date])

  const currentDateWeekArray = useMemo(() => {
    let weeks = [];
    const prevMonthDate = new Date(currentDate.year, currentDate.month, 1);
    const prevMonthDateMaxDays = 32 - new Date(currentDate.year, currentDate.month - 1, 32).getDate();

    for (let i = 0; i <= currentDate.currentMonthMaxDay / 7; i++) {
      weeks.push(new Array(7).fill(0).map((_, y) => y + (i * 7) + 1));
    }

    for (let i = 0; i < weeks.length; i++) {
      for (let j = 0; j < weeks[i].length; j++) {
        if (i === 0 && j < prevMonthDate.getDay()) {
          weeks[i][j] += prevMonthDateMaxDays - prevMonthDate.getDay();
        } else {
          weeks[i][j] -= prevMonthDate.getDay();

          if (weeks[i][j] > currentDate.currentMonthMaxDay) {
            weeks[i][j] %= currentDate.currentMonthMaxDay;
          }
        }
      }
    }

    return weeks;
  }, [currentDate])

  const addYear = (year = 1) => {
    setDate(new Date(date.setFullYear(date.getFullYear() + year)));
  }

  const addMonth = (month = 1) => {
    setDate(new Date(date.setMonth(date.getMonth() + month)));
  }

  const addDay = (day = 1) => {
    setDate(new Date(date.setDate(date.getDate() + day)));
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th onClick={() => addYear(-1)}>&lt;&lt;</th>
            <th onClick={() => addMonth(-1)}>&lt;</th>
            <th colSpan={3}>{dateNames.month[currentDate.month]} {currentDate.year}</th>
            <th onClick={() => addMonth()}>&gt;</th>
            <th onClick={() => addYear()}>&gt;&gt;</th>
          </tr>

          <tr>
            {dateNames.day.map((day, i) => <th key={i}>{day.substring(0, 3)}.</th>)}
          </tr>
        </thead>

        <tbody>
          {
            currentDateWeekArray.map((weeks, i) => (
              <tr key={'weeks' + i}>
                {
                  weeks.map((day, i) => (
                    <td
                      key={'days' + i}
                      className={currentDate.year === current.getFullYear() && day === current.getDate() ? 'currentDay' : ''}
                    >
                      {day}
                      {day < 10 && (<span onClick={() => alert('ttttt')} className='dot' />)}
                    </td>
                  ))
                }
              </tr>
            ))
          }
        </tbody>
      </table>
    </>
  )
}

export default Calendar