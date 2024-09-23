import heroImage from "@/assets/backgrounds/hero.png";
import Image from "next/image";

export default function Home() {

  return (
    <div className="flex min-h-screen flex-col items-center justify-between  w-full">
      <section className="w-full px-[10px] sm:px-[7.5%] md:px-[10%] h-[600px] max-h-screen pt-[200px] relative px-[20px] px-[30px] sm:px-[40px] md:px-[60px]">
        <div className="absolute top-0 left-0 w-[100%] h-[100%] z-[-1] bg-[#000] bg-opacity-80" />
        <Image
          fill
          src={heroImage}
          alt=""
          objectFit="cover"
          className="absolute top-0 left-0 w-[100%] h-[100%] z-[-2]"
        />
        <h2 className="text-[38px] lg:text-[44px] xl:text-[48px]  leading-[110%] font-bold mb-2">Collection of thoughts</h2>
        <p className="leading-[110%] text-[16px] sm:text-[18px] md:text-[21px] font-medium text-[#fff8] max-w-[600px]">This is a platform for free speech and artistic articulation of words. Built out of boredom of the creator and made with love. Sign up and write the best or the worst think piece you can muster.</p>
      </section>
      <section className="bg-white w-full p-4 text-black mb-[40px]">
        <h3 id="about" className="w-full text-center font-bold text-[21px] md:text-[24px] lg:text-[32px]">About</h3>
        <p className="max-w-[400px] text-center mx-auto leading-[105%]">Write ups are put in 4 not so distinct categories: essay, post, short story and articles.</p>
        <ul className="grid sm:gap-[10px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:px-[20px] mt-[25px] sm:mt-[40px]">
          {
            contentDisplay.map((item, i) => {
              const synopsisTruncate = item.content.synopsis.length > 100 ? item.content.synopsis.slice(0, 97) + "..." : item.content.synopsis;
              return (
                <li key={i} className="block w-full max-w-full ">
                  <h4 className="font-bold max-w-full w-full text-[21px] md:text-[24px] lg:text-[32px] leading-[118%] whitespace-nowrap truncate ">
                    {item.heading}
                  </h4>
                  <article >
                    <h5 className="text-[21px] leading-[103%] text-bold italic truncate">{item.content.title}</h5>
                    <p className={`italic text-[#000a] w-full  text-[14px] text-wrap word-wrap leading-[105%]`}>{synopsisTruncate}</p>
                    <div className="relative w-full h-[230px] mt-2 overflow-hidden rounded-[20px]">
                      <Image
                        alt={item.content.title}
                        src={item.content.image}
                        fill
                        objectFit="cover" />
                    </div>
                  </article>
                </li>
              )
            })
          }

        </ul>
      </section>
      <section className="bg-white w-full p-4 text-black mb-[40px] my-[50px]">
        <h3 id="about" className="w-full text-center font-bold text-[21px] md:text-[24px] lg:text-[32px]">Popular Members</h3>
        <ul className="grid sm:gap-[10px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:px-[20px] mt-[25px] sm:mt-[40px]">
          {
            usersDisplay.map((item, i) => {
              const bioTruncate = item.details.bio.length > 100 ? item.details.bio.slice(0, 47) + "..." : item.details.bio;

              return (
                <li key={i} className="block w-full max-w-full ">
                  <div className="flex items-center gap-2">
                    <div className="relative w-[80px] h-[80px] min-h-[80px] min-w-[80px] m-2 overflow-hidden rounded-full">
                      <Image
                        alt={item.name}
                        src={item.details.image}
                        fill
                        objectFit="cover" />
                    </div>
                    <div>
                      <h4 className="font-bold max-w-full w-full text-[21px] md:text-[24px] lg:text-[32px] leading-[118%] whitespace-nowrap truncate ">
                        {item.name}
                      </h4>
                      <p className="text-[21px] leading-[103%] text-bold italic truncate">{item.details.profession}</p>
                    </div>
                  </div>
                  <div>
                    <p className={`italic text-[#000a] w-full  text-[14px] text-wrap word-wrap leading-[105%]`}>{bioTruncate}</p>
                  </div>
                </li>
              )
            })
          }

        </ul>
      </section>
    </div>
  );
}
const contentDisplay = [
  {
    heading: "Popular Post",
    content: {
      title: "Title",
      synopsis: "synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis",
      image: heroImage
    }
  },
  {
    heading: "Popular Article",
    content: {
      title: "Title",
      synopsis: "synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis",
      image: heroImage
    }
  },
  {
    heading: "Popular Essay",
    content: {
      title: "Title",
      synopsis: "synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis",
      image: heroImage
    }
  },
  {
    heading: "Popular Short Story",
    content: {
      title: "Title",
      synopsis: "synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis",
      image: heroImage
    }
  },
]
const usersDisplay = [
  {
    name: "Muup Cope",
    details: {
      profession: "profession",
      posts: 288,
      image: heroImage,
      bio: "Writer and Chess fanatic"
    }
  },
  {
    name: "Jack Rany",
    details: {
      profession: "profession",
      posts: 288,
      image: heroImage,
      bio: "Writer and Chess fanatic"
    }
  },
  {
    name: "Chuks Scrap",
    details: {
      profession: "profession",
      posts: 288,
      image: heroImage,
      bio: "Writer and Chess fanatic",
    }
  },
  {
    name: "Olamide Console",
    details: {
      profession: "profession",
      posts: 288,
      image: heroImage,
      bio: "Writer and fifa game fanatic"
    }
  },
]