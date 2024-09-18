import { Skeleton } from "antd"
import { ReactNode } from "react"


interface Props {
  title?: string,
  loading?: boolean,
  children: ReactNode
}

export default function PageContainer({ title, loading, children }: Props) {

  if (loading) {
    return (
      <>
        <Skeleton />
        <Skeleton />
      </>
    )
  }

  return (
    <div className="text-black px-4 pb-[60px]">
      {title && <h1 className="font-bold text-[16px] xs:text-[18px] sm:text-[21px] md:text-[24px] mb-4 sm:mb-8">{title}</h1>}
      {children}
    </div>
  )
}