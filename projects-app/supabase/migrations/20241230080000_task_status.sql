-- 1. Create the task_status table if it doesn't exist
CREATE TABLE IF NOT EXISTS task_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT,
  order_index INT DEFAULT 0
);

-- 2. Insert default statuses (skip if already present)
INSERT INTO task_status (name, color, order_index) VALUES
  ('To Do', '#f87171', 1),
  ('In Progress', '#facc15', 2),
  ('Done', '#4ade80', 3)
ON CONFLICT DO NOTHING;