import { Modal } from "react-bootstrap";
import useModalBodyLock from "../hooks/useModalBodyLock";
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
  useModalBodyLock(show);

  if (!post) return null;

  const paragraphs = bodyParagraphs(post.body);

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      fullscreen="md-down"
      className="v3-modal-layer"
      backdropClassName="v3-modal-backdrop"
      dialogClassName="v3-blog-modal"
      contentClassName="v3-blog-modal__content"
    >
      <Modal.Header className="v3-blog-modal__header">
        <div>
          <p className="v3-blog-modal__meta">
            <span className="v3-blog-card__category">{post.category}</span>
            <span>{formatBlogDate(post.date)}</span>
            {post.industry && <span>{post.industry}</span>}
          </p>
          <Modal.Title>{post.title}</Modal.Title>
        </div>
        <button
          type="button"
          className="btn-close v3-modal-dismiss"
          aria-label="Close"
          onClick={onHide}
        />
      </Modal.Header>
      <Modal.Body className="v3-blog-modal__body">
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{renderInlineMarkdown(paragraph)}</p>
        ))}
        {post.tags?.length > 0 && (
          <div className="v3-blog-modal__tags">
            {post.tags.map((tag) => (
              <span key={tag} className="v3-blog-card__tag">
                {tag}
              </span>
            ))}
          </div>
        )}
        {post.previewUrl && (
          <a
            href={post.previewUrl}
            className="v3-blog-modal__preview-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            View portfolio preview
          </a>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default BlogPostModal;
