\o /dev/null
SET client_min_messages TO error;
CREATE EXTENSION IF NOT EXISTS age;
LOAD 'age';
SET search_path = ag_catalog, "$user", public;

SELECT drop_graph('graph_a', true);
SELECT create_graph('graph_a');

-- See documentation https://age.apache.org/age-manual/master/clauses/create.html#create-a-vertex-with-labels-and-properties
\echo 'Create some vertices, some Issues';
SELECT *
FROM cypher('graph_a', $$
    CREATE (
        :Issue
        {
            iid: 1,
            title: 'Issue 1'
        }
    )
$$) as (v agtype);

SELECT *
FROM cypher('graph_a', $$
    CREATE (
        :Issue
        {
            iid: 2,
            title: 'Issue 2'
        }
    )
$$) as (v agtype);

SELECT *
FROM cypher('graph_a', $$
    CREATE (
        :Issue
        {
            iid: 3,
            title: 'Issue 3'
        }
    )
$$) as (v agtype);

SELECT *
FROM cypher('graph_a', $$
    MATCH
        (a:Issue),
        (b:Issue),
        (c:Issue)
    WHERE
        a.iid = 1 AND
        b.iid = 2 AND
        c.iid = 3
    CREATE
        (a)-[rel1:IS_BLOCKED_BY]->(b)
    CREATE
        (c)-[rel2:IS_BLOCKED_BY]->(a)
$$) as (v agtype);

\echo 'Create some Labels (vertices)';
SELECT *
FROM cypher('graph_a', $$
    MATCH
        (a:Issue),
        (b:Issue),
        (c:Issue)
    WHERE
        a.iid = 1 AND
        b.iid = 2 AND
        c.iid = 3

    CREATE (
        l1:Label
        {
            name: 'Bug'
        }
    )
    CREATE (
        l2:Label
        {
            name: 'Feature'
        }
    )
    CREATE (
        l3:Label
        {
            name: 'Spike'
        }
    )

    CREATE
        (a)-[rel3:LABELED_BY]->(l1)


    CREATE
        (b)-[rel4:LABELED_BY]->(l2)

    CREATE
        (c)-[rel5:LABELED_BY]->(l2)

    CREATE
        (c)-[rel6:LABELED_BY]->(l3)
$$) as (v agtype);

\o
\echo 'Query 1: find issue 1 and display its title';
SELECT *
FROM cypher('graph_a', $$
    MATCH (issues:Issue {iid: 3})
    RETURN issues.title
$$) as (issues agtype);

\echo 'Query 2: return Labels (all edges) of issue 1';
SELECT *
FROM cypher('graph_a', $$
    MATCH (n:Issue {iid: 1})-[r:LABELED_BY]->(label)
    RETURN label.name
$$) as (edges agtype);

\echo 'Query 3: find all labels';
SELECT *
FROM cypher('graph_a', $$
    MATCH (label:Label)
    RETURN label.name
$$) as (labels agtype);

\echo 'Query 4: retrieve all "features" issues';
SELECT *
FROM cypher('graph_a', $$
    MATCH (i1:Issue)-[r1:LABELED_BY]->(l1:Label {name: "Feature"})
    RETURN i1.title
$$) as (issues agtype);

\echo 'Query 5: retrieve all "features" issue that are not "spikes"';
SELECT *
FROM cypher('graph_a', $$
    MATCH (i1:Issue)-[r1:LABELED_BY]->(l1:Label {name: "Feature"})
    WHERE NOT EXISTS(
        (i1)-[:LABELED_BY]->(:Label {name: 'Spike'})
    )
    RETURN i1.title
$$) as (issues agtype);

\echo 'Query 6: retrieve all issue 1 children';
SELECT *
FROM cypher('graph_a', $$
    MATCH (root:Issue {iid: 1})-[*]->(child:Issue)
    RETURN DISTINCT child.title
$$) as (issues agtype);

\echo 'Query 7: retrieve all issue 3 children';
SELECT *
FROM cypher('graph_a', $$
    MATCH (root:Issue {iid: 3})-[*]->(child:Issue)
    RETURN DISTINCT child.title
$$) as (issues agtype);
