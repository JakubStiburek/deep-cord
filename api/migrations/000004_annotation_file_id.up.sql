ALTER TABLE annotation
ADD COLUMN file_id UUID NOT NULL;

ALTER TABLE annotation
ADD CONSTRAINT annotation_file_id_fk
FOREIGN KEY (file_id)
REFERENCES file (id);
