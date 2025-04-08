-- 1. Drop and recreate the task_status table
DROP TABLE IF EXISTS task_status;

CREATE TABLE task_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT,
  order_index INT DEFAULT 0
);

-- 2. Add the status_id column to the tasks table
ALTER TABLE tasks
ADD COLUMN status_id UUID REFERENCES task_status(id) NOT NULL;

-- 3. (Optional) Insert default statuses
INSERT INTO task_status (name, color, order_index) VALUES
  ('To Do', '#f87171', 1),
  ('In Progress', '#facc15', 2),
  ('Done', '#4ade80', 3);

-- 4. (Optional) Update existing tasks to default to 'To Do'
-- (Only if your table already has rows — otherwise, skip this step)
UPDATE tasks
SET status_id = (
  SELECT id FROM task_status WHERE name = 'To Do'
)
WHERE status_id IS NULL;
