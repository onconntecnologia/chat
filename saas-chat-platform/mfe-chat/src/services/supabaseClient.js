import { createClient } from '@supabase/supabase-js';

// Estes valores devem ser substituídos pelos valores reais do seu projeto Supabase
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'your-supabase-key';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;