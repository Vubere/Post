import { Skeleton } from "antd"
import { ReactNode } from "react"


interface Props {
  title?: string,
  loading?: boolean,
  className?: string,
  children: ReactNode
}

export default function PageContainer({ title, loading, children, className }: Props) {

  if (loading) {
    return (
      <div className="w-full flex flex-col gap-4">
        <Skeleton />
        <Skeleton />
      </div>
    )
  }

  return (
    <div className={`text-black pt-[10px] px-4 pb-[60px] ${className}`}>
      {title && <h1 className="font-bold text-[16px] xs:text-[18px] sm:text-[21px] md:text-[24px] mb-4 sm:mb-8 leading-[110%]">{title}</h1>}
      {children}
    </div>
  )
}