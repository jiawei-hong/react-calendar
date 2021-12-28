import React, { useMemo, useState } from 'react'
import Modal from '../Modal'
import MODAL_STATUS from '../Modal/status';
import './index.scss'

function Calendar() {
  const [date, setDate] = useState(new Date());
  const current = new Date();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalStatus, setModalStatus] = useState(MODAL_STATUS.SHOW);
  const [modalData, setModalData] = useState({
    year: current.getFullYear(),
    month: current.getMonth() + 1,
    day: current.getDate()
  })
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

  const currentMonthArray = useMemo(() => {
    let currentMonth = [];
    const prevMonthDate = new Date(currentDate.year, currentDate.month, 1);
    const prevMonthDateMaxDays = 32 - new Date(currentDate.year, currentDate.month - 1, 32).getDate();

    for (let i = 0; i <= currentDate.currentMonthMaxDay / 7; i++) {
      currentMonth.push(new Array(7).fill(0).map((_, y) => {
        return {
          year: currentDate.year,
          month: currentDate.month + 1,
          day: y + (i * 7) + 1
        }
      }));
    }

    for (let i = 0; i < currentMonth.length; i++) {
      for (let j = 0; j < currentMonth[i].length; j++) {
        if (i === 0 && j < prevMonthDate.getDay()) {
          currentMonth[i][j].month -= 1;
          currentMonth[i][j].day += prevMonthDateMaxDays - prevMonthDate.getDay();

          if (currentMonth[i][j].month === 0) {
            currentMonth[i][j].month = 12;
            currentMonth[i][j].year -= 1;
          }
        } else {
          currentMonth[i][j].day -= prevMonthDate.getDay();

          if (currentMonth[i][j].day > currentDate.currentMonthMaxDay) {
            currentMonth[i][j].month += 1;
            currentMonth[i][j].day %= currentDate.currentMonthMaxDay;

            if (currentMonth[i][j].month > 12) {
              currentMonth[i][j].year += 1;
              currentMonth[i][j].month %= 12;
            }
          }
        }
      }
    }

    return currentMonth;
  }, [currentDate])

  const addYear = (year = 1) => {
    setDate(new Date(date.setFullYear(date.getFullYear() + year)));
  }

  const addMonth = (month = 1) => {
    setDate(new Date(date.setMonth(date.getMonth() + month)));
  }

  const changeModalData = (year, month, day) => {
    setModalData({ year, month, day })
  };

  const changeModalVisible = () => {
    setModalVisible(!modalVisible);
  }

  const changeModalStatus = status => {
    setModalStatus(status);
  }

  return (
    <React.Fragment>
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
            currentMonthArray.map((weeks, i) => (
              <tr key={'weeks' + i}>
                {
                  weeks.map((date, i) => (
                    <td
                      onClick={() => {
                        changeModalVisible();
                        changeModalData(date.year, date.month, date.day);
                      }}
                      key={'days' + i}
                      className={
                        current.getFullYear() === date.year &&
                          current.getMonth() + 1 === date.month &&
                          current.getDate() === date.day ? 'currentDay' : ''
                      }
                    >
                      {date.day}
                    </td>
                  ))
                }
              </tr>
            ))
          }
        </tbody>
      </table>

      <Modal
        visible={modalVisible}
        date={modalData}
        status={modalStatus}
        changeModalVisible={changeModalVisible}
        changeModalStatus={changeModalStatus}
      />
    </React.Fragment>
  )
}

export default Calendar