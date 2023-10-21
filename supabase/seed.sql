
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."decrease_follow_count"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  update user_details
  set
    follower_count = follower_count - 1
  where
    user_id = old.followee_id;
  update user_details
  set
    following_count = following_count - 1
  where
    user_id = old.follower_id;
  return null;
end;$$;

ALTER FUNCTION "public"."decrease_follow_count"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."decrease_subject_key_holder_count"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  insert into subject_details (
    subject
  ) values (
    old.subject
  ) on conflict (subject) do nothing;
  IF old.last_fetched_balance > 0 THEN
    update subject_details
    set
      key_holder_count = key_holder_count - 1
    where
      subject = old.subject;
  END IF;
  return null;
end;$$;

ALTER FUNCTION "public"."decrease_subject_key_holder_count"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."decrease_total_subject_key_balance"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  insert into total_subject_key_balances (
    wallet_address
  ) values (
    old.wallet_address
  ) on conflict (wallet_address) do nothing;
  update total_subject_key_balances
  set
    total_key_balance = total_key_balance - old.last_fetched_balance
  where
    wallet_address = old.wallet_address;
  return null;
end;$$;

ALTER FUNCTION "public"."decrease_total_subject_key_balance"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  insert into public.user_details (user_id, display_name, profile_image, x_username)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_user_meta_data ->> 'user_name'
  );
  return new;
end;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."increase_follow_count"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  update user_details
  set
    follower_count = follower_count + 1
  where
    user_id = new.followee_id;
  update user_details
  set
    following_count = following_count + 1
  where
    user_id = new.follower_id;
  return null;
end;$$;

ALTER FUNCTION "public"."increase_follow_count"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."increase_subject_key_holder_count"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  insert into subject_details (
    subject
  ) values (
    new.subject
  ) on conflict (subject) do nothing;
  IF new.last_fetched_balance > 0 THEN
    update subject_details
    set
      key_holder_count = key_holder_count + 1
    where
      subject = new.subject;
  END IF;
  return null;
end;$$;

ALTER FUNCTION "public"."increase_subject_key_holder_count"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."increase_subject_total_trading_volume_and_fees_earned"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
    update user_details
    set
        total_earned_trading_fees = total_earned_trading_fees + new.args[7]::numeric
    where
        wallet_address = new.args[1];
    insert into subject_details (
        subject
    ) values (
        new.args[2]
    ) on conflict (subject) do nothing;
    update subject_details
    set
        total_trading_key_volume = total_trading_key_volume + new.args[5]::numeric,
        total_earned_trading_fees = total_earned_trading_fees + new.args[7]::numeric,
        last_key_purchased_at = now()
    where
        subject = new.args[2];
    return null;
end;$$;

ALTER FUNCTION "public"."increase_subject_total_trading_volume_and_fees_earned"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."increase_total_subject_key_balance"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  insert into total_subject_key_balances (
    wallet_address
  ) values (
    new.wallet_address
  ) on conflict (wallet_address) do nothing;
  update total_subject_key_balances
  set
    total_key_balance = total_key_balance + new.last_fetched_balance
  where
    wallet_address = new.wallet_address;
  return null;
end;$$;

ALTER FUNCTION "public"."increase_total_subject_key_balance"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."set_author_default_values"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
  new.author_name := (SELECT raw_user_meta_data ->> 'full_name' FROM auth.users WHERE id = new.author);
  new.author_avatar_url := (SELECT raw_user_meta_data ->> 'avatar_url' FROM auth.users WHERE id = new.author);
  new.author_x_username := (SELECT raw_user_meta_data ->> 'user_name' FROM auth.users WHERE id = new.author);
  RETURN new;
END;$$;

ALTER FUNCTION "public"."set_author_default_values"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."set_notification_read_at"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
  IF old.read_at = false AND new.read_at = true THEN
    new.read_at := now();
  END IF;
  RETURN new;
END;
$$;

ALTER FUNCTION "public"."set_notification_read_at"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
  new.updated_at := now();
  RETURN new;
