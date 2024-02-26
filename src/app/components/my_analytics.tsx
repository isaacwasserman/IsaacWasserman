import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, useCdn } from '../../../sanity/env'
import { headers } from 'next/headers'
import { time } from 'console';

const client = createClient({
    apiVersion,
    dataset,
    projectId,
    useCdn,
    token: process.env.SANITY_SECRET_TOKEN
})

const generate_id = function(){
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

async function MyAnalytics() {
    // const header = headers();
    // const pathname = header.get('next-url') || "/";
    // const ip_address = header.get('x-forwarded-for') || "121.0.0.1";
    // console.log(ip_address);
    // console.log(pathname);

    // let visitor_id = "visitor_" + ip_address;
    // let visit_id = "visit_" + generate_id();

    // let visitor_create_result = await (client.createIfNotExists({
    //     _type: 'visitor',
    //     _id: visitor_id,
    //     ip: ip_address,
    //     visits: []
    // }))

    // let visit_create_result = await (client.createIfNotExists({
    //     _type: 'visit',
    //     _id: visit_id,
    //     route: pathname,
    //     visitor_ip: ip_address
    // }))
    // console.log(visit_create_result);

    // let visitor_update_result = await (client.patch(visitor_id, {
    //     insert: {
    //         before: "visits[0]",
    //         items: [{
    //             _type: 'reference',
    //             _ref: visit_id
    //         }]
    //     }
    // }))
    // console.log(visitor_update_result);
    // console.log(visitor_update_result.operations.insert.items);

    return null;
}

export { MyAnalytics };