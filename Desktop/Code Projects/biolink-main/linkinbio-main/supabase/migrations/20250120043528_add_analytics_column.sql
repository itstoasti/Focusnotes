-- Add analytics column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'links' 
    AND column_name = 'analytics'
  ) THEN
    ALTER TABLE "public"."links"
    ADD COLUMN "analytics" jsonb;
  END IF;
END $$; 