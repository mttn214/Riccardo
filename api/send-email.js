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
    return res.status(405).json({ success: false, error: 'Metóda nepovolená' });
  }

  try {
    const data = req.body || {};
    const customerEmail = data.email || data['Email odosielateľa'] || data['Email zákazníka'];
    const customerName = data.name || data['Meno a priezvisko'] || 'Záujemca';
    const ticketCode = data['Kód vstupenky'] || 'RIC-VIP';
    const seminarTitle = data['Názov seminára'] || 'Masterclass';
    const dates = data['Termín konania'] || '';
    const venue = data['Miesto konania'] || 'Atelier Riccardo';
    const amount = data['Uhradená suma teraz'] || data['Uhradená suma'] || '';

    const isContact = data.formType === 'Kontaktná správa';
    const isWaitlist = data.formType === 'VIP Waitlist';

    let emailSubject = `[Nová rezervácia] ${data.formType || 'Rezervácia'}: ${customerName} (${ticketCode})`;
    let payload = {};

    if (isContact) {
      const subjectText = data['Predmet správy'] || data.subject || 'Správa z webu';
      emailSubject = `[Kontaktná správa] ${subjectText}: ${customerName}`;
      payload = {
        _subject: emailSubject,
        _template: 'table',
        _captcha: 'false',
        _replyto: customerEmail || undefined,
        'Typ formulára': 'Kontaktná správa',
        'Meno a priezvisko': customerName,
        'Email odosielateľa': customerEmail,
        'Telefón': data.phone || 'Neuvedené',
        'Predmet správy': subjectText,
        'Text správy': data['Text správy'] || data.message || '',
        'Dátum a čas odoslania': new Date().toLocaleString('sk-SK')
      };
    } else if (isWaitlist) {
      emailSubject = `[VIP Waitlist] Záujemca o seminár: ${customerName}`;
      payload = {
        _subject: emailSubject,
        _template: 'table',
        _captcha: 'false',
        _replyto: customerEmail || undefined,
        'Typ formulára': 'VIP Waitlist',
        'Meno a priezvisko': customerName,
        'Email záujemcu': customerEmail,
        'Telefón': data.phone || 'Neuvedené',
        'Preferovaný termín': data['Preferovaný termín'] || data.preferredDate || 'Najbližší možný',
        'Poznámka': data['Poznámka'] || data.note || '',
        'Dátum a čas odoslania': new Date().toLocaleString('sk-SK')
      };
    } else {
      // Standard reservation
      payload = {
        _subject: emailSubject,
        _template: 'table',
        _captcha: 'false',
        _replyto: customerEmail || undefined,
        'Kód vstupenky': ticketCode,
        'Meno a priezvisko': customerName,
        'Email zákazníka': customerEmail,
        'Telefón': data.phone || 'Neuvedené',
        'Názov seminára': seminarTitle,
        'Termín konania': dates,
        'Miesto konania': venue,
        'Zvolený balíček': data['Zvolený balíček'] || 'Standard',
        'Uhradená suma': amount,
        'Spôsob platby': data['Spôsob platby'] || 'Apple Pay',
        'Stav platby': data['Stav platby'] || 'Autorizované',
        'Prevádzkovateľ': 'zeterem s.r.o.',
        'Dátum a čas odoslania': new Date().toLocaleString('sk-SK')
      };
    }

    // Submit to FormSubmit with salon mailbox
    const formSubmitRes = await fetch('https://formsubmit.co/ajax/carlitomio214@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'https://riccardo-zednici.vercel.app',
        'Referer': 'https://riccardo-zednici.vercel.app',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      body: JSON.stringify(payload)
    });

    const resText = await formSubmitRes.text();
    let result = { success: formSubmitRes.ok };
    try {
      result = JSON.parse(resText);
    } catch (e) {
      result = { success: formSubmitRes.ok, message: resText.slice(0, 100) };
    }

    return res.status(200).json({
      success: true,
      deliveredTo: ['carlitomio214@gmail.com', customerEmail].filter(Boolean),
      formSubmitResult: result
    });

  } catch (error) {
    console.error('Chyba odoslania formulára:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Nepodarilo sa odoslať notifikáciu.'
    });
  }
}
