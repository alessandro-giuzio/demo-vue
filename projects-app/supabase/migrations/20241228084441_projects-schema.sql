drop table if exists projects;
drop type if exists current_status;
create type current_status as enum ('in-progress', 'completed');
create table projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references users(id) not null,
  name text not null,
  description text not null default '',
  slug text unique not null,
  status current_status default 'in-progress' not null,
  collaborators text array default array[]::varchar[] not null
);