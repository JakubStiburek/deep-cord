ALTER TABLE annotation
DROP CONSTRAINT annotation_file_id_fk;

ALTER TABLE annotation
DROP COLUMN file_id;

