import { serve } from '@hono/node-server'
import { Hono } from "hono";
import { cors } from 'hono/cors'
const app = new Hono();
app.use(cors())

app.post('/verify', async (c) => {
  const req = await c.req.json<{ proof: any, action: any }>();

  const verified = await verifyProof(req.proof, req.action);
  console.log("verified", verified);

  return c.json( verified )
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
