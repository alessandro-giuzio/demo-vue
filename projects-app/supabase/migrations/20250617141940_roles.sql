-- Drop table if it exists (for clean reinstallation)
drop table if exists roles;

-- Create roles table
create table roles (
  id uuid not null default uuid_generate_v4(),
  created_at timestamptz default now(),
  key text not null,
  description text not null,
  constraint roles_pkey primary key (id),
  constraint roles_key_key unique (key)
);

-- Enable Row Level Security
alter table roles enable row level security;

-- Create RLS policies for roles table
create policy "Roles are viewable by authenticated users"
on roles for select
to authenticated
using (true);

create policy "Roles are manageable by admins"
on roles for all
to authenticated
using (
  exists (
    select 1 from auth.users
    where id = auth.uid() and raw_user_meta_data->>'is_admin' = 'true'
  )
);