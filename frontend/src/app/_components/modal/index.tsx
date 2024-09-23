import { ReactNode } from "react";
import Button from "../general/button";
import Image from "next/image";
import cancel from "@/assets/icons/cancel.png";

interface ModalProp {
  title?: string,
  description?: string,
  children?: ReactNode,
  close?: () => void,
  open?: boolean,
  twHeight?: string,
  twWidth?: string,
  className?: string,
}

function Modal({ title, children, close, open, twHeight, twWidth, className }: ModalProp) {
  const height = twHeight || "h-[300px]";
  const width = twWidth || "w-[400px]";

  return (
    open ? (
      <div className={`fixed top-[50%] left-[50%] h-[100vh] rounded-xl  w-[100vw] translate-y-[-50%] translate-x-[-50%] max-h-[100vh] mx-auto px-2 sm:px-4 bg-[#fff] text-black overflow-y-auto py-4 pb-10 z-[20] ${className} ${height} ${width}`}>
        {title && (<p className="pb-4 border-b border-1 text-[16px] xs:text-[18px] sm:text-[21px] font-bold mb-4 ">{title}</p>)}

        <Button className="!rounded-full !ml-auto !w-[45px] !h-[45px] px-2 !border-none !outline-none !bg-transparent absolute right-[10px] top-[10px]" theme="light" onClick={close}>
          <div className="w-full h-full relative overflow-show">
            <Image src={cancel} fill alt="cancel" objectFit="contain" objectPosition="center" />
          </div>
        </Button>
        {children}
      </div>) : null
  );
}
interface ConfirmModal extends ModalProp {
  onConfirm: () => void
}
Modal.Confirm = ({ description, children, onConfirm, close, ...modalProps }: ConfirmModal) => {

  return (
    <Modal {...modalProps} close={close}>
      {description && (<p className="pb-4 border-b border-1 text-[12px] xs:text-[14px] sm:text-[16px] font-bold mb-4 ">{description}</p>)}
      {children}
      <div className="flex justify-end gap-2">
        <Button className="!max-w-[100px]" theme="light" onClick={close}>
          Cancel
        </Button>
        <Button className="!max-w-[120px]" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </Modal>
  )
}


export default Modal;