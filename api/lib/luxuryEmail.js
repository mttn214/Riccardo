/**
 * Luxury Email Templates and Dispatcher for Hair Salon Riccardo
 * Operator: ZETEREM s.r.o.
 * Strictly no FormSubmit.
 */

export function generateLuxuryReservationEmail(data) {
  const ticketCode = data.ticketCode || 'RIC-2026-LUC-4821';
  const seminarTitle = data.seminarTitle || 'Umenie fukanej: Architektura objemu a Trvacnost';
  const seminarDates = data.seminarDates || 'Nedela, 15. Marec 2026 (09:30 - 17:30)';
  const venue = data.venue || 'Atelier Hair Salon Riccardo, J. Karmana 1727/30, 984 01 Lucenec';
  const customerName = data.customerName || 'Vazeny zakaznik';
  const amountPaid = typeof data.amountPaidEUR === 'number' 
    ? `${data.amountPaidEUR} EUR` 
    : data.amountPaidEUR 
      ? `${data.amountPaidEUR}`.replace(/€/g, '').replace(/EUR/g, '').trim() + ' EUR' 
      : '380 EUR';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(ticketCode)}&color=000000&bgcolor=ffffff`;
  const logoUrl = 'https://hairsalonriccardo.vercel.app/images/riccardo/official_logo_transparent.png';

  return `<!DOCTYPE html>
