import { headers } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { isbot } from 'isbot';
const supabaseUrl = 'https://wvklzyidkkrskdgquocj.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function MyAnalytics(props: { route: string }) {
    const header = headers();
    const ip_address = header.get('x-forwarded-for') || "127.0.0.1";
    const route = props.route;
    const user_agent = header.get('user-agent');
    const is_bot = isbot(user_agent);
    const referrer = header.get('referer');

    const { data, error } = await supabase
        .from('visits')
        .insert([
            { ip_address: ip_address, route: route, user_agent: user_agent, is_bot: is_bot, referrer: referrer }
        ])

    if (error) {
        console.log(error);
    }

    return null;
}

export { MyAnalytics };