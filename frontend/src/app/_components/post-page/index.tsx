
import { Post } from "@/app/_lib/type";
import Image from "next/image";
import { Familjen_Grotesk, Jacques_Francois, Merriweather as Mw, Roboto as Rb, Bree_Serif } from "next/font/google";

const Default = Familjen_Grotesk({
  weight: ["400", "400", "700"],
  subsets: ["latin"]
});
const Jacques = Jacques_Francois({
  weight: ["400"],
  subsets: ["latin"]
})
const Roboto = Rb({
  weight: ["400", "400", "500", "700"],
  subsets: ["latin"]
});
const BreeSerif = Bree_Serif({
  weight: ["400"],
  subsets: ["latin"]
});
const Merriweather = Mw({
  weight: ["400", "700", "900"],
  subsets: ["latin"]
});
const themes = {
  Merriweather,
  BreeSerif,
  Roboto,
  Jacques,
  Default
}



export default function PostPage(props: Partial<Post>) {
  const { content, coverPhoto, authorDetails, title, theme } = props;
  const themeClassName = theme && themes[theme] ? themes[theme].className : themes["Default"].className
  return (
    <div className={`${themeClassName} w-full h-auto bg-transparent`}>
      {coverPhoto && <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] overflow-hidden relative rounded-[30px] md-[80px]">
        <Image src={coverPhoto} alt={title ?? ""} fill objectFit="cover" objectPosition="center" />
      </div>}
      <div className="mb-[40px]">
        <h1 className="text-black leading-[105%] font-bold text-[24px] xs:text-[32px] sm:text-[42px] md:text-[48px] lg:text-[54px] mb-[10px]">{title}</h1>
        <p className="text-[#3d3d3d] text-[11px] xs:text-[14px] sm:text-[16px] md:text-[22px] italic">- {authorDetails?.firstName ? `${authorDetails.firstName || ""} ${authorDetails.lastName || ""}` : "author"}</p>
      </div>


      <div className="[&_p]:text-grey-400 [&_p]:text-[12px] xs:[&_p]:text-[14px] sm:[&_p]:text-[16px] [&_a]:text-[#44f]" dangerouslySetInnerHTML={{ __html: content ?? "" }} />
    </div>
  )
}