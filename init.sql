\o /dev/null
SET client_min_messages TO error;
CREATE EXTENSION IF NOT EXISTS age;
LOAD 'age';
SET search_path = ag_catalog, "$user", public;

SELECT drop_graph('graph', true);
SELECT create_graph('graph');
