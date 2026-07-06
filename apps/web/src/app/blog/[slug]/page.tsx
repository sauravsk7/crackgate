import { notFound } from "next/navigation";
import Link from "next/link";
import { BLOG_POSTS, getBlogPost } from "@/data/blog";
import { Breadcrumb } from "@/components/breadcrumb";
import { ShareOnWhatsApp } from "@/components/share-on-whatsapp";
import { NewsletterForm } from "@/components/newsletter-form";
import { readTime } from "@/lib/read-time";

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Blog · CrackGate" };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      images: [{ url: `/api/og?subject=Blog&title=${encodeURIComponent(post.title)}`, alt: post.title }],
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: { "@type": "Person", name: post.author },
    datePublished: post.date,
    dateModified: post.date,
    publisher: {
      "@type": "Organization",
      name: "CrackGate",
      url: "https://crackgate.in",
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://crackgate.in/blog/${slug}` },
  };

  const paragraphs = post.body.split("\n\n");
  const mins = readTime(post.body);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <article className="max-w-3xl mx-auto px-5 py-10">
        <div className="mb-8">
          <Breadcrumb crumbs={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.title },
          ]} />
          <div className="flex items-center justify-between">
            <Link href="/blog" className="text-sm text-muted hover:text-ink">← All posts</Link>
            <ShareOnWhatsApp />
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((t) => (
              <span key={t} className="badge bg-brand/10 text-brand text-xs">{t}</span>
            ))}
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold mt-3 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-3 mt-3 text-sm text-muted">
            <span>{post.author}</span>
            <span aria-hidden>·</span>
            <time dateTime={post.date}>{fmt(post.date)}</time>
            <span aria-hidden>·</span>
            <span>{mins} min read</span>
          </div>
          <p className="text-muted mt-4 text-lg leading-relaxed">{post.description}</p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          {paragraphs.map((p, i) => {
            if (p.startsWith("## ")) {
              return <h2 key={i} className="text-2xl font-bold mt-10 mb-4">{p.replace("## ", "")}</h2>;
            }
            if (p.startsWith("|")) {
              return <TableBlock key={i} text={p} />;
            }
            if (p.startsWith("**")) {
              return <p key={i} className="font-semibold text-ink mt-6 mb-2">{p.replace(/\*\*/g, "")}</p>;
            }
            return <p key={i} className="text-ink/90 leading-relaxed mb-4">{p}</p>;
          })}
        </div>

        <div className="mt-12 border-t border-line pt-8">
          <Link href="/blog" className="text-sm text-brand hover:underline">← Back to all posts</Link>
        </div>
      </article>

      <div className="border-t border-line bg-paper/40">
        <div className="max-w-3xl mx-auto px-5 py-12 text-center">
          <h3 className="text-lg font-bold text-ink">Get exam tips & updates</h3>
          <p className="mt-1 text-sm text-muted">New posts, GATE notifications, and prep strategies — once a week.</p>
          <div className="mt-4 flex justify-center">
            <NewsletterForm source="blog" />
          </div>
        </div>
      </div>
    </>
  );
}

function TableBlock({ text }: { text: string }) {
  const rows = text.split("\n").filter(Boolean);
  const headers = rows[0]?.split("|").filter(Boolean).map((s) => s.trim()) ?? [];
  const data = rows.slice(2).map((r) => r.split("|").filter(Boolean).map((s) => s.trim()));
  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-slate-100">
            {headers.map((h) => <th key={h} className="px-4 py-2 text-left font-semibold">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-line">
              {row.map((cell, j) => <td key={j} className="px-4 py-2">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
