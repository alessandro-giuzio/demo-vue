-- Drop table if it exists (for clean reinstallation)
drop table if exists user_roles;

-- Create user_roles junction table for many-to-many relationship
create table user_roles (
  id uuid not null default uuid_generate_v4(),
  created_at timestamptz default now(),
  user_id uuid not null,
  role_id uuid not null,
  constraint user_roles_pkey primary key (id),
  constraint user_roles_user_role_key unique (user_id, role_id),
  constraint user_roles_user_id_fkey foreign key (user_id) references users(id) on delete cascade,
  constraint user_roles_role_id_fkey foreign key (role_id) references roles(id) on delete cascade
);

-- Add indexes for performance
create index idx_user_roles_user_id on user_roles (user_id);
create index idx_user_roles_role_id on user_roles (role_id);

-- Enable Row Level Security
alter table user_roles enable row level security;

-- Create RLS policies for user_roles table
create policy "User roles are viewable by the user or admins"
on user_roles for select
to authenticated
using (
  user_id = auth.uid() or
  exists (
    select 1 from user_roles ur
    join roles r on ur.role_id = r.id
    where ur.user_id = auth.uid() and r.key = 'admin'
  )
);

create policy "User roles are manageable by admins"
on user_roles for all
to authenticated
using (
  exists (
    select 1 from user_roles ur
    join roles r on ur.role_id = r.id
    where ur.user_id = auth.uid() and r.key = 'admin'
  )
);