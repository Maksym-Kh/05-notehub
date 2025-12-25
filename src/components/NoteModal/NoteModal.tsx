import { useEffect } from 'react';
import css from './NoteModal.module.css'
import { createPortal } from 'react-dom'



interface Props{
  onClose: () => void;
  children: React.ReactNode; 
}


const modalRootElem = document.querySelector('#modal-root') as HTMLDivElement;

export default function Modal({ onClose, children }: Props) {
  
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    }
  }, [onClose]);

  return createPortal(
    <div
      className={css.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        {children}          
      </div>
    </div>,
    modalRootElem
  );
}