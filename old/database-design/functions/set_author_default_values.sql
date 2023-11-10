BEGIN
  new.author_name := (SELECT raw_user_meta_data ->> 'full_name' FROM auth.users WHERE id = new.author);
  new.author_avatar_url := (SELECT raw_user_meta_data ->> 'avatar_url' FROM auth.users WHERE id = new.author);
  new.author_x_username := (SELECT raw_user_meta_data ->> 'user_name' FROM auth.users WHERE id = new.author);
  RETURN new;
END;