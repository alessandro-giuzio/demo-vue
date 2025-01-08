drop table if exists users;
TRUNCATE auth.users cascade;
create table users (
  id uuid references auth.users on delete cascade not null,
  created_at timestamptz default now(),
  username text unique not null,
  full_name text not null,
  bio text default null,
  avatar_url text default null,
  primary key (id)


  );