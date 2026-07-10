import V3DetailModal from "./V3DetailModal";
import { formatBlogDate } from "../data/blogPosts";

function bodyParagraphs(text) {
  if (!text) return [];
  return String(text)
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function renderInlineMarkdown(text) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**")) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

function BlogPostModal({ show, onHide, post }) {
  if (!post) return null;

  const paragraphs = bodyParagraphs(post.body);
  const meta = [post.category, formatBlogDate(post.date), post.industry].filter(Boolean).join(" · ");

  return (
    <V3DetailModal show={show} onHide={onHide} title={post.title} size="lg">
      <div className="v3-project-modal__details v3-project-modal__details--scroll">
        <section className="v3-project-modal__section">
          <p className="v3-project-modal__label">{meta}</p>
          <div className="v3-project-modal__description-stack">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="v3-project-modal__description">
                {renderInlineMarkdown(paragraph)}
              </p>
            ))}
          </div>
        </section>
        {post.tags?.length > 0 && (
          <section className="v3-project-modal__section">
            <h3 className="v3-project-modal__label">Tags</h3>
            <ul className="v3-project-modal__tags">
              {post.tags.map((tag) => (
                <li key={tag} className="v3-project-modal__tag">
                  {tag}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </V3DetailModal>
  );
}

export default BlogPostModal;
