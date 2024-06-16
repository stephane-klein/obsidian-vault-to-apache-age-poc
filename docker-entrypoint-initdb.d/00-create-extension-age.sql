CREATE EXTENSION age;
LOAD 'age';
SET search_path = ag_catalog, "$user", public, graph;
ALTER DATABASE postgres SET search_path TO ag_catalog, "$user", public, graph;
