ALTER TABLE annotation 
ADD COLUMN confidence NUMERIC NOT NULL DEFAULT 1,
ADD CONSTRAINT confidence_range_check CHECK (confidence >= 0 AND confidence <= 1);
