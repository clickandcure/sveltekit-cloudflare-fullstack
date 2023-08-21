import { json } from "@sveltejs/kit";
import { User } from '../../../schema'

import { drizzle } from 'drizzle-orm/d1'

import { createD1 } from 'cf-workers-proxy'

export async function GET({ platform, url }) {
    try {

        const myDb = platform?.env?.DB ?? createD1('DB', { hostname: 'http://127.0.0.1:8787' });
        const db = await drizzle(myDb);

        const result = await db.select().from(User)
            .all();

        return json(
            {
                payload: result
            }
        )
    } catch (error) {
        console.log(error);

        return json({ error: error.message })
    }
}

export async function POST({ request, platform, }) {
    try {

        const myDb = platform?.env?.DB ?? createD1('DB', { hostname: 'http://127.0.0.1:8787' });
        const db = await drizzle(myDb);

        const { name, age }: any = await request.json();


        const result = await db.insert(User).values({ name, age })
            .returning().get();

        return json(
            {
                payload: result
            }
        )
    } catch (error) {
        console.log(error);

        return json({ error: error.message })
    }
}
