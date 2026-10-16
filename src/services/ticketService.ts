import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { COMPANY_DETAILS } from '../data/content';

export interface TicketData {
  confirmationCode: string;
  seminarTitle: string;
  dates: string;
  city: string;
  venue: string;
  attendeeName: string;
  salonName?: string;
  email: string;
  tierName: string;
  amountPaidEUR: number;
  paymentMethod: string;
  paymentStatus: string;
}

/**
 * Generates an ultra-luxurious, printable VIP Ticket PDF for Hair Salon Riccardo / ZETEREM s.r.o.
 * Uses high-DPI Canvas for pixel-perfect typography, gold foiling, and anti-counterfeit details.
 */
export async function generateLuxuryTicketPDF(data: TicketData): Promise<void> {
  // 1. Generate QR Code Data URL locally
  const qrDataUrl = await QRCode.toDataURL(data.confirmationCode, {
    margin: 1,
    width: 280,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });

  // 2. Render high-resolution 2x Retina canvas (1800 x 814 px -> 210 x 95 mm at ~220 DPI)
  const canvas = document.createElement('canvas');
  const width = 1800;
  const height = 814;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Nepodarilo sa vytvoriť grafický kontext vstupenky.');

  // Dark Luxury Gradient Background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0a0a0c');
  bgGrad.addColorStop(0.5, '#111114');
  bgGrad.addColorStop(1, '#08080a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle Luxury Grid Pattern in background
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.018)';
  ctx.lineWidth = 1;
  for (let x = 40; x < width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 40; y < height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Outer Gold Framing Border
  ctx.strokeStyle = '#c5a059';
  ctx.lineWidth = 3.5;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  // Inner Subtle Gold Accent Border
  ctx.strokeStyle = 'rgba(197, 160, 89, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(38, 38, width - 76, height - 76);

  // Corner Gold Accents
  const cornerSize = 24;
  ctx.fillStyle = '#c5a059';
  // Top-left
  ctx.fillRect(30, 30, cornerSize, 4);
  ctx.fillRect(30, 30, 4, cornerSize);
  // Top-right
  ctx.fillRect(width - 30 - cornerSize, 30, cornerSize, 4);
  ctx.fillRect(width - 34, 30, 4, cornerSize);
  // Bottom-left
  ctx.fillRect(30, height - 34, cornerSize, 4);
  ctx.fillRect(30, height - 30 - cornerSize, 4, cornerSize);
  // Bottom-right
  ctx.fillRect(width - 30 - cornerSize, height - 34, cornerSize, 4);
  ctx.fillRect(width - 34, height - 30 - cornerSize, 4, cornerSize);

  // Perforated Stub Divider (at x = 1260)
  const stubX = 1280;
  ctx.strokeStyle = 'rgba(197, 160, 89, 0.4)';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(stubX, 38);
  ctx.lineTo(stubX, height - 38);
  ctx.stroke();
  ctx.setLineDash([]); // Reset dash

  // Top Cut Notch circles on perforation line
  ctx.fillStyle = '#0a0a0c';
  ctx.beginPath();
  ctx.arc(stubX, 30, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#c5a059';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(stubX, height - 30, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // LEFT MAIN TICKET SECTION (x: 70 to 1240)
  // 1. Academy Badge & Brand
  ctx.fillStyle = '#c5a059';
  ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('RICCARDO ACADEMY', 75, 95);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = '500 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('OFICIÁLNA ELEKTRONICKÁ VSTUPENKA & DAŇOVÝ DOKLAD', 75, 126);

  // 2. VIP Status Ribbon
  ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(860, 72, 360, 42, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#34d399';
  ctx.font = '600 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('GARANTOVANÉ MIESTO • UHRADENÉ', 885, 99);

  // Gold Separator Line
  const goldLine = ctx.createLinearGradient(75, 0, 1220, 0);
  goldLine.addColorStop(0, '#c5a059');
  goldLine.addColorStop(0.7, 'rgba(197, 160, 89, 0.3)');
  goldLine.addColorStop(1, 'transparent');
  ctx.strokeStyle = goldLine;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(75, 155);
  ctx.lineTo(1220, 155);
  ctx.stroke();

  // 3. Seminar Title (Large Bold)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '0px';
  ctx.fillText(data.seminarTitle, 75, 220);

  // Lektor subtext
  ctx.fillStyle = '#c5a059';
  ctx.font = '500 19px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`Lektor: ${COMPANY_DETAILS.managingDirector} • Master Stylist`, 75, 258);

  // 4. Ticket Info 3-Column Grid
  const colY = 320;
  // Col 1: Dátum a čas
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '1.5px';
  ctx.fillText('DÁTUM A ČAS', 75, colY);

  ctx.fillStyle = '#ffffff';
  ctx.font = '600 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '0px';
  ctx.fillText(data.dates, 75, colY + 32);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '400 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('09:00 — 18:00 (Intenzívny blok)', 75, colY + 60);

  // Col 2: Miesto konania
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '1.5px';
  ctx.fillText('MIESTO KONANIA', 480, colY);

  ctx.fillStyle = '#ffffff';
  ctx.font = '600 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`${data.city} • Atelier Riccardo`, 480, colY + 32);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '400 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(data.venue || COMPANY_DETAILS.salonAddress, 480, colY + 60);

  // Col 3: Balíček & Suma
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '1.5px';
  ctx.fillText('KATEGÓRIA & BALÍČEK', 880, colY);

  // Split tierName if it contains subtitle in parens so it never overlaps the stub line
  if (data.tierName.includes('(')) {
    const [tierTitle, ...rest] = data.tierName.split('(');
    const subText = `(${rest.join('(')}`;
    ctx.fillStyle = '#c5a059';
    ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(tierTitle.trim(), 880, colY + 28, 360);

    ctx.fillStyle = '#d4af37';
    ctx.font = '500 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(subText.trim(), 880, colY + 48, 360);

    ctx.fillStyle = '#ffffff';
    ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`Uhradené: ${data.amountPaidEUR} €`, 880, colY + 74, 360);
  } else {
    ctx.fillStyle = '#c5a059';
    ctx.font = 'bold 21px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(data.tierName, 880, colY + 32, 360);

    ctx.fillStyle = '#ffffff';
    ctx.font = '600 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`Uhradené: ${data.amountPaidEUR} €`, 880, colY + 62, 360);
  }

  // Lower Divider
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(75, 435);
  ctx.lineTo(1220, 435);
  ctx.stroke();

  // 5. Účastník Information Strip
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '1.5px';
  ctx.fillText('MENO ÚČASTNÍKA', 75, 465);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(data.attendeeName, 75, 502);

  if (data.salonName) {
    ctx.fillStyle = '#c5a059';
    ctx.font = '500 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(data.salonName, 75, 532);
  }

  // Spôsob platby & Overenie
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '1.5px';
  ctx.fillText('METÓDA PLATBY', 480, 465);

  ctx.fillStyle = '#e4e4e7';
  ctx.font = '500 19px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(data.paymentMethod, 480, 502);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.font = '400 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Stripe 256-bit SSL Secure Auth', 480, 530);

  // Kontaktný email
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '1.5px';
  ctx.fillText('DORUČENÉ NA EMAIL', 880, 465);

  ctx.fillStyle = '#e4e4e7';
  ctx.font = '500 19px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(data.email, 880, 502);

  // 6. Bottom Legal & Operator Bar (ZETEREM s.r.o.)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.fillRect(75, 600, 1145, 140);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.strokeRect(75, 600, 1145, 140);

  ctx.fillStyle = '#c5a059';
  ctx.font = '600 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`Prevádzkovateľ & Dodávateľ: ${COMPANY_DETAILS.legalName}`, 95, 634);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.font = '400 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`IČO: ${COMPANY_DETAILS.ico}  •  DIČ: ${COMPANY_DETAILS.dic}  •  ${COMPANY_DETAILS.vatStatus}  •  Sídlo: ${COMPANY_DETAILS.registeredOffice}`, 95, 664);
  ctx.fillText(`${COMPANY_DETAILS.courtRegistration}  •  Dozor: SOI pre Banskobystrický kraj`, 95, 692);
  ctx.fillText('100% garancia spokojnosti po 1. dni seminára • Reklamácie a storno podľa platného VOP.', 95, 720);

  // RIGHT SECURITY STUB SECTION (x: 1280 to 1770)
  const stubCenterX = 1540;

  ctx.fillStyle = '#c5a059';
  ctx.font = '700 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '3px';
  ctx.textAlign = 'center';
  ctx.fillText('SECURITY STUB', stubCenterX, 85);

  // Code Label & Value
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('KÓD VSTUPENKY', stubCenterX, 130);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px "Courier New", monospace, monospace';
  ctx.letterSpacing = '2px';
  ctx.fillText(data.confirmationCode, stubCenterX, 172);

  // Load and draw QR code image
  const qrImg = new Image();
  qrImg.src = qrDataUrl;
  await new Promise((resolve) => {
    qrImg.onload = resolve;
    qrImg.onerror = resolve;
  });

  // White Card container for QR
  const qrSize = 250;
  const qrX = stubCenterX - qrSize / 2;
  const qrY = 210;

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(qrX, qrY, qrSize, qrSize, 14);
  ctx.fill();

  ctx.drawImage(qrImg, qrX + 10, qrY + 10, qrSize - 20, qrSize - 20);

  // Scan instruction
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '500 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '0.5px';
  ctx.fillText('SKENUJTE PRI VSTUPE DO SALÓNU', stubCenterX, qrY + qrSize + 32);

  // Barcode simulation lines
  const barcodeY = 540;
  const barcodeHeight = 55;
  const barcodeWidth = 320;
  const barcodeX = stubCenterX - barcodeWidth / 2;

  ctx.fillStyle = '#ffffff';
  // Procedural barcode pattern
  const barPattern = [3, 2, 5, 2, 4, 3, 2, 6, 2, 3, 4, 2, 5, 3, 2, 4, 3, 5, 2, 4, 3, 6, 2, 3, 5, 2, 4, 3, 2, 5, 4, 2, 6, 3, 2, 4, 5, 2, 3, 4, 2, 6, 3, 5, 2];
  let curX = barcodeX;
  for (let i = 0; i < barPattern.length && curX < barcodeX + barcodeWidth; i++) {
    const w = barPattern[i] * 1.8;
    if (i % 2 === 0) {
      ctx.fillRect(curX, barcodeY, w, barcodeHeight);
    }
    curX += w + 2;
  }

  // Barcode subtext
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = '12px "Courier New", monospace';
  ctx.letterSpacing = '4px';
  ctx.fillText(data.confirmationCode.replace(/-/g, '  '), stubCenterX, barcodeY + barcodeHeight + 25);

  // Official Seal Note
  ctx.fillStyle = '#c5a059';
  ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('AUTORIZOVANÁ VSTUPENKA RICCARDO', stubCenterX, height - 70);

  ctx.textAlign = 'left'; // Reset

  // 3. Export to High-Quality PDF using jsPDF
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [210, 95]
  });

  const canvasImgData = canvas.toDataURL('image/png', 0.95);
  doc.addImage(canvasImgData, 'PNG', 0, 0, 210, 95, undefined, 'FAST');

  // Trigger browser download
  doc.save(`Vstupenka-RICCARDO-${data.confirmationCode}.pdf`);
}
