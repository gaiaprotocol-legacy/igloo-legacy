CREATE OR REPLACE FUNCTION get_following_subjects(
    p_user_id uuid
)
RETURNS TABLE (
    subject text,
    owner_user_id uuid,
    owner_wallet_address text,
    owner_total_earned_trading_fees numeric,
    owner_display_name text,
    owner_profile_image text,
    owner_profile_image_thumbnail text,
    owner_profile_image_stored bool,
    owner_x_username text,
    owner_metadata jsonb,
    owner_follower_count int4,
    owner_following_count int4,
    owner_blocked bool,
    owner_created_at timestamp with time zone,
    owner_updated_at timestamp with time zone,
    last_fetched_key_price numeric,
    total_trading_key_volume numeric,
    total_earned_trading_fees numeric,
    is_key_price_up bool,
    last_message text,
    last_message_sent_at timestamp with time zone,
    key_holder_count int4,
    last_key_purchased_at timestamp with time zone,
    owned_key_count int4,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.subject,
        u.user_id AS owner_user_id,
        u.wallet_address AS owner_wallet_address,
        u.total_earned_trading_fees AS owner_total_earned_trading_fees,
        u.display_name AS owner_display_name,
        u.profile_image AS owner_profile_image,
        u.profile_image_thumbnail AS owner_profile_image_thumbnail,
        u.profile_image_stored AS owner_profile_image_stored,
        u.x_username AS owner_x_username,
        u.metadata AS owner_metadata,
        u.follower_count AS owner_follower_count,
        u.following_count AS owner_following_count,
        u.blocked AS owner_blocked,
        u.created_at AS owner_created_at,
        u.updated_at AS owner_updated_at,
        s.last_fetched_key_price,
        s.total_trading_key_volume,
        s.total_earned_trading_fees,
        s.is_key_price_up,
        s.last_message,
        s.last_message_sent_at,
        s.key_holder_count,
        s.last_key_purchased_at,
        s.owned_key_count,
        s.created_at,
        s.updated_at
    FROM 
        subjects s
    INNER JOIN 
        users_public u ON s.subject = u.wallet_address
    INNER JOIN 
        follows f ON u.user_id = f.followee_id
    WHERE 
        f.follower_id = p_user_id;
END;
$$ LANGUAGE plpgsql;
