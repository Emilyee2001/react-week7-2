import { useRef, useEffect } from "react"
import { useSelector } from "react-redux";
import { Toast as BsToast } from "bootstrap";
import { useDispatch } from "react-redux";

import { removeToast } from "../../redux/slice/toastSlice";

export default function Toast() {

  const dispatch = useDispatch();
  const toastRefs = useRef({});
  const messages = useSelector(state => state.toast.messages);

  useEffect(() => {
    messages.map(message => {
      const messageEl = toastRefs.current[message.id];
      if (messageEl) {
        const toastInstance = new BsToast(messageEl, {
          delay: 2000
        });
        toastInstance.show();
        setTimeout(() => {
          dispatch(removeToast(message.id));
        }, 3000);
      }
    })
  }, [messages]);

  const handleRemoveToast = (id) => {
    dispatch(removeToast(id));
  }

  return (<>
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1000 }}>
      {messages.map(message => (
        <div ref={(el) => toastRefs.current[message.id] = el} key={message.id} className="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div className={`toast-header text-white ${message.status === 'success' ? 'bg-success' : 'bg-danger'}`}>
            <strong className="me-auto">訊息</strong>
            <button
              onClick={() => { handleRemoveToast(message.id) }}
              type="button"
              className="btn-close"
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-body">{message.text}</div>
        </div>
      ))}
    </div>

  </>)
}