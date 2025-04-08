-- Create a new table for task status
create table public.task_status (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text,
  order_index int default 0,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Add some default statuses
insert into public.task_status (name, color, order_index) values
  ('To Do', '#3498db', 1),
  ('In Progress', '#f39c12', 2),
  ('Done', '#2ecc71', 3);

-- Set up Row Level Security (RLS)
alter table public.task_status enable row level security;

-- Create policy for read access
/* create policy "Anyone can read task statuses"
on public.task_status for select
to authenticated
using (true); */

-- Create policy for insert, update, delete (typically for admins only)
/* create policy "Only admins can modify task statuses"
on public.task_status for all
to authenticated
using (auth.uid() in (select auth.uid() from public.users where is_admin = true)); */