<html lang="sk">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Potvrdenie rezervacie - Hair Salon Riccardo</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #050507;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #e4e4e7;
      -webkit-font-smoothing: antialiased;
    }
    table { border-collapse: separate; }
    a { color: #c5a059; text-decoration: none; }
    .gold-text { color: #c5a059; }
    .white-text { color: #ffffff; }
    .muted-text { color: #a1a1aa; }
  </style>
</head>
<body style="margin: 0; padding: 30px 10px; background-color: #050507;">
  <center>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; margin: 0 auto; background-color: #0e0e12; border-radius: 24px; border: 1px solid #27272a; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);">
      
      <!-- Top Gold Accent Bar -->
      <tr>
        <td height="4" style="background: linear-gradient(90deg, #c5a059 0%, #f3e5ab 50%, #c5a059 100%); line-height: 4px; font-size: 4px;">&nbsp;</td>
      </tr>

      <!-- Brand Header with Logo -->
      <tr>
        <td style="padding: 36px 40px 24px; text-align: center;">
          <img src="${logoUrl}" alt="Hair Salon Riccardo" width="70" height="70" style="width: 70px; height: 70px; border-radius: 50%; object-fit: contain; margin-bottom: 14px; background: #ffffff; padding: 4px; border: 1px solid rgba(197, 160, 89, 0.4); display: inline-block;">
          <div style="font-size: 11px; font-weight: 700; letter-spacing: 3px; color: #c5a059; text-transform: uppercase; margin-bottom: 4px;">
            RICCARDO ACADEMY
          </div>
          <div style="font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
            Hair Salon Riccardo
          </div>
          <div style="font-size: 11px; color: #71717a; margin-top: 2px;">
            Atelier Richarda Conku / Lucenec
          </div>
        </td>
      </tr>

      <!-- Personal Greeting Card -->
      <tr>
        <td style="padding: 0 40px 28px;">
          <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 16px; padding: 22px 24px;">
            <div style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; color: #34d399; text-transform: uppercase; margin-bottom: 8px;">
              REZERVACIA USPESNA / MIESTO GARANTOVANE
            </div>
            <div style="font-size: 18px; font-weight: 600; color: #ffffff; margin-bottom: 8px;">
              Vazeny/a ${customerName},
            </div>
            <div style="font-size: 13px; line-height: 1.6; color: #a1a1aa;">
              Vasa rezervacia miesta na autorskom masterclasse bola uspesne prijata a zaregistrovana. Tesime sa na vasu osobnu ucast v nasom atelieri.
            </div>
          </div>
        </td>
      </tr>

      <!-- Luxury VIP Ticket Box -->
      <tr>
        <td style="padding: 0 40px 32px;">
          <div style="background: #14141a; border-radius: 20px; border: 1.5px solid #c5a059; padding: 28px 24px; position: relative; box-shadow: inset 0 0 30px rgba(197, 160, 89, 0.05);">
            
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size: 10px; font-weight: 800; letter-spacing: 2px; color: #c5a059; text-transform: uppercase;">
                  OFICIALNY VIP MASTERPASS
                </td>
                <td align="right" style="font-family: monospace; font-size: 13px; font-weight: 700; color: #ffffff; background: rgba(197, 160, 89, 0.2); padding: 4px 10px; border-radius: 8px; border: 1px solid rgba(197, 160, 89, 0.4);">
                  ${ticketCode}
                </td>
              </tr>
            </table>

            <div style="font-size: 20px; font-weight: 700; color: #ffffff; margin: 16px 0 6px; line-height: 1.3;">
              ${seminarTitle}
            </div>
            <div style="font-size: 12px; color: #c5a059; margin-bottom: 22px;">
              Lektor: Richard Conka (Vitaz Czech & Slovak Hairdressing Awards)
            </div>

            <!-- Details Table -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px dashed rgba(197, 160, 89, 0.3); padding-top: 18px; margin-top: 18px;">
              <tr>
                <td width="50%" valign="top" style="padding-bottom: 14px;">
                  <div style="font-size: 10px; text-transform: uppercase; color: #71717a; font-weight: 600; margin-bottom: 3px;">Termin a Cas</div>
                  <div style="font-size: 13px; font-weight: 600; color: #ffffff;">${seminarDates}</div>
                </td>
                <td width="50%" valign="top" style="padding-bottom: 14px;">
                  <div style="font-size: 10px; text-transform: uppercase; color: #71717a; font-weight: 600; margin-bottom: 3px;">Kapacita</div>
                  <div style="font-size: 13px; font-weight: 600; color: #ffffff;">Limitovane (6 ucastnikov)</div>
                </td>
              </tr>
              <tr>
                <td width="50%" valign="top" style="padding-bottom: 14px;">
                  <div style="font-size: 10px; text-transform: uppercase; color: #71717a; font-weight: 600; margin-bottom: 3px;">Miesto konania</div>
                  <div style="font-size: 13px; font-weight: 600; color: #ffffff;">${venue}</div>
                </td>
                <td width="50%" valign="top" style="padding-bottom: 14px;">
                  <div style="font-size: 10px; text-transform: uppercase; color: #71717a; font-weight: 600; margin-bottom: 3px;">Stav uhrady</div>
                  <div style="font-size: 13px; font-weight: 600; color: #34d399;">Uhradene (${amountPaid})</div>
                </td>
              </tr>
            </table>

            <!-- Center Scannable QR Code -->
            <div style="text-align: center; padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.08);">
              <div style="background: #ffffff; padding: 10px; display: inline-block; border-radius: 14px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
                <img src="${qrUrl}" alt="QR Vstupenka" width="130" height="130" style="display: block; width: 130px; height: 130px;">
              </div>
              <div style="font-size: 10px; font-family: monospace; color: #71717a; margin-top: 8px;">
                Predlozte tento QR kod alebo kod <strong style="color: #ffffff;">${ticketCode}</strong> pri vstupe
              </div>
            </div>

          </div>
        </td>
      </tr>

      <!-- Practical Information Section -->
      <tr>
        <td style="padding: 0 40px 32px;">
          <div style="font-size: 13px; font-weight: 700; color: #ffffff; margin-bottom: 12px; letter-spacing: -0.2px;">
            Dolezite informacie k vasmu prichodu
          </div>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 12px; line-height: 1.6; color: #a1a1aa;">
            <tr>
              <td style="padding: 6px 0; vertical-align: top;" width="20">-</td>
              <td style="padding: 6px 0;"><strong style="color: #ffffff;">Harmonogram dna:</strong> Prichod o 09:15 na rannu kavu a registraciu. Skolenie prebieha od 09:30 do 17:30 s prestavkou na obed o 13:00.</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; vertical-align: top;" width="20">-</td>
              <td style="padding: 6px 0;"><strong style="color: #ffffff;">Parkovanie:</strong> Priamo pred rodinnym domom atelieru na ulici J. Karmana 1727/30 je bezplatne parkovisko vyhradene pre ucastnikov.</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; vertical-align: top;" width="20">-</td>
              <td style="padding: 6px 0;"><strong style="color: #ffffff;">V cene seminara:</strong> Modelka na prakticku cast, premiova vlasova kozmetika a spotrebny material, teply obed, celodenny catering a certifikat Master Stylist.</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; vertical-align: top;" width="20">-</td>
              <td style="padding: 6px 0;"><strong style="color: #ffffff;">Co si priniest:</strong> Vlastne oblubene fukacie kefy, spony a stylingove naradie, s ktorym sa vam najlepsie pracuje.</td>
            </tr>
          </table>

          <div style="text-align: center; margin-top: 24px;">
            <a href="https://maps.google.com/maps?q=Hair+Salon+Riccardo,+J.+K%C3%A1rm%C3%A1na+1727%2F30,+Lu%C4%8Denec" target="_blank" style="display: inline-block; padding: 12px 28px; background: #ffffff; color: #000000; font-size: 12px; font-weight: 700; border-radius: 9999px; text-decoration: none;">
              Otvorit trasu v Google Maps
            </a>
          </div>
        </td>
      </tr>

      <!-- Official Billing & Supplier Notice (ZETEREM s.r.o.) -->
      <tr>
        <td style="padding: 24px 40px; background-color: #08080a; border-top: 1px solid #1c1c22; text-align: center; font-size: 11px; color: #52525b; line-height: 1.6;">
          <div style="font-weight: 600; color: #71717a; margin-bottom: 4px;">
            Prevadzkovatel a Organizator vzdelavania:
          </div>
          <div>
            ZETEREM s.r.o. / J. Karmana 1727/30, 984 01 Lucenec
          </div>
          <div>
            ICO: 56 312 871 / DIC: 2122262973 / Neplatitel DPH
          </div>
          <div style="margin-top: 8px; color: #3f3f46;">
            Priamy kontakt: +421 915 869 758 | hair.riccardo@gmail.com
          </div>
        </td>
      </tr>

    </table>
  </center>
</body>
</html>`;
}

export function generateStripeReceiptEmail(data) {
  const customerName = data.customerName || 'Vazeny zakaznik';
  const amountPaid = typeof data.amountPaidEUR === 'number' 
    ? `${data.amountPaidEUR} EUR` 
    : data.amountPaidEUR 
      ? `${data.amountPaidEUR}`.replace(/€/g, '').replace(/EUR/g, '').trim() + ' EUR' 
      : '380 EUR';
  const seminarTitle = data.seminarTitle || 'Umenie fukanej: Architektura objemu a Trvacnost';
  const dateFormatted = new Date().toLocaleDateString('sk-SK', { day: 'numeric', month: 'long', year: 'numeric' });
  const paymentMethod = data.paymentMethod || 'Apple Pay / Platobna karta';
  const receiptId = data.stripePaymentIntentId || `pi_live_${Date.now().toString(36)}`;
  const receiptUrl = data.receiptUrl || '#';

  return `<!DOCTYPE html>
<html lang="sk">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Doklad o platbe - Stripe / Hair Salon Riccardo</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f6f9fc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #32325d;
    }
  </style>
</head>
<body style="margin: 0; padding: 40px 10px; background-color: #f6f9fc;">
  <center>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 540px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e6ebf1; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
      
      <!-- Stripe Header -->
      <tr>
        <td style="padding: 28px 32px 20px; border-bottom: 1px solid #f0f3f7;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size: 15px; font-weight: 700; color: #1a1f36;">
                Hair Salon Riccardo
              </td>
              <td align="right" style="font-size: 12px; color: #697386; font-family: monospace;">
                DOKLAD #${receiptId.slice(-8).toUpperCase()}
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Hero Amount -->
      <tr>
        <td style="padding: 32px; text-align: center; background-color: #fafbfc; border-bottom: 1px solid #f0f3f7;">
          <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #697386; margin-bottom: 6px;">
            Platba uspesna
          </div>
          <div style="font-size: 36px; font-weight: 700; color: #1a1f36;">
            ${amountPaid}
          </div>
          <div style="font-size: 13px; color: #697386; margin-top: 6px;">
            Uhradene dna ${dateFormatted}
          </div>
        </td>
      </tr>

      <!-- Line Item Details -->
      <tr>
        <td style="padding: 24px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px; color: #4f566b;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f3f7;">
                <strong style="color: #1a1f36;">Polozka</strong>
              </td>
              <td align="right" style="padding: 10px 0; border-bottom: 1px solid #f0f3f7;">
                <strong style="color: #1a1f36;">Suma</strong>
              </td>
            </tr>
            <tr>
              <td style="padding: 14px 0; border-bottom: 1px solid #f0f3f7;">
                <div style="font-weight: 600; color: #1a1f36;">${seminarTitle}</div>
                <div style="font-size: 12px; color: #697386; margin-top: 2px;">Zakaznik: ${customerName}</div>
              </td>
              <td align="right" style="padding: 14px 0; border-bottom: 1px solid #f0f3f7; font-weight: 600; color: #1a1f36;">
                ${amountPaid}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #697386;">Sposob platby</td>
              <td align="right" style="padding: 10px 0; color: #1a1f36; font-weight: 500;">${paymentMethod}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #697386;">Stav autorizacie</td>
              <td align="right" style="padding: 10px 0; color: #00a651; font-weight: 600;">Autorizovane (Succeeded)</td>
            </tr>
          </table>

          ${receiptUrl && receiptUrl !== '#' ? `
          <div style="text-align: center; margin-top: 24px;">
            <a href="${receiptUrl}" target="_blank" style="display: inline-block; padding: 10px 22px; background: #635bff; color: #ffffff; font-size: 13px; font-weight: 600; border-radius: 6px; text-decoration: none;">
              Zobrazit online doklad v Stripe
            </a>
          </div>` : ''}
        </td>
      </tr>

      <!-- Stripe & Merchant Footer -->
      <tr>
        <td style="padding: 20px 32px; background-color: #fafbfc; border-top: 1px solid #f0f3f7; font-size: 11px; color: #8792a2; text-align: center; line-height: 1.5;">
          <div>Prijemca platby: ZETEREM s.r.o. / ICO: 56 312 871 / DIC: 2122262973</div>
          <div>J. Karmana 1727/30, 984 01 Lucenec / hair.riccardo@gmail.com</div>
          <div style="margin-top: 6px; color: #a3acb9;">Spracovane cez zabezpecenu platobnu branu Stripe.</div>
        </td>
      </tr>

    </table>
  </center>
</body>
</html>`;
}

export function generateContactEmail(data) {
  const customerName = data.name || data['Meno a priezvisko'] || 'Zaujemca';
  const customerEmail = data.email || data['Email odosielatela'] || 'Neuvedene';
  const customerPhone = data.phone || data['Telefon'] || 'Neuvedene';
  const subjectText = data['Predmet spravy'] || data.subject || 'Sprava z webu';
  const messageText = data['Text spravy'] || data.message || '';
  const dateFormatted = new Date().toLocaleString('sk-SK');

  return `<!DOCTYPE html>
<html lang="sk">
<head>
  <meta charset="utf-8">
  <title>Nova kontaktna sprava - Hair Salon Riccardo</title>
</head>
<body style="margin: 0; padding: 30px 10px; background-color: #050507; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #e4e4e7;">
  <center>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; margin: 0 auto; background-color: #0e0e12; border-radius: 18px; border: 1px solid #27272a; padding: 28px;">
      <tr>
        <td style="font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #c5a059; text-transform: uppercase;">
          HAIR SALON RICCARDO / KONTAKT
        </td>
      </tr>
      <tr>
        <td style="font-size: 18px; font-weight: 700; color: #ffffff; padding: 10px 0 16px;">
          Nova sprava od: ${customerName}
        </td>
      </tr>
      <tr>
        <td style="font-size: 13px; line-height: 1.6; color: #a1a1aa; border-top: 1px solid #27272a; padding-top: 16px;">
          <div><strong>Odosielatel:</strong> ${customerName} &lt;${customerEmail}&gt;</div>
          <div><strong>Telefon:</strong> ${customerPhone}</div>
          <div><strong>Predmet:</strong> ${subjectText}</div>
          <div><strong>Datum:</strong> ${dateFormatted}</div>
          <div style="margin-top: 16px; padding: 14px; background: #14141a; border-radius: 10px; border: 1px solid #27272a; color: #ffffff;">
            ${messageText.replace(/\\n/g, '<br>')}
          </div>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>`;
}
