import { generateLuxuryReservationEmail, generateStripeReceiptEmail, generateContactEmail } from './lib/luxuryEmail.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Metoda nepovolena' });
  }

  try {
    const data = req.body || {};
    const customerEmail = data.email || data['Email odosielatela'] || data['Email zakaznika'];
    const customerName = data.name || data['Meno a priezvisko'] || 'Zaujemca';
    const ticketCode = data['Kod vstupenky'] || data.ticketCode || 'RIC-VIP';
    const seminarTitle = data['Nazov seminara'] || data.seminarTitle || 'Masterclass';
    const seminarDates = data['Termin konania'] || data.seminarDates || '';
    const venue = data['Miesto konania'] || data.venue || 'Atelier Hair Salon Riccardo, J. Karmana 1727/30, 984 01 Lucenec';
    const amount = data['Uhradena suma teraz'] || data['Uhradena suma'] || data.amountPaidEUR || '380 EUR';

    const isContact = data.formType === 'Kontaktna sprava';
    const isWaitlist = data.formType === 'VIP Waitlist';
    const isTestMode = Boolean(data.testMode);

    let htmlContent = '';
    let emailSubject = '';

    if (isTestMode && data.type === 'stripe_receipt') {
      emailSubject = `Doklad o platbe - Hair Salon Riccardo (${amount})`;
      htmlContent = generateStripeReceiptEmail({
        customerName,
        customerEmail,
        seminarTitle,
        amountPaidEUR: amount,
        stripePaymentIntentId: data.stripePaymentIntentId,
        receiptUrl: data.receiptUrl
      });
    } else if (isContact || isWaitlist) {
      emailSubject = `Hair Salon Riccardo - ${isContact ? 'Kontaktna sprava' : 'VIP Waitlist'}: ${customerName}`;
      htmlContent = generateContactEmail(data);
    } else {
      emailSubject = `Potvrdenie rezervacie a VIP Masterpass - Hair Salon Riccardo (${ticketCode})`;
      htmlContent = generateLuxuryReservationEmail({
        customerName,
        customerEmail,
        customerPhone: data.phone,
        ticketCode,
        seminarTitle,
        seminarDates,
        venue,
        amountPaidEUR: amount
      });
    }

    const recipients = [customerEmail, 'hair.riccardo@gmail.com', 'carlitomio214@gmail.com'].filter(Boolean);
    let deliveryMethod = 'logged';

    // 1. Attempt delivery via Resend API if key is present
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'Hair Salon Riccardo <onboarding@resend.dev>',
          to: recipients,
          subject: emailSubject,
          html: htmlContent
        });
        deliveryMethod = 'resend';
      } catch (resendErr) {
        console.warn('Resend delivery notice:', resendErr.message);
      }
    }

    // 2. Attempt delivery via Nodemailer SMTP if configured
    if (deliveryMethod === 'logged' && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const nodemailer = await import('nodemailer');
        const transporter = nodemailer.default.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '465', 10),
          secure: (process.env.SMTP_PORT || '465') === '465',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });

        await transporter.sendMail({
          from: `Hair Salon Riccardo <${process.env.SMTP_USER}>`,
          to: recipients,
          subject: emailSubject,
          html: htmlContent
        });
        deliveryMethod = 'smtp';
      } catch (smtpErr) {
        console.warn('SMTP delivery notice:', smtpErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      deliveredTo: recipients,
      deliveryMethod,
      ticketCode,
      message: 'Potvrdenie bolo uspesne spracovane bez pouzitia tretich stran.'
    });

  } catch (error) {
    console.error('Chyba odoslania formulara:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Nepodarilo sa odoslat notifikaciu.'
    });
  }
}
