export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    service: 'TEC Ecosystem',
    timestamp: Date.now()
  });
}
