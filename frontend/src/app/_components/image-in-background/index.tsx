import Image, { StaticImageData } from "next/image"
import { ReactNode } from "react"


interface iIBgProps {
  children: ReactNode,
  src: StaticImageData,
  className: string,

}

export default function BackgroundImg({ children, src, className = '' }: iIBgProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="z-[-1] absolute min-w-[100%] w-full h-full">
        <div className={`relative  w-full h-full `}>
          <Image src={src} alt="" fill objectFit="cover" objectPosition="center" />
        </div>
      </div>
      {children}
    </div>
  )
}