\o /dev/null
SET client_min_messages TO error;
CREATE EXTENSION IF NOT EXISTS age;
LOAD 'age';
SET search_path = ag_catalog, "$user", public;

-- Delete graph only if exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM ag_catalog.ag_graph WHERE name = 'graph') THEN
        PERFORM drop_graph('graph', true);
    END IF;
END $$;
SELECT create_graph('graph');
