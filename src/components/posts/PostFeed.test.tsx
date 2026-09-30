import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PostFeed } from "./PostFeed";
import type { Post } from "@/lib/data/mockData";

function makePost(overrides: Partial<Post> = {}): Post {
  return {
    id: "p1",
    userId: "1",
    platform: "twitter",
    content: "First post",
    likes: 0,
    shares: 0,
    comments: [],
    createdAt: "2024-04-22T15:30:00Z",
    ...overrides,
  };
}

describe("PostFeed", () => {
  it("orders posts newest first", () => {
    render(
      <PostFeed
        initialPosts={[
          makePost({ id: "old", content: "Older post", createdAt: "2024-04-20T10:00:00Z" }),
          makePost({ id: "new", content: "Newer post", createdAt: "2024-04-22T10:00:00Z" }),
        ]}
      />,
    );

    const articles = screen.getAllByRole("article");
    expect(articles[0]).toHaveTextContent("Newer post");
    expect(articles[1]).toHaveTextContent("Older post");
  });

  it("counts every like when clicked rapidly", async () => {
    // Reading `posts` from the render closure meant clicks batched into one
    // render produced a single increment.
    const user = userEvent.setup();
    render(<PostFeed initialPosts={[makePost()]} />);

    const like = screen.getByRole("button", { name: /likes/i });
    await user.click(like);
    await user.click(like);
    await user.click(like);

    expect(like).toHaveTextContent("3");
  });

  it("counts every share when clicked rapidly", async () => {
    const user = userEvent.setup();
    render(<PostFeed initialPosts={[makePost()]} />);

    const share = screen.getByRole("button", { name: /shares/i });
    await user.click(share);
    await user.click(share);

    expect(share).toHaveTextContent("2");
  });

  it("keeps each post's comment draft separate", async () => {
    const user = userEvent.setup();
    render(
      <PostFeed
        initialPosts={[
          makePost({ id: "a", content: "Post A", createdAt: "2024-04-22T10:00:00Z" }),
          makePost({ id: "b", content: "Post B", createdAt: "2024-04-21T10:00:00Z" }),
        ]}
      />,
    );

    const [firstComments, secondComments] = screen.getAllByRole("button", { name: /comments/i });

    await user.click(firstComments);
    await user.type(screen.getByLabelText("Write a comment"), "draft for A");
    await user.keyboard("{Escape}");

    // A single page-level draft leaked "draft for A" into this dialog.
    await user.click(secondComments);
    expect(screen.getByLabelText("Write a comment")).toHaveValue("");
  });

  it("adds a comment and clears the draft", async () => {
    const user = userEvent.setup();
    render(<PostFeed initialPosts={[makePost()]} />);

    await user.click(screen.getByRole("button", { name: /comments/i }));
    await user.type(screen.getByLabelText("Write a comment"), "Nice work{Enter}");

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Nice work")).toBeVisible();
    expect(screen.getByLabelText("Write a comment")).toHaveValue("");
  });

  it("refuses to post a whitespace-only comment", async () => {
    const user = userEvent.setup();
    render(<PostFeed initialPosts={[makePost()]} />);

    await user.click(screen.getByRole("button", { name: /comments/i }));
    await user.type(screen.getByLabelText("Write a comment"), "   ");

    expect(screen.getByRole("button", { name: "Post comment" })).toBeDisabled();
  });

  it("appends older posts rather than prepending newer ones", async () => {
    const user = userEvent.setup();
    render(<PostFeed initialPosts={[makePost({ content: "Seed post" })]} />);

    await user.click(screen.getByRole("button", { name: /load older posts/i }));

    const articles = screen.getAllByRole("article");
    expect(articles.length).toBeGreaterThan(1);
    // The seed post is still the newest, so "load older" did not jump the queue.
    expect(articles[0]).toHaveTextContent("Seed post");
  });
});
