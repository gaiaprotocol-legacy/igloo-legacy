create function public.set_user_metadata_to_details()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users_public (user_id, display_name, profile_image, x_username)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_user_meta_data ->> 'user_name'
  ) on conflict (user_id) do update
  set
    display_name = new.raw_user_meta_data ->> 'full_name',
    profile_image = new.raw_user_meta_data ->> 'avatar_url',
    x_username = new.raw_user_meta_data ->> 'user_name';
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.set_user_metadata_to_details();

create trigger on_auth_user_updated
  after update on auth.users
  for each row execute procedure public.set_user_metadata_to_details();