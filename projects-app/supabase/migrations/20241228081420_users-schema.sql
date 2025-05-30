drop table if exists users;

create table users (
  id uuid not null,
  created_at timestamptz default now(),
  username text not null,
  full_name text not null,
  bio text default null,
  avatar_url text default null,
  email text not null,
  password text not null,
  constraint users_pkey primary key (id),
  constraint users_username_key unique (username),
  constraint users_email_key unique (email),
  constraint users_id_fkey foreign key (id) references auth.users(id) on delete cascade
);