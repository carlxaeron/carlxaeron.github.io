import { render, screen, fireEvent } from "@testing-library/react";
import BlogPostModal from "./BlogPostModal";
import { BLOG_POSTS } from "../data/blogPosts";

describe("BlogPostModal", () => {
  const post = BLOG_POSTS[0];

  test("renders post content in shared portfolio modal shell", () => {
    render(<BlogPostModal show={true} onHide={jest.fn()} post={post} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(post.title)).toBeInTheDocument();
    expect(screen.getByText(/starter websites for local businesses/i)).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Close" })).toHaveLength(2);
  });

  test("closes from footer button", () => {
    const onHide = jest.fn();
    render(<BlogPostModal show={true} onHide={onHide} post={post} />);

    fireEvent.click(document.querySelector(".v3-project-modal__close"));
    expect(onHide).toHaveBeenCalled();
  });
});
