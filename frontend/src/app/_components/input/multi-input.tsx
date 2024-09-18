import { Dispatch, MutableRefObject, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { UseFormRegister, UseFormGetValues, FormState, useWatch } from "react-hook-form";
import cancel from "@/assets/icons/cancel.png";
import Image from "next/image";
import Button from "../general/button";
import { InputProps } from "@/app/_lib/type";


export default function MultiInput(props: InputProps) {
  const { value, className, onChange, state, name, required, extraProps } = props;
  const { register, } = state;
  const [inputVal, setInputVal] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const optionsRef = useRef<HTMLDivElement>();
  const extraDisplayRef: MutableRefObject<HTMLDivElement | null> = extraProps?.extraDisplayRef;
  const setExtraDisplay: Dispatch<SetStateAction<JSX.Element | null>> = extraProps?.setExtraDisplay;

  const onHookChange = useCallback(register(name, { required }).onChange, [register, required, name]);

  const handleSetValue = (val: string | number) => {
    if (val) {
      const newValue = [...(value || []), val];
      onChange?.(newValue);
      onHookChange?.({ target: { value: newValue, name } });
      setInputVal("");
    }
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>, val?: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSetValue(val ?? inputVal);
    }
  };

  const remove = (val: string | number) => {
    if (Array.isArray(value)) {
      const newVal = value.filter(v => v !== val);
      onChange?.(newVal);
      onHookChange?.({ target: { value: newVal, name } });
    }
  }


  const handleAddToValue = () => {
    handleSetValue(inputVal);
  }

  useEffect(() => {
    const container = containerRef.current;
    const extraDisplayDiv = extraDisplayRef.current;
    if (container && extraDisplayDiv) {
      extraDisplayDiv.className = "hidden w-full h-auto max-h-[300px] overflow-y-auto bg-white rounded-b-[8px] px-2 py-1 absolute top-[100%] left-0 shadow-xl z-[19]";
      const handleDocumentClick = (e: any) => {
        const target = e.target as HTMLElement;

        if (!(container.contains(target)) && !(extraDisplayDiv.contains(target))) {
          const isShowing = !extraDisplayDiv.classList.contains("hidden");
          if (isShowing) {
            extraDisplayDiv.classList.add("hidden");
          }
        }
      }
      const handleContainerClick = (e: any) => {

        if (extraDisplayDiv.classList.contains("hidden")) {
          extraDisplayDiv.classList.remove("hidden");
        } else {
          extraDisplayDiv.classList.add("hidden");
        }
      }
      container.addEventListener("click", handleContainerClick);
      document.addEventListener("click", handleDocumentClick);
      return () => {
        container.removeEventListener("click", handleContainerClick)
        document.removeEventListener("click", handleDocumentClick);
      }
    }
  }, [containerRef.current, optionsRef.current]);

  useEffect(() => {
    const displayDiv = extraDisplayRef.current;
    if (displayDiv && setExtraDisplay) {
      const dVal = (<div className={"flex flex-col gap-1 w-full h-auto"}>
        {props?.multiTextOptions?.map((val) => {
          const selected = value?.includes(val);
          const handleClck = () => remove(val);
          const handleSelct = () => handleSetValue(val);
          const handleKD = (event: React.KeyboardEvent<HTMLElement>) => handleKeyDown(event, val);
          return (
            <div
              key={val}
              tabIndex={0}
              role="button"
              onKeyDown={handleKD}
              className={`px-[5px] w-full outline-none hover:bg-[#aaaaff] flex items-center justify-between rounded-[4px] ${selected && "bg-[#aaaaff]"}`}
            >
              <span role="button" className="inline-block w-full truncate h-full" onClick={handleSelct}>
                {val}
              </span>
              {selected &&
                <button className="bg-[#fff6] rounded-full ml-2 max-w-[20px]" onClick={handleClck}><Image src={cancel} alt="" width={20} height={20} /></button>}
            </div>
          )
        })}
      </div>);
      setExtraDisplay(dVal);
    }
  }, [extraDisplayRef, value])

  return (
    <div className={"input relative  w-full rounded-[4px] " + className} ref={containerRef} role="input" >
      <div className="flex gap-1">
        <input value={inputVal} onChange={({ target: { value } }) => setInputVal(value)} className="w-full max-h-[30px] border-none outline-none focus:border-none focus:outline-none bg-transparent " onKeyDown={handleKeyDown} placeholder="enter value" />
        <Button onClick={handleAddToValue} className=" !w-[60px] text-[11px] !h-[25px]" theme="light" adjustSize="small">Add +</Button>
      </div>
      {!!value?.length && <div className={"flex flex-wrap  w-full bg-[#fff]"}>
        {value?.map((val: string, i: number) => {
          const handleClck = () => remove(val);
          return (
            <span key={i}
              tabIndex={0}
              role="button"
              className={`m-1 rounded-xl py-1 px-2 inline-flex items-center justify-center outline-none bg-[#aaaaff] text-[11px] placeholder:text-[#e7e7e7bb]`}>{val}<button className="bg-[#fff6] rounded-full ml-2" onClick={handleClck}><Image src={cancel} alt="" width={20} height={20} /></button></span>
          )
        })}
      </div>}

    </div>
  );
}

