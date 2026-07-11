import { createClient } from "@supabase/supabase-js"


const supabaseUrl = 'https://hgmkfbhqhsesvyacmwox.supabase.co' // Project URL
const supabaseKey = 'sb_publishable_sQWuUavzX3LhroLRCYA5AA_WVDOettT' // Publishable key

export const supabase = createClient(supabaseUrl, supabaseKey)