import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import usePortal from '../utils/usePortal';

const Modal = ({
  open, children, close,
}) => {
  const target = usePortal('modal');

  return createPortal(
    <div className={`fixed flex items-end sm:items-center justify-center z-50 top-0 left-0 w-full h-full transition-opacity ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
      <button
        type="button"
        onClick={close}
        className="fixed cursor-default appearance-none focus:outline-none z-0 top-0 left-0 w-full h-full bg-black bg-opacity-20"
      >
      </button>
      <ModalContent close={close} open={open}>
        {children}
      </ModalContent>
    </div>, target,
  );
};

const ModalContent = ({ open, close, children }) => {
  const element = useRef();
  const onKeyDown = (e) => {
    if (e.key !== 'Escape') return;
    if (open) return;
    e.preventDefault();
    e.stopPropagation();
    close();
  };
  useEffect(() => {
    if (open && element.current) {
      element.current.scrollTo(0, 0);
    }
  }, [open]);
  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);
  return (
    <div
      style={{
        maxHeight: 'calc(100% - 128px)',
      }}
      ref={element}
      className={`sm:m-4 relative w-full max-w-md p-6 overflow-x-hidden overscroll-y-auto text-left bg-gray-800 ring-1 ring-white ring-opacity-20 shadow-xl rounded-t-2xl sm:rounded-2xl transform transition-transform ${open ? 'sm:scale-100 translate-y-0' : 'sm:scale-95 sm:translate-y-0 translate-y-full'}`}
    >
      {children}
    </div>
  );
};

export const Title = ({ children }) => (
  <h3 className="text-lg sticky -top-6 -mt-6 pt-6 pb-4 font-medium leading-6 modal-title z-20">{children}</h3>
);

export const Actions = ({ children }) => (
  <div className={`sticky -bottom-6 -mb-6 pb-6 pt-4 grid grid-cols-1 sm:grid-cols-${children.length || 1} gap-3 modal-actions`}>{children}</div>
);

export default Modal;
