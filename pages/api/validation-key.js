export default function handler(req, res) {
  const validationKey = process.env.PI_VALIDATION_KEY;
  
  if (!validationKey) {
    return res.status(500).send('Validation key not configured');
  }
  
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(validationKey);
}