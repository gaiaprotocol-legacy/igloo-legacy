import { EventContainer, Store, Supabase } from "common-app-module";
import { isEqualPost, Post, PostSelectQuery } from "sofi-module";

class PostCacher extends EventContainer {
  private store: Store = new Store("cached-posts");

  constructor() {
    super();
    this.addAllowedEvents("update", "delete");
  }

  public init() {
    Supabase.client.channel("posts-changes").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "posts",
    }, (payload) => {
      if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
        this.refresh(payload.new.id);
      } else if (payload.eventType === "DELETE") {
        this.deleteCache(payload.old.id);
      }
    }).subscribe();
  }

  private deleteCache(id: number) {
    this.store.delete(String(id));
    this.fireEvent("delete", id);
  }

  private cache(id: number, post: Post | undefined) {
    if (!post) {
      this.deleteCache(id);
    } else {
      const _post = this.get(id);
      if (!_post || !isEqualPost(post, _post)) {
        this.store.set(String(id), post, true);
        this.fireEvent("update", post);
      }
    }
  }

  public get(id: number): Post | undefined {
    const cached = this.store.get<Post>(String(id));
    if (cached) return cached;
  }

  public async refresh(id: number) {
    const { data, error } = await Supabase.client.from("posts").select(
      PostSelectQuery,
    ).eq(
      "id",
      id,
    );
    if (error) throw error;
    const post: Post | undefined = data?.[0] as any;
    console.log(post);
    this.cache(id, post);
  }

  public getAndRefresh(id: number): Post | undefined {
    const cached = this.get(id);
    this.refresh(id).catch((error) =>
      console.error("Error refreshing post:", error)
    );
    return cached;
  }

  public cachePosts(posts: Post[]) {
    for (const post of posts) {
      this.cache(post.id, post);
    }
  }
}

export default new PostCacher();
