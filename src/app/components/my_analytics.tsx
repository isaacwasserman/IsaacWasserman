import { headers } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://wvklzyidkkrskdgquocj.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function MyAnalytics() {
    const header = headers();
    const pathname = header.get('next-url') || "/";
    const ip_address = header.get('x-forwarded-for') || "121.0.0.1";

    const { data, error } = await supabase
        .from('visits')
        .insert([
            { ip_address: ip_address, route: pathname }
        ])

    if (error) {
        console.log(error);
    }

    return null;
}

export { MyAnalytics };