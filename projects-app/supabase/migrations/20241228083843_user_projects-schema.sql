drop table if exists user_projects;
create table user_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) not null,
  project_id uuid  not null,
    created_at timestamp with time zone default now()

  );

/* the seed in supabase is different!! */