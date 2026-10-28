export interface LuxuryEmailData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  ticketCode: string;
  seminarTitle: string;
  seminarDates: string;
  seminarCity?: string;
  venue?: string;
  tierName?: string;
  amountPaidEUR?: string | number;
  paymentMethod?: string;
  invoicePrefix?: string;
}

export function generateLuxuryEmailHtml(data: LuxuryEmailData): string {
  const ticketCode = data.ticketCode || 'RIC-2026-LUC-4821';
  const seminarTitle = data.seminarTitle || 'Architektúra objemu & Trvácnosť: Styling Masterclass';
  const seminarDates = data.seminarDates || 'Nedeľa, 15. marec 2026 (09:30 – 17:30)';
  const venue = data.venue || 'Ateliér Hair Salon Riccardo, J. Kármána 1727/30, 984 01 Lučenec';
  const customerName = data.customerName || 'Vážený zákazník';
  const amountPaid = typeof data.amountPaidEUR === 'number' 
    ? `${data.amountPaidEUR} €` 
    : data.amountPaidEUR 
      ? `${data.amountPaidEUR}`.replace(/€/g, '').replace(/EUR/g, '').trim() + ' €' 
      : '380 €';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(ticketCode)}&color=000000&bgcolor=ffffff`;
  const logoUrl = 'https://hairsalonriccardo.vercel.app/images/riccardo/official_logo_dark_square.png';

  return `<!DOCTYPE html>
