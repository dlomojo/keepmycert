export async function POST(req: Request) {
  const { code } = await req.json();
  
  const response = await fetch('https://api.id.me/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.IDME_CLIENT_ID!,
      client_secret: process.env.IDME_CLIENT_SECRET!,
      code,
      grant_type: 'authorization_code',
      redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`
    })
  });
  
  const { access_token } = await response.json();
  
  const userResponse = await fetch('https://api.id.me/api/public/v3/attributes.json?attributes=military', {
    headers: { Authorization: `Bearer ${access_token}` }
  });
  
  const userData = await userResponse.json();
  const isMilitary = userData.attributes?.some((attr: any) => attr.handle === 'military');
  
  return Response.json({ verified: isMilitary });
}