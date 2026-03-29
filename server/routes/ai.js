const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const router = express.Router();

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.post('/poruka', async (req, res) => {
  try {
    const { messages } = req.body;
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: 'Ti si AI asistent za planiranje gradnje u Srbiji. Pomažeš investitorima sa pitanjima o dokumentima, procedurama, troškovima i propisima vezanim za gradnju u Srbiji. Odgovaraj na srpskom jeziku, jasno i konkretno.',
      messages: messages,
    });
    res.json({ odgovor: response.content[0].text });
  } catch (err) {
    console.error('Upload greška:', err);
    res.status(500).json({ error: err.message || String(err), stack: err.stack });
  }
});

module.exports = router;
