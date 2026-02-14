
-- Create table for persisting chat messages
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for fast session lookups
CREATE INDEX idx_chat_messages_session ON public.chat_messages (session_id, created_at);

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (no auth required, uses session_id)
CREATE POLICY "Anyone can insert messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read their own session messages
CREATE POLICY "Anyone can read messages by session"
  ON public.chat_messages FOR SELECT
  USING (true);

-- Allow deletion for clearing chat
CREATE POLICY "Anyone can delete messages by session"
  ON public.chat_messages FOR DELETE
  USING (true);
