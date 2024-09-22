import { serve } from '@hono/node-server'
import { Hono } from "hono";
import { cors } from 'hono/cors'
const app = new Hono();
app.use(cors())

app.post('/verify', async (c) => {
  const req = await c.req.json<{ proof: any, action: any }>();

  const verified = await verifyProof(req.proof, req.action);
  console.log("verified", verified);

  return c.json(verified)
})

app.post('/create', async (c) => {

  const body = await c.req.json<{ id: number }>();
  console.log(body)

  // const app_id = "app_staging_1fe6ccaa14409704f71091493087e46f";
  const app_id = "app_3fce0a48811b44d2fc3e452699a480d4";



  await fetch(`https://developer.worldcoin.org/api/v2/create-action/${app_id}`, {
    method: 'POST',
    headers: {
      'authorization': `Bearer api_a2V5Xzk5ODBlYjU1N2Y2M2IzMjBkMTRkMjI2NzRkOTRhMDZlOnNrXzkyYWQ1NTJjNDFiMmE1ZDMwZTMwNzkxZTQzODQxZTE2OWFmMjkwOGNkOGRkYTY3MQ`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: String(body.id),
      name: String(body.id),
      description: "test World ID in the Worldcoin Developer Documentation",
      max_verifications: 1,
    }),
  })
    .then(res => res.text())
    .then(console.log)
    .catch(console.error)

  return c.json({success: true})
})

const verifyProof = async (proof: any, action: any) => {
  console.log('proof', proof);

  try {

    const response = await fetch(
      // 'https://developer.worldcoin.org/api/v1/verify/app_staging_1fe6ccaa14409704f71091493087e46f',
      'https://developer.worldcoin.org/api/v1/verify/app_3fce0a48811b44d2fc3e452699a480d4',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...proof, action: action }),
      }
    );
    console.log('aavvvvvvv', response?.ok, response?.status, response?.statusText, JSON.stringify(response))

    if (response.ok) {
      const dat = await response.json();
      // console.log('dat', dat);
      return dat;
    } else {
      // const { code, detail } = await response.json();
      // throw new Error(`Error Code ${code}: ${detail}`);
      // throw new Error(`failed.`);
      return { "success": false };
    }

  } catch (error) {
    console.log('abbbb', error)
  }

};

serve({
  fetch: app.fetch,
  port: 3000
}, address => { console.log(address) })
