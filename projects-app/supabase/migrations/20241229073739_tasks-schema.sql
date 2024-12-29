drop table if exists tasks;

create table tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) not null,
  name text not null,
  description text not null,
  owner_id uuid references users(id) not null,
  status text not null,
  created_at timestamp with time zone default now(),
  tags text[] not null
);