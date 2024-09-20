import document from "@/assets/icons/document.svg";
import Image from "next/image";
import { Empty as AdEmpty } from "antd";

export default function Empty({ text }: { text?: string }) {
  return (
    <div className="flex w-full h-[300px] items-center justify-center">
      <div>
        <AdEmpty description={<p className="w-full text-center">{text ?? "No post here!"}</p>} image={<Image alt="" src={document} height={40} width={40} className="mx-auto" />} />
      </div>
    </div>
  )
}