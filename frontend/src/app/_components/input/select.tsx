import { MutableRefObject, SetStateAction, useCallback, useEffect, useRef, useState, Dispatch } from "react";
import { UseFormRegister, UseFormGetValues, FormState } from "react-hook-form";
import cancel from "@/assets/icons/cancel.png";
import Image from "next/image";
import { InputProps, Option } from "@/app/_lib/type";


export default function Select(props: InputProps) {
  const { options, value, className, onChange, state, name, required, extraProps } = props;
  const { register } = state;
  const [showSelect, setShowSelect] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const optionsRef = useRef<HTMLDivElement>();
  const extraDisplayRef: MutableRefObject<HTMLDivElement | null> = extraProps?.extraDisplayRef;
  const setExtraDisplay: Dispatch<SetStateAction<JSX.Element | null>> = extraProps?.setExtraDisplay;

  const onHookChange = useCallback(register(name, { required }).onChange, [register, required, name]);

  const handleSetValue = (val: string | number, o: Option) => {
    if ("multiSelect" in props) {
      const newValue = [...(props.value as (string | number)[]), val];
      onChange?.(newValue, o);
      onHookChange?.({ target: { value: newValue, name } });

    } else {
      onChange?.(val, o);
      onHookChange?.({ target: { value: val, name } });
    }
    extraDisplayRef.current && extraDisplayRef.current.classList.add("hidden");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, val: string | number, o: Option) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSetValue(val, o);
    }
  };

  const isValue = !!(Array.isArray(value) ? value.length : value);
  const remove = (val: string | number) => {
    if (Array.isArray(value)) {
      const newVal = value.filter(v => v !== val)
      onChange?.(newVal);
      onHookChange?.({ target: { value: newVal, name } });
    } else {
      onChange?.(null);
      onHookChange?.({ target: { value: null, name } })
    }
  }
  const isSelected = (val: string | number) => {
    return (Array.isArray(value) && value.includes(val)) || val === value;
  }
  const getLabel = (val: string | number) => {
    return (Array.isArray(options) && options.find(({ value }) => value == val)?.label) || "";
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
        {options?.map((val) => {
          const selected = value?.includes(val.value);
          const handleRmv = () => remove(val.value);
          const handleSelct = () => handleSetValue(val.value, val);
          const handleKD = (event: React.KeyboardEvent<HTMLDivElement>) => handleKeyDown(event, val.value, val);
          return (
            <div
              key={val.value}
              tabIndex={0}
              role="button"
              onKeyDown={handleKD}
              className={`px-[5px] w-full outline-none hover:bg-[#aaaaff] flex items-center justify-between rounded-[4px] ${selected && "bg-[#aaaaff]"}`}
            >
              <span role="button" className="inline-block w-full truncate h-full" onClick={handleSelct}>
                {val.label}
              </span>
              {selected &&
                <button className="bg-[#fff6] rounded-full ml-2 max-w-[20px]" onClick={handleRmv}><Image src={cancel} alt="" width={20} height={20} /></button>}
            </div>
          )
        })}
      </div>);
      setExtraDisplay(dVal);
    }
  }, [extraDisplayRef, value])

  return (
    <div className={"input relative h-auto w-full rounded-[4px] min-h-[30px]" + className} ref={containerRef} role="input">
      {isValue ? <DisplayValue value={value} remove={remove} getLabel={getLabel} /> : <div className="text-[#37373766] h-full">{props.placeholder || "select"}</div>}
    </div>
  );
}

const DisplayValue = ({ value, remove, getLabel }: { value: string | number | (string | number)[] | undefined, remove: (value: string | number) => void, getLabel: (value: string | number) => string | number }) => {

  if (Array.isArray(value)) {
    return (<>
      {value.map(val => (<div key={val} className="inline-block px-1 py-1 rounded-[4px] text-[14px]">{getLabel(val)} <button className="bg-[#fff6] rounded-full ml-2" onClick={() => remove(val)}><Image src={cancel} alt="" width={20} height={20} /></button></div>))}
    </>);
  }
  return (
    <div className="w-full text-[14px]">{getLabel(value || "")}</div>
  )
}
