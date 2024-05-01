"use server";
import { client, dataset, projectId } from "../../../sanity/lib/client";
import { groq } from "next-sanity";

import { redirect } from "next/navigation";

export default async function GET() {
    const query = groq`*[_type == "author"] {
        resume {
            ...,
            asset->
        }
    }`;
    let bio = (await client.fetch(query))[0];
    console.log(bio);
    let resumeUrl = bio.resume.asset.url;

    redirect(resumeUrl);
}
