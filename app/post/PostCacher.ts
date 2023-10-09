import { EventContainer, Store, Supabase } from "common-dapp-module";
import Post, { isEqualPost } from "../database-interface/Post.js";

class PostCacher extends EventContainer {
  private store: Store = new Store("cached-posts");

  constructor() {
    super();
    this.addAllowedEvents("update");
  }

  public init() {
    Supabase.client.channel("posts-changes").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "posts",
    }, (payload) => {
      if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
        this.refresh(payload.new.id);
      }
    }).subscribe();
  }

  public get(id: number): Post | undefined {
    const cached = this.store.get<Post>(String(id));
    if (cached) return cached;
  }

  private cache(post: Post) {
    if (!isEqualPost(post, this.get(post.id))) {
      this.store.set(String(post.id), post, true);
      this.fireEvent("update", post);
    }
  }

  public async refresh(id: number) {
    const { data, error } = await Supabase.client.from("posts").select().eq(
      "id",
      id,
    );
    if (error) throw error;
    const post: Post | undefined = data?.[0] as any;
    if (post) this.cache(post);
  }

  public cachePosts(posts: Post[]) {
    for (const post of posts) {
      this.cache(post);
    }
  }
}

export default new PostCacher();
