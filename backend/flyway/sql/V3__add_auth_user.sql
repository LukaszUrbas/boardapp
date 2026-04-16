ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(200);

DELETE FROM users;

INSERT INTO users (name, username, password_hash)
VALUES ('Admin', 'admin', '3eb3fe66b31e3b4d10fa70b5cad49c7112294af6ae4e476a1c405155d45aa121');

ALTER TABLE users ALTER COLUMN username SET NOT NULL;
ALTER TABLE users ALTER COLUMN password_hash SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS ux_users_username ON users (username);
