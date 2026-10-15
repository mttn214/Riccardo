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
    const customerEmail = data.email || data['Email odosielateľa'];
    const customerName = data.name || data['Meno a priezvisko'] || 'Vážený zákazník';
    const ticketCode = data['Kód vstupenky'] || 'RIC-VIP';
    const seminarTitle = data['Názov seminára'] || 'Masterclass';
    const dates = data['Termín konania'] || '';
    const venue = data['Miesto konania'] || 'Atelier Riccardo';
    const amount = data['Uhradená suma teraz'] || '';

    const autoresponseMessage = `Dobrý deň ${customerName},

Ďakujeme za Vašu rezerváciu seminára v Hair Salon Riccardo (zeterem s.r.o.). Vaša platba a rezervácia boli úspešne potvrdené.

-------------------------------------------
OFICIÁLNY KÓD VSTUPENKY: ${ticketCode}
-------------------------------------------

Seminár: ${seminarTitle}
Termín konania: ${dates}
Miesto konania: ${venue}
Zvolený balíček: ${data['Zvolený balíček'] || 'Účasť'}
Uhradená suma: ${amount}
Spôsob platby: ${data['Spôsob platby'] || 'Apple Pay'}
Stav: Potvrdené a garantované

Tento kód alebo vstupenku predložte pri vstupe na recepcii.
V prípade otázok nás môžete kedykoľvek kontaktovať na tel. čísle: +421 908 261 740.

S pozdravom,
Richard Čonka & tím Hair Salon Riccardo
Prevádzkovateľ eshopu: zeterem s.r.o.`;

    // 1. Submit to FormSubmit with _cc and _autoresponse for both salon and customer
    const formSubmitRes = await fetch('https://formsubmit.co/ajax/carlitomio214@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'https://riccardo-zednici.vercel.app',
        'Referer': 'https://riccardo-zednici.vercel.app'
      },
      body: JSON.stringify({
        _subject: `[Riccardo Salon] ${data.formType || 'Rezervácia'}: ${customerName} (${ticketCode})`,
        _template: 'table',
        _captcha: 'false',
        _cc: customerEmail || undefined,
        _replyto: customerEmail || undefined,
        _autoresponse: autoresponseMessage,
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
      })
    });

    const result = await formSubmitRes.json();

    return res.status(200).json({
      success: true,
      deliveredTo: ['carlitomio214@gmail.com', customerEmail].filter(Boolean),
      formSubmitResult: result
    });
  } catch (error) {
    console.error('Chyba odoslania emailu:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Nepodarilo sa odoslať notifikáciu.'
    });
  }
}
