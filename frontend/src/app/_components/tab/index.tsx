import { Empty, Skeleton } from "antd";
import { ReactNode, useMemo, useState } from "react"
import { isEmpty } from "lodash";
import document from "@/assets/icons/document.svg";
import Image from "next/image";

interface Props {
  items: {
    title: string,
    content: ReactNode,
    loading: boolean
  }[],
  className?: string,
  loading?: boolean
}


export default function Tab({ items, className, loading }: Props) {
  const headers = useMemo(() => items.map(v => v.title) || [], [items]);
  const [currentTab, setCurrentTab] = useState(headers[0]);
  const currentDisplay = useMemo(() => items.find(item => item.title === currentTab), [currentTab, loading]);

  const onHeaderClick = (title: string) => {
    setCurrentTab(title);
  }

  return (
    <div className={"flex flex-col gap-2 " + className}>
      <div className="flex flex-row gap-[1px] w-full max-w-[100%] overflow-x-auto">
        {headers.map(title => (
          <h5 key={title} className={`  font-medium text-[14px] sm:text-[16px] shadow-xl md:text-[18px] lg:text-[21px] p-1 px-2 bg-white min-w-[130px] cursor-pointer w-full text-center hover:border ${currentTab === title ? " border-b border-1 border-[#0003] text-[#777777]" : ""}`} role="link" onClick={() => onHeaderClick(title)}>{title}</h5>
        ))}
      </div>
      <div className="p-2 sm:p-3 bg-[#37373aa]">
        {currentDisplay !== undefined && !currentDisplay.loading ? (
          !isEmpty(currentDisplay.content) ?
            currentDisplay.content :
            <div className="flex w-full h-[300px] items-center justify-center">
              <div>
                <Empty description={<p className="w-full text-center">No post here!</p>} image={<Image alt="" src={document} height={40} width={40} className="mx-auto" />} />
              </div>
            </div>
        ) : (
          <div className="w-full flex flex-col gap-2">
            <Skeleton />
            <Skeleton />
          </div>
        )}

      </div>
    </div>
  )
}