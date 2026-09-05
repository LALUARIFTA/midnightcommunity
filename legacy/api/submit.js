const MAX_BODY_SIZE = 24 * 1024;

function send(res, status, body) {
  res.status(status).json(body);
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });

  const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
  if (rawBody.length > MAX_BODY_SIZE) return send(res, 413, { error: 'Payload too large' });

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return send(res, 400, { error: 'Invalid JSON' });
  }

  const webhook = body?.type === 'registration'
    ? process.env.DISCORD_REGISTRATION_WEBHOOK
    : body?.type === 'scrim'
      ? process.env.DISCORD_SCRIM_WEBHOOK
      : null;

  if (!webhook || !body?.payload?.embeds?.length) {
    return send(res, 400, { error: 'Invalid submission' });
  }

  try {
    const discordResponse = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body.payload)
    });

    if (!discordResponse.ok && discordResponse.status !== 204) {
      return send(res, 502, { error: 'Upstream notification failed' });
    }

    return send(res, 200, { ok: true });
  } catch {
    return send(res, 502, { error: 'Unable to reach notification service' });
  }
}