import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section>
        <h2>Collection of Words</h2>
        <p>This is a platform for free speech, artistic articulation of words. Built out of boredom of the creator and made with love. Sign up and write the best or the worst think piece you can muster.</p>
      </section>
      <section>
        <h3 id="about">About</h3>
        <p>Write ups are put in 4 not so distinct categories: essay, blog, short story and articles.</p>
        <ul>
          <li>Most Popular Blog</li>
          <li>Most Popular Article</li>
          <li>Most Popular Short Story</li>
          <li>Most Popular Article</li>
        </ul>
      </section>
      <section>
        <h3>Most Popular Blogs</h3>
        <ul>
          <li>1</li>
          <li>1</li>
          <li>1</li>
        </ul>
      </section>
      <section>
        <h3>Favorite Members</h3>
        <ul>
          <li>1</li>
          <li>1</li>
          <li>1</li>
        </ul>
      </section>
    </main>
  );
}