END;$$;

ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_subject_key_holder_count"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  insert into subject_details (
    subject
  ) values (
    new.subject
  ) on conflict (subject) do nothing;
  IF old.last_fetched_balance = 0 AND new.last_fetched_balance > 0 THEN
    update subject_details
    set
      key_holder_count = key_holder_count + 1
    where
      subject = new.subject;
  ELSIF old.last_fetched_balance > 0 AND new.last_fetched_balance = 0 THEN
    update subject_details
    set
      key_holder_count = key_holder_count - 1
    where
      subject = new.subject;
  END IF;
  return null;
end;$$;

ALTER FUNCTION "public"."update_subject_key_holder_count"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_total_subject_key_balance"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  insert into total_subject_key_balances (
    wallet_address
  ) values (
    new.wallet_address
  ) on conflict (wallet_address) do nothing;
  update total_subject_key_balances
  set
    total_key_balance = total_key_balance - old.last_fetched_balance + new.last_fetched_balance
  where
    wallet_address = new.wallet_address;
  return null;
end;$$;

ALTER FUNCTION "public"."update_total_subject_key_balance"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."follows" (
    "follower_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "followee_id" "uuid" NOT NULL,
    "followed_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."follows" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" bigint NOT NULL,
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "type" smallint NOT NULL,
    "source_id" "uuid",
    "read_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."notifications" OWNER TO "postgres";

ALTER TABLE "public"."notifications" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."notifications_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."posts" (
    "id" bigint NOT NULL,
    "author" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "author_name" "text" NOT NULL,
    "author_avatar_url" "text",
    "message" "text" NOT NULL,
    "translated" "jsonb",
    "rich" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone,
    "target" smallint NOT NULL,
    "group_id" bigint,
    "post_ref" bigint,
    "author_x_username" "text"
);

ALTER TABLE "public"."posts" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."subject_chat_messages" (
    "id" bigint NOT NULL,
    "subject" "text" NOT NULL,
    "author" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "author_name" "text" NOT NULL,
    "author_avatar_url" "text",
    "message_type" smallint NOT NULL,
    "message" "text",
    "translated" "jsonb",
    "rich" "jsonb",
    "post_ref" bigint,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone,
    "author_x_username" "text"
);

ALTER TABLE "public"."subject_chat_messages" OWNER TO "postgres";

ALTER TABLE "public"."subject_chat_messages" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."subject_chat_messages_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."subject_contract_events" (
    "block_number" bigint NOT NULL,
    "log_index" bigint NOT NULL,
    "wallet_address" "text" NOT NULL,
    "subject" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "args" "text"[] NOT NULL
);

ALTER TABLE "public"."subject_contract_events" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."subject_details" (
    "subject" "text" NOT NULL,
    "last_fetched_key_price" numeric DEFAULT '68750000000000'::numeric NOT NULL,
    "total_trading_key_volume" numeric DEFAULT '0'::numeric NOT NULL,
    "total_earned_trading_fees" numeric DEFAULT '0'::numeric NOT NULL,
    "is_key_price_up" boolean,
    "last_message" "text",
    "last_message_sent_at" timestamp with time zone DEFAULT '-infinity'::timestamp with time zone NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone,
    "key_holder_count" integer DEFAULT 0 NOT NULL,
    "last_key_purchased_at" timestamp with time zone DEFAULT '-infinity'::timestamp with time zone NOT NULL,
    "owned_key_count" integer DEFAULT 0 NOT NULL
);

ALTER TABLE "public"."subject_details" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."subject_key_holders" (
    "subject" "text" NOT NULL,
    "wallet_address" "text" NOT NULL,
    "last_fetched_balance" bigint DEFAULT '0'::bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone
);

ALTER TABLE "public"."subject_key_holders" OWNER TO "postgres";

ALTER TABLE "public"."posts" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."subject_posts_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."topic_chat_messages" (
    "id" bigint NOT NULL,
    "topic" "text" NOT NULL,
    "author" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "author_name" "text" NOT NULL,
    "author_avatar_url" "text",
    "message_type" smallint NOT NULL,
    "message" "text",
    "translated" "jsonb",
    "rich" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone,
    "author_x_username" "text"
);

