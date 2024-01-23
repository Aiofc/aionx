import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import MaxIcon from '../icons/max.svg';
import MinIcon from '../icons/min.svg';
import CloseIcon from '../icons/close.svg';

interface ModalProps {
  title: string;
  children?: any;
  actions?: React.ReactNode[];
  defaultMax?: boolean;
  footer?: React.ReactNode;
  onClose?: () => void;
}

export function Modal(props: ModalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        props.onClose?.();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isMax, setMax] = useState(!!props.defaultMax);

  return (
    <div className="modal-container box-shadow-card-shadow bg-white rounded-12 w-80vw max-w-900px min-w-300px animation-slide-in ease-300ms">
      <div className="flex items-center justify-between border-b-border-in-light">
        <div className="font-bold text-16">{props.title}</div>

        <div className="flex">
          <div className=" cursor-pointer" onClick={() => setMax(!isMax)}>
            {isMax ? <MinIcon /> : <MaxIcon />}
          </div>
          <div className="flex" onClick={props.onClose}>
            <CloseIcon />
          </div>
        </div>
      </div>

      <div className="max-h-40vh overflow-auto">{props.children}</div>

      <div className="flex justify-self-end">
        {props.footer}
        <div className=" mr-20">
          {props.actions?.map((action, i) => (
            <div key={i} className="mr-20">
              {action}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function showModal(props: ModalProps) {
  const div = document.createElement('div');
  div.className = 'modal-mask';
  document.body.appendChild(div);

  const root = createRoot(div);
  const closeModal = () => {
    props.onClose?.();
    root.unmount();
    div.remove();
  };

  div.onclick = (e) => {
    if (e.target === div) {
      closeModal();
    }
  };

  root.render(<Modal {...props} onClose={closeModal}></Modal>);
}

export function showImageModal(img: string) {
  showModal({
    title: 'Image Preview',
    children: (
      <div>
        <img
          src={img}
          alt="preview"
          style={{
            maxWidth: '100%',
          }}
        ></img>
      </div>
    ),
  });
}
