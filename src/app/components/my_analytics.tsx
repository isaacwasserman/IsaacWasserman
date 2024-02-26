import { client, dataset, projectId } from '../../../sanity/lib/client';
import { headers } from 'next/headers'

async function MyAnalytics() {
    // const header = headers();
    // const pathname = header.get('next-url');
    // const ip_address = header.get('x-forwarded-for') || "121.0.0.1";
    // console.log(ip_address);
    // console.log(pathname);

    // let visitor_create_result = await (client.createIfNotExists({
    //     _type: 'visitor',
    //     _id: ip_address,
    //     ip: ip_address
    // }))
    // console.log(visitor_create_result);


    return null;
}

export { MyAnalytics };