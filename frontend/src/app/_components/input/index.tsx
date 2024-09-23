import { nanoid } from "nanoid";
import { useEffect, useMemo, useRef, useState } from "react";
import { useWatch } from "react-hook-form"
import Select from "./select";
import MultiInput from "./multi-input";
import { InputProps } from "@/app/_lib/type";

export default function Input(props: InputProps) {

  const {
    state,
    label,
    type,
    required,
    twHeight,
    defaultValue,
    ...inputProps
  } = props
  const {
    formState,
    register,
    control
  } = state;
  const containerHeight = twHeight || "h-[40px]";
  const [extraDisplay, setExtraDisplay] = useState<JSX.Element | null>(null);
  const extraDisplayRef = useRef<HTMLDivElement | null>(null);
  const {
    name,
    className,
    placeholder,
    ...overideHookForm
  } = inputProps
  const errorMessage = formState.errors[name]?.message;
  const value = useWatch({
    control,
    name
  });
  const hookFormInputProps = register(name, { required });
  const containerRef = useRef<HTMLElement | null>(null);
  const containerId = useMemo(() => nanoid().replace(/([.#])/g, '\\$1'), []);
  useEffect(() => {
    if (defaultValue && state.setValue)
      state.setValue(defaultValue);
  }, [defaultValue])

  const renderInput = (className: string, type?: string,) => {
    switch (type) {
      case "text": {
        return (
          <input {...inputProps} className={className + " " + (inputProps.className || "")} {...hookFormInputProps} {...overideHookForm} id={name} />
        )
      }
      case "select": {
        return <Select value={value} {...props} onHookChange={hookFormInputProps?.onChange} className={className + " " + (inputProps.className || "")} extraProps={{ extraDisplayRef, setExtraDisplay }} />
      }
      case "multi-input": {
        return <MultiInput value={value} {...props} className={className + " " + (inputProps.className || "")} extraProps={{ extraDisplayRef, setExtraDisplay }} />
      }
      case "textarea": {
        return (
          <textarea {...inputProps} className={className + " resize-none " + (inputProps.className || "")} {...hookFormInputProps} {...overideHookForm} id={name} />
        )
      }
      default: {
        return <input type={type} {...inputProps} className={className + " " + (inputProps.className || "")} {...hookFormInputProps} {...overideHookForm} id={name} />
      }
    }
  }

  useEffect(() => {
    if (window?.document && containerRef.current) {

      const showInput = () => {
        const containerEl = containerRef.current;
        if (containerEl?.classList.contains("hide")) {
          containerEl?.classList?.remove("hide")
        }
      }

      const handleClick = (e: any) => {
        const clickedEl: HTMLElement = e.target;
        const containerEl = containerRef.current;
        if (containerEl !== null && (containerEl?.contains(clickedEl) || [containerEl.id].includes(clickedEl.id))) {
          if (containerEl?.classList.contains("hide")) {
            containerEl?.classList?.remove("hide")
          }
          return;
        } else {
          if (!value && !containerEl?.classList?.contains("hide")) {
            containerEl?.classList?.add("hide")

          }
        }
      }
      if (value) {
        showInput()
      }
      document.addEventListener("click", handleClick)
      return () => {
        document.removeEventListener("click", handleClick)
      }
    }
  }, [value, containerRef]);

  return (
    <div className="relative w-full h-auto">
      <div className={`${containerHeight} w-full border border-1 border-black border-opacity-70 px-2 py-1 text-sm text-black flex flex-col items-center justify-center relative overflow-hidden hide gap-0 [&_label]:text-[8px] [&.hide_label]:text-sm [&:hover_input]:opacity-100 [&.hide_input]:opacity-0 [&.hide_input]:absolute  [&:hover_input]:opacity-100 [&:hover_input]:static [&.hide_input]:z-[-3] [&.hide:hover_input]:z-[2] [&:hover_input]:block  [&.hide_.input]:z-[-3] [&.hide:hover_.input]:z-[2] [&:hover_.input]:block [&:hover_label]:text-[8px] [&:hover_label]:leading-[100%] `} id={containerId} ref={containerRef as any}>
        {label && <label htmlFor={name} className="text-sm w-full p-0 m-0 leading-[100%] !h-auto !pb-0 py-0 " style={{ paddingBottom: 0 }}>{label}{required && <sup className="ml-1 text-[8px] leading-[20%] text-red relative">*</sup>}</label>}
        {renderInput("placeholder:text-sm placeholder:text-opacity-60  block w-[100%] min-w-full focus:outline-none focus:border-none active:outline-none active:border-none hover:outline-none hover:border-none p-0 m-0", type)}
      </div>
      {errorMessage && <p className="text-xs leading-[105%] pt-1 mx-1 text-red-300">{errorMessage as string}</p>}
      <div ref={extraDisplayRef} className="hidden">{extraDisplay}</div>
    </div>
  )
}


export function NormalInput(props: Omit<InputProps, "state">) {

  const {
    label,
    type,
    value,
    defaultValue,
    required,
    twHeight,
    ...inputProps
  } = props
  const extraDisplayRef = useRef<HTMLDivElement | null>(null);

  const [extraDisplay, setExtraDisplay] = useState();
  const containerHeight = twHeight || (type === "textarea" ? "h-[90px]" : "h-[40px] flex flex-col items-center justify-center gap-1 py-1");


  const {
    name,
    className,
    placeholder,
    extraProps,
    ...overideHookForm
  } = inputProps;

  const containerRef = useRef<HTMLElement | null>(null);
  const containerId = useMemo(() => nanoid().replace(/([.#])/g, '\\$1'), []);

  const renderInput = (className: string, type?: string,) => {
    switch (type) {
      case "text": {
        return (
          <input value={value} {...inputProps} className={className + " " + (inputProps.className || "")} {...overideHookForm} {...(extraProps || {})} id={name} />
        )
      }
      case "textarea": {
        return (
          <textarea value={value} {...inputProps} className={className + " leading-[105%] resize-none h-[67px] min-h-[67px] " + (inputProps.className || "")} {...overideHookForm} {...(extraProps || {})} id={name} />
        )
      }
      case "select": {
        return <Select value={value} {...props} className={className + "  " + (inputProps.className || "")} {...overideHookForm} {...(extraProps || {})} extraProps={{ extraDisplayRef, setExtraDisplay }} />

      }
      default: {
        return <input value={value} type={type} {...inputProps} className={className + " " + (inputProps.className || "")} {...overideHookForm} {...(extraProps || {})} id={name} />
      }
    }
  }

  useEffect(() => {
    if (window?.document && containerRef.current) {

      const showInput = () => {
        const containerEl = containerRef.current;
        if (containerEl?.classList.contains("hide")) {
          containerEl?.classList?.remove("hide")
        }
      }

      const handleClick = (e: any) => {
        const clickedEl: HTMLElement = e.target;
        const containerEl = containerRef.current;
        if (containerEl !== null && (containerEl?.contains(clickedEl) || [containerEl.id].includes(clickedEl.id))) {
          if (containerEl?.classList.contains("hide")) {
            containerEl?.classList?.remove("hide")
          }
          return;
        } else {
          if (!value && !containerEl?.classList?.contains("hide")) {
            containerEl?.classList?.add("hide")

          }
        }
      }
      if (value) {
        showInput()
      }
      document.addEventListener("click", handleClick)
      return () => {
        document.removeEventListener("click", handleClick)
      }
    }
  }, [value, containerRef]);

  return (
    <div className="relative w-full h-auto">
      <div className={`${containerHeight} w-full border border-1 border-black border-opacity-70 px-2 py-1 text-sm text-black flex flex-col items-center justify-center relative overflow-hidden hide gap-0 [&_label]:text-[8px] [&.hide_label]:text-sm [&:hover_input]:opacity-100 [&.hide_input]:opacity-0 [&.hide_input]:absolute  [&:hover_input]:opacity-100 [&:hover_input]:static [&.hide_input]:z-[-3] [&.hide:hover_input]:z-[2] [&:hover_input]:block  [&.hide_.input]:z-[-3] [&.hide:hover_.input]:z-[2] [&:hover_.input]:block [&:hover_label]:text-[8px] [&:hover_label]:leading-[100%] `} id={containerId} ref={containerRef as any}>
        {label && <label htmlFor={name} className="text-sm w-full p-0 m-0 leading-[100%] !h-full !pb-0 py-0 " style={{ paddingBottom: 0 }}>{label}{required && <sup className="ml-1 text-[8px] leading-[20%] text-red relative">*</sup>}</label>}
        {renderInput("placeholder:text-sm placeholder:text-opacity-60  block w-[100%] !bg-transparent min-w-full max-w-full focus:outline-none focus:border-none active:outline-none active:border-none hover:outline-none hover:border-none p-0 m-0", type)}
      </div>
      {/*   {errorMessage && <p className="text-xs leading-[105%] pt-1 mx-1 text-red-300">{errorMessage as string}</p>} */}
      <div ref={extraDisplayRef} className="hidden">{extraDisplay}</div>

    </div>
  )
}
