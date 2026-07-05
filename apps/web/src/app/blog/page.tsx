import Link from "next/link";
import { BLOG_POSTS } from "@/data/blog";

export const metadata = {
  title: "Blog · CrackGate",
  description:
    "GATE Mining, PSU Coal India, and mining engineering exam tips — strategy guides, study plans, syllabus breakdowns, and career advice from IIT Kharagpur alumni.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  return (
    <div className="max-w-4xl mx-auto px-5 py-16">
      <h1 className="text-4xl font-extrabold tracking-tight text-ink">CrackGate Blog</h1>
      <p className="mt-3 text-muted max-w-2xl">
        Exam strategies, study plans, and career guidance for GATE Mining, PSU Coal India, and
        mining engineering aspirants — written by IIT Kharagpur alumni who&apos;ve been through it.
      </p>

      <div className="mt-10 grid gap-6">
        {BLOG_POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="card p-6 hover:border-brand transition group"
          >
            <div className="flex flex-wrap gap-2 mb-2">
              {post.tags.map((t) => (
                <span key={t} className="badge bg-brand/10 text-brand text-xs">{t}</span>
              ))}
            </div>
            <h2 className="text-xl font-bold text-ink group-hover:text-brand transition-colors">
              {post.title}
            </h2>
            <p className="text-sm text-muted mt-2 leading-relaxed">{post.description}</p>
            <div className="flex items-center gap-3 mt-4 text-xs text-muted">
              <span>{post.author}</span>
              <span aria-hidden>·</span>
              <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</time>
              <span aria-hidden>·</span>
              <span>{(post.body.length / 2000).toFixed(0)} min read</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
