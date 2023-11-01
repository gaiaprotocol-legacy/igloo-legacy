CREATE OR REPLACE FUNCTION get_post_and_comments(p_post_id int8)
RETURNS TABLE (
    id int8,
    group_id int8,
    target int2,
    author uuid,
    author_name text,
    author_avatar_url text,
    author_x_username text,
    message text,
    translated jsonb,
    rich jsonb,
    post_ref int8,
    comment_count int4,
    repost_count int4,
    like_count int4,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    depth int4
)
LANGUAGE SQL AS $$
WITH RECURSIVE comment_tree AS (
    SELECT *, 1 AS depth
    FROM posts 
    WHERE id = p_post_id

    UNION ALL

    SELECT p.*, ct.depth + 1 AS depth
    FROM posts p
    JOIN comment_tree ct ON p.post_ref = ct.id
)
SELECT * FROM comment_tree ORDER BY depth, created_at;
$$;