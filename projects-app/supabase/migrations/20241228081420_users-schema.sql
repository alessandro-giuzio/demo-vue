drop table if exists users;
TRUNCATE auth.users cascade;
create table users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  email text unique not null,
  password text not null,
  created_at timestamp with time zone default now()
  );