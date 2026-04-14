CREATE TABLE users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(200) NOT NULL
);

CREATE TABLE projects (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    status VARCHAR(20) NOT NULL,
    CONSTRAINT chk_projects_status CHECK (status IN ('New', 'InProgress', 'OnHold', 'Finished'))
);

CREATE TABLE sub_projects (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id INTEGER NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    status VARCHAR(20) NOT NULL,
    CONSTRAINT fk_sub_projects_project
        FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
    CONSTRAINT chk_sub_projects_status CHECK (status IN ('New', 'InProgress', 'OnHold', 'Finished'))
);

CREATE TABLE tasks (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sub_project_id INTEGER NOT NULL,
    title VARCHAR(300) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    status VARCHAR(20) NOT NULL,
    assignee_id INTEGER NULL,
    CONSTRAINT fk_tasks_sub_project
        FOREIGN KEY (sub_project_id) REFERENCES sub_projects (id) ON DELETE CASCADE,
    CONSTRAINT fk_tasks_assignee
        FOREIGN KEY (assignee_id) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT chk_tasks_status CHECK (status IN ('New', 'InProgress', 'OnHold', 'Finished'))
);

CREATE INDEX idx_sub_projects_project_id ON sub_projects (project_id);
CREATE INDEX idx_tasks_sub_project_id ON tasks (sub_project_id);
CREATE INDEX idx_tasks_assignee_id ON tasks (assignee_id);
CREATE INDEX idx_projects_status ON projects (status);
CREATE INDEX idx_sub_projects_status ON sub_projects (status);
CREATE INDEX idx_tasks_status ON tasks (status);
