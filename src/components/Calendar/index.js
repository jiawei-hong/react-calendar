import { useMemo, useState } from 'react'
import './index.scss'

function Calendar() {
  const [date, setDate] = useState(new Date());

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

      if (i === 0) {
        for (let i = 0; i < prevMonthDate.getDay(); i++) {
          weeks[0][i] += prevMonthDateMaxDays - prevMonthDate.getDay();
        }
      }
    }

    for (let i = 0; i < weeks.length; i++) {
      for (let j = i === 0 ? prevMonthDate.getDay() : 0; j < weeks[i].length; j++) {
        weeks[i][j] -= prevMonthDate.getDay();

        if (weeks[i][j] > currentDate.currentMonthMaxDay) {
          weeks[i][j] %= currentDate.currentMonthMaxDay;
        }
      }
    }

    return weeks;
  }, [currentDate])

  const setMonth = (asc = false) => {
    setDate(new Date(
      currentDate.year,
      currentDate.month + (asc ? 1 : -1),
      currentDate.date
    ))
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th colSpan={2} onClick={() => setMonth()}>&lt;</th>
            <th colSpan={3}>{currentDate.year}-{currentDate.month + 1}</th>
            <th colSpan={2} onClick={() => setMonth(true)}>&gt;</th>
          </tr>

          <tr>
            <th>星期日</th>
            <th>星期一</th>
            <th>星期二</th>
            <th>星期三</th>
            <th>星期四</th>
            <th>星期五</th>
            <th>星期六</th>
          </tr>
        </thead>

        <tbody>
          {
            currentDateWeekArray.map((weeks, i) => (
              <tr key={'weeks' + i}>
                {
                  weeks.map((x, i) => (
                    <td key={'days' + i}>{x}</td>
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