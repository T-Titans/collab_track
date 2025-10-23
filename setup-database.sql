-- Run these commands in PostgreSQL after installation
-- Connect to PostgreSQL as the default 'postgres' user

-- Create the database
CREATE DATABASE collabtrack;

-- Create the user
CREATE USER "collab-tracker" WITH PASSWORD 'Owethuu3';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE collabtrack TO "collab-tracker";

-- Connect to the collabtrack database and grant schema privileges
\c collabtrack;
GRANT ALL ON SCHEMA public TO "collab-tracker";
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "collab-tracker";
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "collab-tracker";
