-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create base tables first
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  content_type TEXT NOT NULL,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed BOOLEAN NOT NULL DEFAULT false,
  owner_id UUID NOT NULL
);

CREATE TABLE public.document_chunks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT doc_chunk_unique UNIQUE(document_id, chunk_index)
);

-- 3. Create indexes for better performance
CREATE INDEX idx_document_chunks_document_id ON public.document_chunks(document_id);
CREATE INDEX idx_document_chunks_content ON public.document_chunks USING gin(to_tsvector('english', content));
CREATE INDEX idx_chunks_embedding ON public.document_chunks USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);

-- 4. Enable Row Level Security
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for documents
CREATE POLICY "Owner read docs" ON public.documents FOR SELECT USING (auth.role() = 'authenticated' AND auth.uid() = owner_id);
CREATE POLICY "Owner insert docs" ON public.documents FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = owner_id);
CREATE POLICY "Owner update docs" ON public.documents FOR UPDATE USING (auth.role() = 'authenticated' AND auth.uid() = owner_id);
CREATE POLICY "Owner delete docs" ON public.documents FOR DELETE USING (auth.role() = 'authenticated' AND auth.uid() = owner_id);
CREATE POLICY "Service role docs" ON public.documents FOR ALL USING (auth.role() = 'service_role');

-- 6. Create RLS policies for document_chunks
CREATE POLICY "Owner read chunks" ON public.document_chunks FOR SELECT USING (
  auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM public.documents 
    WHERE id = document_chunks.document_id 
    AND owner_id = auth.uid()
  )
);
CREATE POLICY "Owner insert chunks" ON public.document_chunks FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM public.documents 
    WHERE id = document_chunks.document_id 
    AND owner_id = auth.uid()
  )
);
CREATE POLICY "Owner update chunks" ON public.document_chunks FOR UPDATE USING (
  auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM public.documents 
    WHERE id = document_chunks.document_id 
    AND owner_id = auth.uid()
  )
);
CREATE POLICY "Owner delete chunks" ON public.document_chunks FOR DELETE USING (
  auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM public.documents 
    WHERE id = document_chunks.document_id 
    AND owner_id = auth.uid()
  )
);
CREATE POLICY "Service role chunks" ON public.document_chunks FOR ALL USING (auth.role() = 'service_role');

-- 7. Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- 8. Create storage policies
CREATE POLICY "Owner can upload documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');
CREATE POLICY "Owner can view documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents' AND auth.role() = 'authenticated');
CREATE POLICY "Owner can delete documents" ON storage.objects FOR DELETE USING (bucket_id = 'documents' AND auth.role() = 'authenticated');