ALTER TABLE "public"."topic_chat_messages" OWNER TO "postgres";

ALTER TABLE "public"."topic_chat_messages" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."topic_chat_messages_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."total_subject_key_balances" (
    "wallet_address" "text" NOT NULL,
    "total_key_balance" bigint DEFAULT '0'::bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone
);

ALTER TABLE "public"."total_subject_key_balances" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tracked_event_blocks" (
    "contract_type" "text" NOT NULL,
    "block_number" bigint NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."tracked_event_blocks" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."user_details" (
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "wallet_address" "text",
    "total_earned_trading_fees" numeric DEFAULT '0'::numeric NOT NULL,
    "display_name" "text",
    "profile_image" "text",
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone,
    "follower_count" integer DEFAULT 0 NOT NULL,
    "following_count" integer DEFAULT 0 NOT NULL,
    "blocked" boolean DEFAULT false NOT NULL,
    "x_username" "text"
);

ALTER TABLE "public"."user_details" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."wallet_linking_nonces" (
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "wallet_address" "text" NOT NULL,
    "nonce" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."wallet_linking_nonces" OWNER TO "postgres";

ALTER TABLE ONLY "public"."follows"
    ADD CONSTRAINT "follows_pkey" PRIMARY KEY ("follower_id", "followee_id");

ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."subject_chat_messages"
    ADD CONSTRAINT "subject_chat_messages_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."subject_contract_events"
    ADD CONSTRAINT "subject_contract_events_pkey" PRIMARY KEY ("block_number", "log_index");

ALTER TABLE ONLY "public"."subject_details"
    ADD CONSTRAINT "subject_details_pkey" PRIMARY KEY ("subject");

ALTER TABLE ONLY "public"."subject_key_holders"
    ADD CONSTRAINT "subject_key_holders_pkey" PRIMARY KEY ("subject", "wallet_address");

ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "subject_posts_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."topic_chat_messages"
    ADD CONSTRAINT "topic_chat_messages_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tracked_event_blocks"
    ADD CONSTRAINT "tracked_event_blocks_pkey" PRIMARY KEY ("contract_type");

ALTER TABLE ONLY "public"."user_details"
    ADD CONSTRAINT "user_details_pkey" PRIMARY KEY ("user_id");

ALTER TABLE ONLY "public"."wallet_linking_nonces"
    ADD CONSTRAINT "wallet_linking_nonces_pkey" PRIMARY KEY ("user_id");

ALTER TABLE ONLY "public"."total_subject_key_balances"
    ADD CONSTRAINT "wallet_total_subject_key_balances_pkey" PRIMARY KEY ("wallet_address");

CREATE TRIGGER "decrease_follow_count" AFTER DELETE ON "public"."follows" FOR EACH ROW EXECUTE FUNCTION "public"."decrease_follow_count"();

CREATE TRIGGER "decrease_subject_key_holder_count" AFTER DELETE ON "public"."subject_key_holders" FOR EACH ROW EXECUTE FUNCTION "public"."decrease_subject_key_holder_count"();

CREATE TRIGGER "decrease_total_subject_key_balance" AFTER DELETE ON "public"."subject_key_holders" FOR EACH ROW EXECUTE FUNCTION "public"."decrease_total_subject_key_balance"();

CREATE TRIGGER "increase_follow_count" AFTER INSERT ON "public"."follows" FOR EACH ROW EXECUTE FUNCTION "public"."increase_follow_count"();

CREATE TRIGGER "increase_subject_key_holder_count" AFTER INSERT ON "public"."subject_key_holders" FOR EACH ROW EXECUTE FUNCTION "public"."increase_subject_key_holder_count"();

CREATE TRIGGER "increase_subject_total_trading_volume_and_fees_earned" AFTER INSERT ON "public"."subject_contract_events" FOR EACH ROW EXECUTE FUNCTION "public"."increase_subject_total_trading_volume_and_fees_earned"();

CREATE TRIGGER "increase_total_subject_key_balance" AFTER INSERT ON "public"."subject_key_holders" FOR EACH ROW EXECUTE FUNCTION "public"."increase_total_subject_key_balance"();

CREATE TRIGGER "set_author_default_values" BEFORE INSERT ON "public"."posts" FOR EACH ROW EXECUTE FUNCTION "public"."set_author_default_values"();

CREATE TRIGGER "set_author_default_values" BEFORE INSERT ON "public"."subject_chat_messages" FOR EACH ROW EXECUTE FUNCTION "public"."set_author_default_values"();

CREATE TRIGGER "set_author_default_values" BEFORE INSERT ON "public"."topic_chat_messages" FOR EACH ROW EXECUTE FUNCTION "public"."set_author_default_values"();

CREATE TRIGGER "set_notification_read_at" BEFORE UPDATE ON "public"."notifications" FOR EACH ROW EXECUTE FUNCTION "public"."set_notification_read_at"();

CREATE TRIGGER "set_posts_updated_at" BEFORE UPDATE ON "public"."posts" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();

CREATE TRIGGER "set_subject_chat_messages_updated_at" BEFORE UPDATE ON "public"."subject_chat_messages" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();

CREATE TRIGGER "set_subject_details_updated_at" BEFORE UPDATE ON "public"."subject_details" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();

CREATE TRIGGER "set_subject_key_holders_updated_at" BEFORE UPDATE ON "public"."subject_key_holders" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();

CREATE TRIGGER "set_topic_chat_messages_updated_at" BEFORE UPDATE ON "public"."topic_chat_messages" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();

CREATE TRIGGER "set_tracked_event_blocks_updated_at" BEFORE UPDATE ON "public"."tracked_event_blocks" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();

CREATE TRIGGER "set_user_details_updated_at" BEFORE UPDATE ON "public"."user_details" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();

CREATE TRIGGER "set_wallet_total_subject_key_balances_updated_at" BEFORE UPDATE ON "public"."total_subject_key_balances" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();

CREATE TRIGGER "update_subject_key_holder_count" AFTER UPDATE ON "public"."subject_key_holders" FOR EACH ROW EXECUTE FUNCTION "public"."update_subject_key_holder_count"();

CREATE TRIGGER "update_total_subject_key_balance" AFTER UPDATE ON "public"."subject_key_holders" FOR EACH ROW EXECUTE FUNCTION "public"."update_total_subject_key_balance"();

ALTER TABLE ONLY "public"."follows"
    ADD CONSTRAINT "follows_followee_id_fkey" FOREIGN KEY ("followee_id") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."follows"
    ADD CONSTRAINT "follows_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_author_fkey" FOREIGN KEY ("author") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."subject_chat_messages"
    ADD CONSTRAINT "subject_chat_messages_author_fkey" FOREIGN KEY ("author") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."topic_chat_messages"
    ADD CONSTRAINT "topic_chat_messages_author_fkey" FOREIGN KEY ("author") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."user_details"
    ADD CONSTRAINT "user_details_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."wallet_linking_nonces"
    ADD CONSTRAINT "wallet_linking_nonces_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");

