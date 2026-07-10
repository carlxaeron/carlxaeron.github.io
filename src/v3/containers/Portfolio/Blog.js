import { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import SectionTitle from "../../components/SectionTitle";
import { BLOG_CATEGORIES, BLOG_POSTS, formatBlogDate } from "../../data/blogPosts";

function BlogCard({ post, isActive, index, onOpen }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
    if (!isActive) return undefined;
    const t = setTimeout(() => setShow(true), 80 + index * 50);
    return () => clearTimeout(t);
  }, [isActive, index, post.id]);

  const spring = useSpring({
    from: { opacity: 0, y: 24 },
    to: { opacity: show ? 1 : 0, y: show ? 0 : 24 },
    config: { tension: 240, friction: 26 },
  });

  return (
    <animated.article style={spring} className="v3-blog-card">
      <button
        type="button"
        className="v3-blog-card__button"
        onClick={() => onOpen(post)}
        aria-label={`Read article: ${post.title}`}
      >
        <div className="v3-blog-card__top">
          <span className="v3-blog-card__category">{post.category}</span>
          <time className="v3-blog-card__date" dateTime={post.date}>
            {formatBlogDate(post.date)}
          </time>
        </div>
        <h3 className="v3-blog-card__title">{post.title}</h3>
        <p className="v3-blog-card__excerpt">{post.excerpt}</p>
        {post.tags?.length > 0 && (
          <div className="v3-blog-card__tags">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="v3-blog-card__tag">
                {tag}
              </span>
            ))}
          </div>
        )}
        <span className="v3-blog-card__read">Read more</span>
      </button>
    </animated.article>
  );
}

function V3Blog({ isActive, onOpenBlogPost }) {
  const [filter, setFilter] = useState("All");

  const headerSpring = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: isActive ? 1 : 0, y: isActive ? 0 : -20 },
    delay: 50,
    config: { tension: 220, friction: 28 },
  });

  const filteredPosts =
    filter === "All"
      ? BLOG_POSTS
      : BLOG_POSTS.filter((post) => post.category === filter);

  const handleOpen = (post) => {
    if (typeof onOpenBlogPost === "function") {
      onOpenBlogPost(post);
    }
  };

  return (
    <section
      id="blog"
      className="v3-section-body"
      style={{ background: "#00473e", height: "100vh", overflow: "hidden" }}
    >
      <div className="v3-inner v3-scrollable v3-section-scroll">
        <animated.div style={headerSpring}>
          <SectionTitle subtitle="Updates on sideline client sites, demos, and portfolio tooling">
            News &amp; Blog
          </SectionTitle>
        </animated.div>

        <div className="v3-filter-btns">
          {BLOG_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              className={filter === category ? "active" : ""}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="v3-blog-grid">
          {filteredPosts.length === 0 && (
            <p className="v3-blog-empty">No posts in this category yet.</p>
          )}
          {filteredPosts.map((post, index) => (
            <BlogCard
              key={`${filter}-${post.id}`}
              post={post}
              index={index}
              isActive={isActive}
              onOpen={handleOpen}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default V3Blog;
