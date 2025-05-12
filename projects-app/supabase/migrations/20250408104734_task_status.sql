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
ADD COLUMN status_id UUID NOT NULL;

-- 3. Add foreign key constraint for status_id
ALTER TABLE tasks
ADD CONSTRAINT tasks_status_id_fkey
FOREIGN KEY (status_id) REFERENCES task_status(id);

-- 4. (Optional) Insert default statuses
INSERT INTO task_status (name, color, order_index) VALUES
  ('To Do', '#f87171', 1),
  ('In Progress', '#facc15', 2),
  ('Done', '#4ade80', 3);

-- 5. (Optional) Update existing tasks to default to 'To Do'
-- (Only if your table already has rows — otherwise, skip this step)
UPDATE tasks
SET status_id = (
  SELECT id FROM task_status WHERE name = 'To Do'
)
WHERE status_id IS NULL;

-- 6. (Optional) Check for inconsistencies in task_status
SELECT
    name,
    COUNT(*) AS count,
    MIN(order_index) AS min_order_index,
    MAX(order_index) AS max_order_index
FROM
    task_status
GROUP BY
    name
HAVING
    COUNT(*) > 1
    OR MIN(order_index) IS NULL
    OR MAX(order_index) IS NULL;