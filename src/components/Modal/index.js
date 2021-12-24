import React, { useEffect, useState } from "react";
import MODAL_STATUS from './status';
import './index.scss';
import { useIndexedDB } from "../../indexed-db";

function Modal(props) {
  const eventStore = useIndexedDB('events')
  const [events, setEvents] = useState([])
  const [data, setData] = useState({
    name: '',
    description: '',
    date: ''
  })

  useEffect(() => {
    getEventsData();

    setData({
      ...data,
      date: `${props.date.year}-${props.date.month}-${props.date.day}`
    });

    console.log(data);
  }, [
    props.date.year,
    props.date.month,
    props.date.day
  ]);

  const getEventsData = async () => {
    const eventData = await eventStore.getAll();

    setEvents(eventData.filter(x => x.date.indexOf(data.date) !== -1));
  }
  const changeModalVisible = () => props.changeModalVisible();
  const addEvent = async val => await eventStore.add(val)
  const updateEvent = async val => await eventStore.update(val);
  const destroyEvent = async val => await eventStore.destroy(val);

  return (
    <React.Fragment>
      {props.visible && (
        <div className="modal-background">
          <div className="modal">
            <div className="modal-header">
              <img
                className="modal-back"
                src="https://img.icons8.com/material-rounded/24/000000/assignment-return.png"
                onClick={() => props.changeModalStatus(MODAL_STATUS.SHOW)}
                alt="Cannot use..."
              />
              <h1>{props.date.year}-{props.date.month}-{props.date.day}</h1>

              <button className="btn-primary" onClick={() => props.changeModalStatus(MODAL_STATUS.ADD)}>新增事件</button>

              <span className="modal-close" onClick={() => changeModalVisible()}>&times;</span>
            </div>

            <div className="modal-body">
              {
                props.status === MODAL_STATUS.SHOW && (
                  events.map((event, i) => (
                    <div className="modal-list" key={i}>
                      <div className="modal-details">
                        <p>事件名稱:{event.name}</p>
                        <p>事件描述:{event.description}</p>
                      </div>
                      <div className="modal-opartion-buttons">
                        <button className="btn-warning" onClick={() => {
                          props.changeModalStatus(MODAL_STATUS.UPDATE)
                          setData(events[i])
                        }}>修改</button>
                        <button className="btn-danger" onClick={() => {
                          props.changeModalStatus(MODAL_STATUS.DESTROY)
                          setData(events[i])
                        }}>刪除</button>
                      </div>
                    </div>
                  ))
                )
              }

              {
                (props.status === MODAL_STATUS.ADD || props.status === MODAL_STATUS.UPDATE) && (
                  <React.Fragment>
                    <p>
                      <input type="text" placeholder="請輸入事件名稱" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} />
                    </p>

                    <p>
                      <input type="text" placeholder="請輸入事件描述" value={data.description} onChange={e => setData({ ...data, description: e.target.value })} />
                    </p>
                  </React.Fragment>
                )
              }

              {props.status === MODAL_STATUS.DESTROY && ('確定真的要刪除?')}
            </div>

            {
              props.status !== MODAL_STATUS.SHOW && (
                <div className="modal-footer">
                  <button onClick={() => changeModalVisible()}>取消</button>
                  <button className="btn-primary" onClick={() => {
                    switch (props.status) {
                      case MODAL_STATUS.ADD: {
                        addEvent(data);

                        break;
                      }

                      case MODAL_STATUS.UPDATE: {
                        updateEvent(data);

                        break;
                      }

                      default:
                        destroyEvent(data.id);
                    }

                    getEventsData();
                    props.changeModalStatus(MODAL_STATUS.SHOW);
                  }}>確定</button>
                </div>
              )
            }
          </div>
        </div>
      )}
    </React.Fragment>
  )
}

export default Modal