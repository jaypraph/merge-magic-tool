// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tltfnzgwovgxmnqthwkq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsdGZuemd3b3ZneG1ucXRod2txIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3NzI5MjUsImV4cCI6MjA1MDM0ODkyNX0.nilPiSAtmfWPsVsrrvs9R39MNCnnhP3T09bkq4r8q9k";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);