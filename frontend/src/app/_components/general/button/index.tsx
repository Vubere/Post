import { MouseEventHandler, ReactNode } from "react";

interface Props {
  className?: string;
  text?: string;
  children?: ReactNode;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  loading?: boolean;
  theme?: "dark" | "light" | "danger";
  adjustSize?: "medium" | "small"
}

export default function Button(props: Props) {
  return (
    <button className={`disabled:bg-[#0004] bg-[#0009] hover:bg-[#000d] text-white w-full h-[35px] text-[17px] uppercase font-medium [&.light]:bg-[#fff9] [&.light]:text-black [&.light]:border [&.light]:border-1 [&.light]:border-[#0009] [&.light]:disabled:bg-[#0002] [&.danger]:bg-[#f66] [&.danger]:text-white [&.danger]:border [&.danger]:border-1 [&.danger]:border-[#fff1] [&.danger]:disabled:bg-[#f66b] [&.medium]:text-[14px] [&.medium]:h-[24px] [&.small]:text-[11px] [&.small]:h-[18px] ${props.adjustSize ?? ""} ${props.theme ?? ""}  ${props.className ?? ""}`} type={props.type || "submit"} disabled={props.disabled} onClick={props?.onClick}>
      {props.children || props.text}
      {props.loading && <span className={`text-white text-[32px] [&.medium]:text-[24px] [&.small]:text-[18px] leading-[16px] h-full pr-2 animate-ping ${props.theme === "light" ? "text-[#000]" : ""} ${props.adjustSize ?? ""}`}>...</span>}
    </button>
  )
} 