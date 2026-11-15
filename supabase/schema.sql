-- شغّل هاد الملف كامل فـ Supabase > SQL Editor
create table profiles(id uuid primary key references auth.users on delete cascade, username text, avatar_url text, email text, bio text default '', theme text default 'dark', lang text default 'ar');
create table servers(id uuid primary key default gen_random_uuid(), name text not null, owner uuid references profiles(id), is_default boolean default false, created_at timestamptz default now());
create table members(server_id uuid references servers on delete cascade, user_id uuid references profiles on delete cascade, primary key(server_id,user_id));
create table channels(id uuid primary key default gen_random_uuid(), server_id uuid references servers on delete cascade, name text not null, kind text check (kind in ('text','voice')), created_at timestamptz default now());
create table messages(id uuid primary key default gen_random_uuid(), channel_id uuid references channels on delete cascade, user_id uuid references profiles on delete cascade, content text not null, created_at timestamptz default now());

insert into servers(id,name,is_default) values ('00000000-0000-0000-0000-000000000001','akkad général',true);
insert into channels(server_id,name,kind) values
 ('00000000-0000-0000-0000-000000000001','général','text'),
 ('00000000-0000-0000-0000-000000000001','vocal-1','voice'),
 ('00000000-0000-0000-0000-000000000001','vocal-2','voice');

create function handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into profiles(id,username,avatar_url,email) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)), new.raw_user_meta_data->>'avatar_url', new.email);
  insert into members(server_id,user_id) values ('00000000-0000-0000-0000-000000000001', new.id);
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

alter table profiles enable row level security; alter table servers enable row level security; alter table members enable row level security; alter table channels enable row level security; alter table messages enable row level security;
create policy "read" on profiles for select to authenticated using (true);
create policy "upd own" on profiles for update to authenticated using (id=auth.uid());
create policy "read" on servers for select to authenticated using (is_default or owner=auth.uid() or id in (select server_id from members where user_id=auth.uid()));
create policy "ins" on servers for insert to authenticated with check (owner=auth.uid());
create policy "read" on members for select to authenticated using (true);
create policy "join self" on members for insert to authenticated with check (user_id=auth.uid());
create policy "read" on channels for select to authenticated using (true);
create policy "ins" on channels for insert to authenticated with check (server_id in (select id from servers where owner=auth.uid()));
create policy "read" on messages for select to authenticated using (true);
create policy "ins own" on messages for insert to authenticated with check (user_id=auth.uid());
create policy "del own" on messages for delete to authenticated using (user_id=auth.uid());

alter publication supabase_realtime add table messages;
alter table messages replica identity full;
insert into storage.buckets(id,name,public) values ('uploads','uploads',true);
create policy "up" on storage.objects for insert to authenticated with check (bucket_id='uploads');
