import { ReactNode } from "react";

interface Props {
  className?: string;
  text?: string;
  children?: ReactNode;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  loading?: boolean;
}

export default function Button(props: Props) {
  return (
    <button className={`disabled:bg-[#0004] bg-[#0009] hover:bg-[#000d] rounded-[6px] text-white w-full h-[35px] text-[17px] uppercase font-medium  ${props.className ?? ""}`} type={props.type || "submit"} disabled={props.disabled}>
      {props.children || props.text}
      {props.loading && <span className="text-white text-[32px] leading-[16px] h-full pr-2 animate-ping ">...</span>}
    </button>
  )
} 