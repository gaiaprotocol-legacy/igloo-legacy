export default async function initialize(config: Config) {
  AppInitializer.initialize(
    config.supabaseUrl,
    config.supabaseAnonKey,
    config.dev,
  );

  EnvironmentManager.dev = config.dev;
  EnvironmentManager.avaxRpc = config.avaxRpc;
  EnvironmentManager.avaxChainId = config.avaxChainId;

  [UserDetailsCacher, SubjectDetailsCacher, PostCacher].forEach((cacher) =>
    cacher.init()
  );
  WalletManager.init(config.walletConnectProjectId);
  UserWalletLinker.init(config.messageForWalletLinking);
  IglooSubjectContract.init(config.iglooSubjectAddress);

  const splash = new SplashScreen(
    el("img", { src: "/images/igloo-character.png" }),
  );
  await Promise.all([
    SignedUserManager.fetchUserOnInit(),
    msg.loadYAMLs({
      en: ["/locales/en.yml"],
    }),
    BlockTimeManager.init(),
  ]);
  splash.delete();

  Router.route("**", Layout);
  Router.route("", HomeView);
  Router.route(["chats", "chats/{topic}"], ChatsView);
  Router.route("chats/0x{subject}", SubjectChatRoomView);
  Router.route(["chats", "chats/{topic}"], TopicChatRoomView, [
    "chats/0x{subject}",
  ]);
  Router.route("explore", ExploreView);
  Router.route("search", SearchView);
  Router.route("notifications", NotificationsView);
  Router.route("settings", SettingsView);
  Router.route("post/{postId}", PostView);

  Router.route("{xUsername}", UserView, [
    "chats",
    "chats/{topic}",
    "explore",
    "search",
    "notifications",
    "settings",
    "post/{postId}",
    "{xUsername}/holdings",
    "{xUsername}/holders",
    "{xUsername}/following",
    "{xUsername}/followers",
  ]);

  Router.route("{xUsername}/holdings", HoldingsView, [
    "chats/{topic}",
    "post/{postId}",
  ]);
  Router.route("{xUsername}/holders", HoldersView, [
    "chats/{topic}",
    "post/{postId}",
  ]);
  Router.route("{xUsername}/following", FollowingView, [
    "chats/{topic}",
    "post/{postId}",
  ]);
  Router.route("{xUsername}/followers", FollowersView, [
    "chats/{topic}",
    "post/{postId}",
  ]);

  AuthUtil.checkEmailAccess();
  console.log(ThemeManager.darkMode);
}
