import { ContactMessage } from '../models/ContactMessage.js';
import { sendContactNotification } from '../utils/mailer.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContact(req, res, next) {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim();
    const message = String(req.body.message || '').trim();

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    const saved = await ContactMessage.create({ name, email, message });
    await sendContactNotification(saved);

    res.status(201).json({ message: 'Message received. We will get back to you soon.' });
  } catch (error) {
    next(error);
  }
}
