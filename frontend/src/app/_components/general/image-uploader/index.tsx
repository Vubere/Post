"use client";
import Image from "next/image";
import camera from "@/assets/icons/camera.png";
import { useCallback, useRef } from "react";
import Button from "../button";
import { useUploadThing } from "@/app/api/uploadthing/hooks";
import { notification, Spin } from "antd";
import { useDropzone } from "@uploadthing/react";
import deleteIcon from "@/assets/icons/delete.png";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

type Props = {
  setUrl: (url: string) => void;
  url: string | undefined;
  className?: string;
  text?: string,
  removeLink: () => void,
  onUrlChange?: (url: string) => void,
  showIsDraggable?: boolean,
  defaultImage?: string | StaticImport
}

export default function ImageUploader({ url, setUrl, className, text, removeLink, showIsDraggable, onUrlChange, defaultImage }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { startUpload, isUploading } = useUploadThing(
    "imageUploader",
    {
      onClientUploadComplete: (res) => {
        setUrl(res[0].url);
        if (onUrlChange) {
          onUrlChange(res[0].url);
        }
      },
      onUploadError: () => {
        notification.error({ message: "error uploading image!" });
      },
    },
  );
  const onDrop = useCallback((acceptedFiles: File[]) => {
    startUpload(acceptedFiles);
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  function handleImageSelection(v: any) {
    const target: HTMLInputElement = v.target;
    const files = target?.files;
    const fileList = [files?.[0]] as unknown as File[];
    if (fileList && fileList[0] && fileList[0].type.startsWith("image")) {
      startUpload(fileList);
    } else {
      notification.error({
        message: "invalid file format, only images are allowed!"
      })
    }
  }

  const onClick = () => {
    if (inputRef.current) {
      console.log(inputRef.current)
      inputRef.current.click();
    }
  }
  const onRemoveClick = () => {
    if (removeLink) return removeLink();
    setUrl("")
  }
  const imageUrl = url || defaultImage;
  console.log(imageUrl)
  return (
    <div className={"relative [&:hover_.image-uploader-delete]:block py-[30px] " + className}>
      {url && <Button className="image-uploader-delete absolute right-[5px] top-[5px] !w-[25px] !h-[25px] flex !px-0 items-center justify-center hidden" onClick={onRemoveClick} theme="light" adjustSize="small">
        <div className="min-w-full min-h-full flex items-center justify-center">
          <Image alt="del" src={deleteIcon} width={15} height={15} />
        </div>
      </Button>}

      <div {...getRootProps()} className={`bg-transparent outline-none border-none w-full h-[150px] relative rounded-[10px] overflow-hidden cursor-pointer [&:hover_.text]:bg-[#fff7] ${getRootProps().className} ${className}`} onClick={onClick} aria-disabled={isUploading}>
        {!!imageUrl && <Image fill src={imageUrl} objectFit="cover" objectPosition="center" alt="image-uploader" className="absolute z-[0]" />}
        {!imageUrl && <div className="absolute top-0 left-0 h-full w-full bg-[#e7e7e7] z-[0]" />}
        <input hidden {...getInputProps()} />
        <input hidden type="file" accept="image/*" ref={inputRef} name="image-uploader" onChange={handleImageSelection} />
        <div className="absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] flex flex-col items-center gap-0 z-[1] text px-3 py-1 rounded-xl">
          {
            isUploading && (
              <div className="absolute left-0 top-0 w-full h-full bg-[#fff] bg-opacity-20 z-[2] flex items-center justify-center text-black animate-ping blur-[4px]">
                ...
              </div>
            )
          }
          <div className="relative w-[25px] h-[25px] xs:w-[30px] xs:h-[30px]">
            <Image src={camera} alt="img" fill objectFit="contain" objectPosition="center" />
          </div>
          {text && <p className="text-[e7e7e7] text-[11px] sm:text-[14px]">{text}{showIsDraggable && <><br /><span className="text-[11px] text-[#37373788] block mx-auto italic w-full text-center">(drag and drop)</span></>}</p>}
        </div>
        {
          isDragActive && (
            <div className="absolute left-0 top-0 w-full h-full bg-[#fff] bg-opacity-70 z-[1] flex items-center justify-center text-[10px] xs:text-[13px] sm:text-[16px]">
              <p className="animate-ping">drop</p>
            </div>
          )
        }
      </div>


    </div>

  )
}