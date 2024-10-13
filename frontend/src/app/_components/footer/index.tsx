
/* next components */
import Link from 'next/link'


export default function Footer() {

  return (
    <footer className="bg-[#ffedcc] flex gap-[12%] min-h-[402px] pt-4 sm:pt-6 md:pt-10 lg:pt-14 min-w-[100vw]">
      <div className='px-4 sm:px-6 md:px-8 lg:px-10 '>
        <h2 className="font-[700] text-[24px] sm:text-[28px] md:text-[36px] lg:text-[48px] leading-[110%] text-[#543ee0] uppercase ">
          Collections
        </h2>
      </div>
      <div className="flex justify-between w-[95%] max-w-[800px] gap-4">
        {footerRows.map((row, i) => (
          <div key={i}>
            <h3 className='text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px] leading-[110%] font-[500] mb-4'>{row.heading}</h3>
            <ul>
              {row.list.map((list, i) => (
                <li key={i} className='text-[14px] sm:text-[16px]md:text-[18px] leading-[115%] text-[#111] mb-2'>
                  <Link href={list.link}>
                    {list.text}
                  </Link>
                </li>))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  )
}


const footerRows = [
  {
    heading: 'Explore',
    list: [
      {
        text: 'Community',
        link: ''
      },
      {
        text: 'Trending blogs',
        link: ''
      },
      {
        text: 'Chatter for teams',
        link: ''
      },
    ]
  },
  {
    heading: 'Support',
    list: [
      {
        text: 'Support docs',
        link: ''
      },
      {
        text: 'Join slack',
        link: ''
      },
      {
        text: 'Contact',
        link: ''
      },
    ]
  },
  {
    heading: 'Official blog',
    list: [
      {
        text: 'Official blog',
        link: ''
      },
      {
        text: 'Engineering blog',
        link: ''
      },
    ]
  },
]