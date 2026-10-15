export default function handler(req, res) {
  if (res && typeof res.status === 'function') {
    return res.status(200).json({ status: 'ok', runtime: 'nodejs' });
  }
  return new Response(JSON.stringify({ status: 'ok', runtime: 'edge' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
