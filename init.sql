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

DROP TABLE IF EXISTS public.notes, public.node_aliases;

-- public.notes table

CREATE TABLE public.notes (
    id          SERIAL PRIMARY KEY,
    filename    VARCHAR(255) UNIQUE NOT NULL,
    content     TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX notes_id_index       ON public.notes (id);
CREATE INDEX notes_filename_index ON public.notes (filename);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_notes_updated_at ON public.notes;

CREATE TRIGGER update_notes_updated_at
BEFORE UPDATE ON public.notes
FOR EACH ROW
EXECUTE PROCEDURE public.update_updated_at_column();

-- public.note_aliases table
CREATE TABLE IF NOT EXISTS public.note_aliases (
    note_id    INTEGER NOT NULL REFERENCES public.notes (id),
    name       VARCHAR(255) NOT NULL,

    UNIQUE (note_id, name)
);
CREATE INDEX note_aliases_note_id_index ON public.note_aliases (note_id);
CREATE INDEX note_aliases_name_index    ON public.note_aliases (name);
