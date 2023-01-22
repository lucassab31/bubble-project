import style from './Modal.module.css'
import CloseIcon from "../../assets/svg/close-icon.svg"
import { useRef } from 'react';

export default function Modal({ setShowModal, children }) {
    const modal = useRef();
    const overlay = useRef();

    const hideModal = () => {
        overlay.current.classList.add(style["modal-overlay--hidden"]);
        modal.current.classList.add(style["modal--hidden"]);
        setTimeout(() => setShowModal(false), 550);
    }

    return (
        <>
            <div ref={overlay} onClick={hideModal} className={style["modal-overlay"]}></div>
            <div ref={modal} className={style["modal"]}>
                {children}
                <div onClick={hideModal} className={style["close-icon"]}>
                    <img src={CloseIcon} alt="icône fermeture" />
                </div>
            </div>
        </>
    )
}