CREATE POLICY "can delete only authed" ON "public"."posts" FOR DELETE USING (("author" = "auth"."uid"()));

CREATE POLICY "can follow only follower" ON "public"."follows" FOR INSERT TO "authenticated" WITH CHECK ((("follower_id" = "auth"."uid"()) AND ("follower_id" <> "followee_id")));

CREATE POLICY "can unfollow only follower" ON "public"."follows" FOR DELETE TO "authenticated" USING (("follower_id" = "auth"."uid"()));

CREATE POLICY "can view only holder or owner" ON "public"."subject_chat_messages" FOR SELECT TO "authenticated" USING ((("subject" = ( SELECT "user_details"."wallet_address"
   FROM "public"."user_details"
  WHERE ("user_details"."user_id" = "auth"."uid"()))) OR (1 <= ( SELECT "subject_key_holders"."last_fetched_balance"
   FROM "public"."subject_key_holders"
  WHERE (("subject_key_holders"."subject" = "subject_chat_messages"."subject") AND ("subject_key_holders"."wallet_address" = ( SELECT "user_details"."wallet_address"
           FROM "public"."user_details"
          WHERE ("user_details"."user_id" = "auth"."uid"()))))))));

CREATE POLICY "can write only authed" ON "public"."posts" FOR INSERT TO "authenticated" WITH CHECK ((("message" <> ''::"text") AND ("author" = "auth"."uid"())));

