drop table if exists projects;
create table projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references users(id) not null,
  name text not null,
  description text not null
);