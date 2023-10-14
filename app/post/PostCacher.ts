import { EventContainer, Store, Supabase } from "common-dapp-module";
import Post, { isEqualPost } from "../database-interface/Post.js";

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
    } else if (!isEqualPost(post, this.get(id))) {
      this.store.set(String(id), post, true);
      this.fireEvent("update", post);
    }
  }

  public get(id: number): Post | undefined {
    const cached = this.store.get<Post>(String(id));
    if (cached) return cached;
  }

  public async refresh(id: number) {
    const { data, error } = await Supabase.client.from("posts").select().eq(
      "id",
      id,
    );
    if (error) throw error;
    const post: Post | undefined = data?.[0] as any;
    this.cache(id, post);
  }

  public cachePosts(posts: Post[]) {
    for (const post of posts) {
      this.cache(post.id, post);
    }
  }
}

export default new PostCacher();
