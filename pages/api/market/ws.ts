function handler(req, res) {
  // return timestamp every 30sec

  res.status(200).json({ name: 'ws' })
}

export default handler
