import { createClient } from "@supabase/supabase-js"


const supabaseUrl = 'https://lrshfghpkutlyjbvqrez.supabase.co';// Project URL
const supabaseKey = 'sb_publishable_dQAp0H5qT2Z2KiVbOXUPOw_9bpEXDPH' // Publishable key

export const supabase = createClient(supabaseUrl, supabaseKey)