<html lang="sk">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Potvrdenie rezervácie — Hair Salon Riccardo</title>
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
            Ateliér Richarda Čonku • Lučenec
          </div>
        </td>
      </tr>

      <!-- Personal Greeting & Warm Gratitude Card -->
      <tr>
        <td style="padding: 0 40px 24px;">
          <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 16px; padding: 22px 24px;">
            <div style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; color: #34d399; text-transform: uppercase; margin-bottom: 8px;">
              REZERVÁCIA ÚSPEŠNÁ • MIESTO GARANTOVANÉ
            </div>
            <div style="font-size: 18px; font-weight: 600; color: #ffffff; margin-bottom: 10px;">
              Vážený/á ${customerName},
            </div>
            <div style="font-size: 13px; line-height: 1.6; color: #a1a1aa; margin-bottom: 14px;">
              ďakujeme vám za prejavenú dôveru a úhradu rezervácie na autorskom masterclasse v našom ateliéri. Veľmi si vážime vaše rozhodnutie posunúť svoje kadernícke zručnosti na vyššiu úroveň.
            </div>
            <div style="font-size: 13px; line-height: 1.6; color: #d4d4d8; background: rgba(197, 160, 89, 0.08); border-left: 3px solid #c5a059; padding: 10px 14px; border-radius: 6px;">
              Vaša rezervácia bola úspešne prijatá a vaše miesto v ateliéri máte 100 % garantované. Tešíme sa na spoločný inšpiratívny deň plný praxe a profesionálneho know-how.
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
                  OFICIÁLNY VIP MASTERPASS
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
              Lektor: Richard Čonka (Víťaz Czech & Slovak Hairdressing Awards)
            </div>

            <!-- Details Table -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px dashed rgba(197, 160, 89, 0.3); padding-top: 18px; margin-top: 18px;">
              <tr>
                <td width="50%" valign="top" style="padding-bottom: 14px;">
                  <div style="font-size: 10px; text-transform: uppercase; color: #71717a; font-weight: 600; margin-bottom: 3px;">Termín & Čas</div>
                  <div style="font-size: 13px; font-weight: 600; color: #ffffff;">${seminarDates}</div>
                </td>
                <td width="50%" valign="top" style="padding-bottom: 14px;">
                  <div style="font-size: 10px; text-transform: uppercase; color: #71717a; font-weight: 600; margin-bottom: 3px;">Kapacita</div>
                  <div style="font-size: 13px; font-weight: 600; color: #ffffff;">Limitované (6 účastníkov)</div>
                </td>
              </tr>
              <tr>
                <td width="50%" valign="top" style="padding-bottom: 14px;">
                  <div style="font-size: 10px; text-transform: uppercase; color: #71717a; font-weight: 600; margin-bottom: 3px;">Miesto konania</div>
                  <div style="font-size: 13px; font-weight: 600; color: #ffffff;">${venue}</div>
                </td>
                <td width="50%" valign="top" style="padding-bottom: 14px;">
                  <div style="font-size: 10px; text-transform: uppercase; color: #71717a; font-weight: 600; margin-bottom: 3px;">Stav úhrady</div>
                  <div style="font-size: 13px; font-weight: 600; color: #34d399;">Uhradené (${amountPaid})</div>
                </td>
              </tr>
            </table>

            <!-- Center Scannable QR Code -->
            <div style="text-align: center; padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.08);">
              <div style="background: #ffffff; padding: 10px; display: inline-block; border-radius: 14px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
                <img src="${qrUrl}" alt="QR Vstupenka" width="130" height="130" style="display: block; width: 130px; height: 130px;">
              </div>
              <div style="font-size: 10px; font-family: monospace; color: #71717a; margin-top: 8px;">
                Predložte tento QR kód alebo kód <strong style="color: #ffffff;">${ticketCode}</strong> pri vstupe
              </div>
            </div>

          </div>
        </td>
      </tr>

      <!-- Practical Information Section -->
      <tr>
        <td style="padding: 0 40px 32px;">
          <div style="font-size: 13px; font-weight: 700; color: #ffffff; margin-bottom: 12px; letter-spacing: -0.2px;">
            Dôležité informácie k vášmu príchodu
          </div>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 12px; line-height: 1.6; color: #a1a1aa;">
            <tr>
              <td style="padding: 6px 0; vertical-align: top;" width="20">•</td>
              <td style="padding: 6px 0;"><strong style="color: #ffffff;">Harmonogram dňa:</strong> Príchod o 09:15 na rannú kávu a registráciu. Školenie prebieha od 09:30 do 17:30 s prestávkou na teplý obed o 13:00.</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; vertical-align: top;" width="20">•</td>
              <td style="padding: 6px 0;"><strong style="color: #ffffff;">Parkovanie:</strong> Priamo pred rodinným domom ateliéru na ulici J. Kármána 1727/30 je bezplatné parkovisko vyhradené pre účastníkov.</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; vertical-align: top;" width="20">•</td>
              <td style="padding: 6px 0;"><strong style="color: #ffffff;">V cene seminára:</strong> Živá modelka na praktickú časť, prémiová vlasová kozmetika a spotrebný materiál, teplý obed, celodenný catering a certifikát Master Stylist.</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; vertical-align: top;" width="20">•</td>
              <td style="padding: 6px 0;"><strong style="color: #ffffff;">Čo si priniesť:</strong> Vlastné obľúbené fúkacie kefy, spony a stylingové náradie, s ktorým sa vám najlepšie pracuje.</td>
            </tr>
          </table>

          <div style="text-align: center; margin-top: 24px;">
            <a href="https://maps.google.com/maps?q=Hair+Salon+Riccardo,+J.+K%C3%A1rm%C3%A1na+1727%2F30,+Lu%C4%8Denec" target="_blank" style="display: inline-block; padding: 12px 28px; background: #ffffff; color: #000000; font-size: 12px; font-weight: 700; border-radius: 9999px; text-decoration: none;">
              Otvoriť trasu v Google Maps
            </a>
          </div>
        </td>
      </tr>

      <!-- Warm Closing Sign-off -->
      <tr>
        <td style="padding: 0 40px 28px; text-align: center;">
          <div style="font-size: 13px; color: #a1a1aa; line-height: 1.6;">
            S úctou a priateľským pozdravom,
          </div>
          <div style="font-size: 15px; font-weight: 700; color: #ffffff; margin-top: 4px;">
            Richard Čonka & tím Hair Salon Riccardo
          </div>
        </td>
      </tr>

      <!-- Official Billing & Supplier Notice (ZETEREM s.r.o.) -->
      <tr>
        <td style="padding: 24px 40px; background-color: #08080a; border-top: 1px solid #1c1c22; text-align: center; font-size: 11px; color: #52525b; line-height: 1.6;">
          <div style="font-weight: 600; color: #71717a; margin-bottom: 4px;">
            Prevádzkovateľ & Organizátor vzdelávania:
          </div>
          <div>
            ZETEREM s.r.o. • J. Kármána 1727/30, 984 01 Lučenec
          </div>
          <div>
            IČO: 56 312 871 • DIČ: 2122262973 • Neplatiteľ DPH
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
