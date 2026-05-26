/*
  # Create Bible Verses Table

  1. New Tables
    - `verses`
      - `id` (uuid, primary key)
      - `text` (text, the verse content)
      - `reference` (text, e.g., "John 3:16")
      - `book` (text, e.g., "New Testament")
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `verses` table
    - Public read access for displaying verses
    - Authenticated users can insert new verses
*/

CREATE TABLE IF NOT EXISTS verses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  reference text NOT NULL,
  book text NOT NULL DEFAULT 'New Testament',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE verses ENABLE ROW LEVEL SECURITY;

-- Public can read all verses (needed for the app to display them)
CREATE POLICY "Public can view all verses"
  ON verses FOR SELECT
  TO public
  USING (true);

-- Authenticated users can add verses
CREATE POLICY "Authenticated users can add verses"
  ON verses FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert default verses from the app
INSERT INTO verses (text, reference, book) VALUES
  ('For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.', 'John 3:16', 'New Testament'),
  ('The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.', 'Psalm 23:1-3', 'Old Testament'),
  ('Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.', 'Proverbs 3:5-6', 'Old Testament'),
  ('I can do all this through him who gives me strength.', 'Philippians 4:13', 'New Testament'),
  ('For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.', 'Jeremiah 29:11', 'Old Testament'),
  ('And we know that in all things God works for the good of those who love him, who have been called according to his purpose.', 'Romans 8:28', 'New Testament'),
  ('Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.', 'Joshua 1:9', 'Old Testament'),
  ('Come to me, all you who are weary and burdened, and I will give you rest.', 'Matthew 11:28', 'New Testament'),
  ('Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.', 'Philippians 4:6', 'New Testament'),
  ('The Lord is close to the brokenhearted and saves those who are crushed in spirit.', 'Psalm 34:18', 'Old Testament'),
  ('Love is patient, love is kind. It does not envy, it does not boast, it is not proud.', '1 Corinthians 13:4', 'New Testament'),
  ('In the beginning God created the heavens and the earth.', 'Genesis 1:1', 'Old Testament'),
  ('The peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.', 'Philippians 4:7', 'New Testament'),
  ('Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.', 'Psalm 23:4', 'Old Testament'),
  ('Jesus answered, I am the way and the truth and the life. No one comes to the Father except through me.', 'John 14:6', 'New Testament'),
  ('But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.', 'Isaiah 40:31', 'Old Testament'),
  ('For it is by grace you have been saved, through faith — and this is not from yourselves, it is the gift of God.', 'Ephesians 2:8', 'New Testament'),
  ('The name of the Lord is a fortified tower; the righteous run to it and are safe.', 'Proverbs 18:10', 'Old Testament'),
  ('Cast all your anxiety on him because he cares for you.', '1 Peter 5:7', 'New Testament'),
  ('Blessed are the poor in spirit, for theirs is the kingdom of heaven.', 'Matthew 5:3', 'New Testament'),
  ('Your word is a lamp for my feet, a light on my path.', 'Psalm 119:105', 'Old Testament'),
  ('The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you.', 'Numbers 6:24-25', 'Old Testament'),
  ('Ask and it will be given to you; seek and you will find; knock and the door will be opened to you.', 'Matthew 7:7', 'New Testament'),
  ('I have hidden your word in my heart that I might not sin against you.', 'Psalm 119:11', 'Old Testament');
