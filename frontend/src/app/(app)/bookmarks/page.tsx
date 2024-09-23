import { Metadata } from "next"
import BookmarksPage from "."

export const metadata: Metadata = {
  title: "Bookmarks",
  description: "See the post from the community you have bookmarked!"
}


export default function Bookmarks() {

  return (
    <BookmarksPage />
  )
}