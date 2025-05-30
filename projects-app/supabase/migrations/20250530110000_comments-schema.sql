-- Migration: Sync remote `comments` table
-- Add this to your migrations folder with a timestamped filename, e.g.:
-- 20250530_sync_comments_table.sql

create table if not exists public.comments (
  id bigint generated always as identity primary key,
  content text not null,
  task_id uuid,
  project_id uuid,
  user_id uuid not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  attachments jsonb not null default '[]'::jsonb,
  constraint comments_task_id_fkey foreign key (task_id) references public.tasks(id) on delete cascade,
  constraint comments_project_id_fkey foreign key (project_id) references public.projects(id) on delete cascade,
  constraint comments_user_id_fkey foreign key (user_id) references public.users(id) on delete cascade,
  constraint only_one_target check (
    (
      (task_id is not null and project_id is null) or
      (task_id is null and project_id is not null)
    )
  )
);

-- Indexes for filtering by task/project
create index if not exists comments_task_id_idx on public.comments (task_id);
create index if not exists comments_project_id_idx on public.comments (project_id);