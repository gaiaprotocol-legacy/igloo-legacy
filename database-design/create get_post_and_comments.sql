CREATE OR REPLACE FUNCTION get_post_and_comments(p_post_id int8)
RETURNS TABLE (
    id int8,
    target int2,
    author uuid,
    message text,
    translated jsonb,
    rich jsonb,
    parent int8,
    comment_count int4,
    repost_count int4,
    like_count int4,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    depth int4
)
LANGUAGE SQL AS $$
WITH RECURSIVE ancestors AS (
    SELECT *, 0 AS depth
    FROM posts 
    WHERE id = p_post_id

    UNION

    SELECT p.*, a.depth - 1 AS depth
    FROM posts p
    JOIN ancestors a ON p.id = a.parent
),
descendants AS (
    SELECT *, 1 AS depth
    FROM posts
    WHERE parent = p_post_id

    UNION

    SELECT p.*, d.depth + 1 AS depth
    FROM posts p
    JOIN descendants d ON p.parent = d.id
)
SELECT * FROM ancestors
UNION ALL
SELECT * FROM descendants
ORDER BY depth, created_at;
$$;
