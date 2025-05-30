-- 1. Drop `tasks` first (since it depends on `task_status`)
DROP TABLE IF EXISTS tasks;

-- 2. Then drop and recreate `task_status`
DROP TABLE IF EXISTS task_status;

CREATE TABLE task_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT,
  order_index INT DEFAULT 0
);

-- 3. Recreate `tasks` with FK pointing to task_status
CREATE TABLE tasks (
  id uuid not null default gen_random_uuid(),
  project_id uuid not null,
  assigned_to uuid not null,
  name text not null,
  status current_status not null default 'in-progress',
  description text not null,
  owner_id uuid not null,
  created_at timestamp with time zone default now(),
  tags text[] not null,
  collaborators text[] not null default array[]::text[],
  status_id uuid not null,

  constraint tasks_pkey primary key (id),
  constraint tasks_assigned_to_fkey foreign key (assigned_to) references users(id) on delete cascade,
  constraint tasks_owner_id_fkey foreign key (owner_id) references users(id) on delete cascade,
  constraint tasks_project_id_fkey foreign key (project_id) references projects(id) on delete cascade,
  constraint tasks_status_id_fkey foreign key (status_id) references task_status(id) on delete cascade
);