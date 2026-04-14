INSERT INTO users (name)
VALUES
    ('Alice'),
    ('Bob'),
    ('Claire');

WITH website_redesign AS (
    INSERT INTO projects (name, description, status)
    VALUES ('Website Redesign', 'Refresh the homepage and update branding.', 'InProgress')
    RETURNING id
),
product_launch AS (
    INSERT INTO projects (name, description, status)
    VALUES ('Product Launch', 'Coordinate launch campaign.', 'New')
    RETURNING id
),
frontend_redesign AS (
    INSERT INTO sub_projects (project_id, name, description, status)
    SELECT id, 'Frontend Redesign', 'Update UI components and styles', 'InProgress'
    FROM website_redesign
    RETURNING id
),
backend_updates AS (
    INSERT INTO sub_projects (project_id, name, description, status)
    SELECT id, 'Backend Updates', 'Update APIs and database schema', 'New'
    FROM website_redesign
    RETURNING id
),
marketing_campaign AS (
    INSERT INTO sub_projects (project_id, name, description, status)
    SELECT id, 'Marketing Campaign', 'Plan and execute marketing activities', 'New'
    FROM product_launch
    RETURNING id
)
INSERT INTO tasks (sub_project_id, title, description, status, assignee_id)
SELECT
    (SELECT id FROM frontend_redesign),
    'Design hero section',
    'Create wireframes and mockups.',
    'InProgress',
    (SELECT id FROM users WHERE name = 'Alice' ORDER BY id LIMIT 1)
UNION ALL
SELECT
    (SELECT id FROM marketing_campaign),
    'Write launch email',
    'Draft copy for the kickoff email.',
    'New',
    (SELECT id FROM users WHERE name = 'Bob' ORDER BY id LIMIT 1);