CREATE POLICY "can write only authed" ON "public"."topic_chat_messages" FOR INSERT TO "authenticated" WITH CHECK (((("message" <> ''::"text") OR ("rich" <> NULL::"jsonb")) AND ("author" = "auth"."uid"())));

CREATE POLICY "can write only holder or owner" ON "public"."subject_chat_messages" FOR INSERT TO "authenticated" WITH CHECK ((("auth"."uid"() = "author") AND (("subject" = ( SELECT "user_details"."wallet_address"
   FROM "public"."user_details"
  WHERE ("user_details"."user_id" = "auth"."uid"()))) OR (1 <= ( SELECT "subject_key_holders"."last_fetched_balance"
   FROM "public"."subject_key_holders"
  WHERE (("subject_key_holders"."subject" = "subject_chat_messages"."subject") AND ("subject_key_holders"."wallet_address" = ( SELECT "user_details"."wallet_address"
           FROM "public"."user_details"
          WHERE ("user_details"."user_id" = "auth"."uid"())))))))));

ALTER TABLE "public"."follows" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."posts" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."subject_chat_messages" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."subject_contract_events" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."subject_details" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."subject_key_holders" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."topic_chat_messages" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."total_subject_key_balances" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tracked_event_blocks" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user_details" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "view everyone" ON "public"."follows" FOR SELECT USING (true);

CREATE POLICY "view everyone" ON "public"."subject_contract_events" FOR SELECT USING (true);

CREATE POLICY "view everyone" ON "public"."subject_details" FOR SELECT USING (true);

CREATE POLICY "view everyone" ON "public"."subject_key_holders" FOR SELECT USING (true);

CREATE POLICY "view everyone" ON "public"."topic_chat_messages" FOR SELECT USING (true);

CREATE POLICY "view everyone" ON "public"."total_subject_key_balances" FOR SELECT USING (true);

CREATE POLICY "view everyone" ON "public"."user_details" FOR SELECT USING (true);

CREATE POLICY "view everyone or only keyholders" ON "public"."posts" FOR SELECT USING ((("target" = 0) OR ("author" = "auth"."uid"()) OR (("target" = 1) AND (( SELECT "subject_key_holders"."last_fetched_balance"
   FROM "public"."subject_key_holders"
  WHERE (("subject_key_holders"."subject" = ( SELECT "user_details"."wallet_address"
           FROM "public"."user_details"
          WHERE ("user_details"."user_id" = "posts"."author"))) AND ("subject_key_holders"."wallet_address" = ( SELECT "user_details"."wallet_address"
           FROM "public"."user_details"
          WHERE ("user_details"."user_id" = "auth"."uid"()))))) >= 1))));

ALTER TABLE "public"."wallet_linking_nonces" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."decrease_follow_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."decrease_follow_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."decrease_follow_count"() TO "service_role";

GRANT ALL ON FUNCTION "public"."decrease_subject_key_holder_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."decrease_subject_key_holder_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."decrease_subject_key_holder_count"() TO "service_role";

GRANT ALL ON FUNCTION "public"."decrease_total_subject_key_balance"() TO "anon";
GRANT ALL ON FUNCTION "public"."decrease_total_subject_key_balance"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."decrease_total_subject_key_balance"() TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."increase_follow_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."increase_follow_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."increase_follow_count"() TO "service_role";

GRANT ALL ON FUNCTION "public"."increase_subject_key_holder_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."increase_subject_key_holder_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."increase_subject_key_holder_count"() TO "service_role";

