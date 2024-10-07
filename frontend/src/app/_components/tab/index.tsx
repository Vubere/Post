import { Skeleton } from "antd";
import { ReactNode, useMemo, useState } from "react"
import { isEmpty } from "lodash";
import Empty from "@/app/_components/empty";

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
  const headers = useMemo(() => items.map(v => v.title) || [], [items, loading]);
  const [currentTab, setCurrentTab] = useState(headers[0]);
  const currentDisplay = useMemo(() => items.find(item => item.title === currentTab), [currentTab, loading]);

  const onHeaderClick = (title: string) => {
    setCurrentTab(title);
  }

  return (
    <div className={"grid grid-rows-[40px_1fr] h-full max-h-[calc(100vh-80px)] w-full bg-[#37373aa] overflow-hidden " + className}>
      <div className="flex flex-row gap-[1px] w-full max-w-[100%] overflow-x-auto text-[#777777]">
        {headers.map(title => (
          <h5 key={title} className={`  font-medium text-[14px] sm:text-[16px] shadow-xl md:text-[18px] lg:text-[21px] p-1 px-2 bg-white min-w-[130px] cursor-pointer w-full text-center hover:border ${currentTab === title ? " border-b border-1 border-[#0003] text-black" : ""}`} role="link" onClick={() => onHeaderClick(title)}>{title}</h5>
        ))}
      </div>
      <div className="p-2 sm:p-3 bg-[#37373aa] h-full max-h-full overflow-y-auto !pb-[100px]">
        {currentDisplay !== undefined && !currentDisplay.loading ? (
          !isEmpty(currentDisplay.content) ?
            <div>
              {currentDisplay.content}
            </div>
            :
            <div className="flex w-full h-[300px] items-center justify-center">
              <div>
                <Empty />
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