GRANT ALL ON FUNCTION "public"."increase_subject_total_trading_volume_and_fees_earned"() TO "anon";
GRANT ALL ON FUNCTION "public"."increase_subject_total_trading_volume_and_fees_earned"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."increase_subject_total_trading_volume_and_fees_earned"() TO "service_role";

GRANT ALL ON FUNCTION "public"."increase_total_subject_key_balance"() TO "anon";
GRANT ALL ON FUNCTION "public"."increase_total_subject_key_balance"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."increase_total_subject_key_balance"() TO "service_role";

GRANT ALL ON FUNCTION "public"."set_author_default_values"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_author_default_values"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_author_default_values"() TO "service_role";

GRANT ALL ON FUNCTION "public"."set_notification_read_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_notification_read_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_notification_read_at"() TO "service_role";

GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";

GRANT ALL ON FUNCTION "public"."update_subject_key_holder_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_subject_key_holder_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_subject_key_holder_count"() TO "service_role";

GRANT ALL ON FUNCTION "public"."update_total_subject_key_balance"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_total_subject_key_balance"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_total_subject_key_balance"() TO "service_role";

GRANT ALL ON TABLE "public"."follows" TO "anon";
GRANT ALL ON TABLE "public"."follows" TO "authenticated";
GRANT ALL ON TABLE "public"."follows" TO "service_role";

GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";

GRANT ALL ON SEQUENCE "public"."notifications_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."notifications_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."notifications_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."posts" TO "anon";
GRANT ALL ON TABLE "public"."posts" TO "authenticated";
GRANT ALL ON TABLE "public"."posts" TO "service_role";

GRANT ALL ON TABLE "public"."subject_chat_messages" TO "anon";
GRANT ALL ON TABLE "public"."subject_chat_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."subject_chat_messages" TO "service_role";

GRANT ALL ON SEQUENCE "public"."subject_chat_messages_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."subject_chat_messages_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."subject_chat_messages_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."subject_contract_events" TO "anon";
GRANT ALL ON TABLE "public"."subject_contract_events" TO "authenticated";
GRANT ALL ON TABLE "public"."subject_contract_events" TO "service_role";

GRANT ALL ON TABLE "public"."subject_details" TO "anon";
GRANT ALL ON TABLE "public"."subject_details" TO "authenticated";
GRANT ALL ON TABLE "public"."subject_details" TO "service_role";

GRANT ALL ON TABLE "public"."subject_key_holders" TO "anon";
GRANT ALL ON TABLE "public"."subject_key_holders" TO "authenticated";
GRANT ALL ON TABLE "public"."subject_key_holders" TO "service_role";

GRANT ALL ON SEQUENCE "public"."subject_posts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."subject_posts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."subject_posts_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."topic_chat_messages" TO "anon";
GRANT ALL ON TABLE "public"."topic_chat_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."topic_chat_messages" TO "service_role";

GRANT ALL ON SEQUENCE "public"."topic_chat_messages_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."topic_chat_messages_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."topic_chat_messages_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."total_subject_key_balances" TO "anon";
GRANT ALL ON TABLE "public"."total_subject_key_balances" TO "authenticated";
GRANT ALL ON TABLE "public"."total_subject_key_balances" TO "service_role";

GRANT ALL ON TABLE "public"."tracked_event_blocks" TO "anon";
GRANT ALL ON TABLE "public"."tracked_event_blocks" TO "authenticated";
GRANT ALL ON TABLE "public"."tracked_event_blocks" TO "service_role";

GRANT ALL ON TABLE "public"."user_details" TO "anon";
GRANT ALL ON TABLE "public"."user_details" TO "authenticated";
GRANT ALL ON TABLE "public"."user_details" TO "service_role";

GRANT ALL ON TABLE "public"."wallet_linking_nonces" TO "anon";
GRANT ALL ON TABLE "public"."wallet_linking_nonces" TO "authenticated";
GRANT ALL ON TABLE "public"."wallet_linking_nonces" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
