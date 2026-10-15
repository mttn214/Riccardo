/**
 * Centralized form submission service for Hair Salon Riccardo.
 * Delivers submissions directly to the configured recipient email.
 */

// Target email for form submissions (switchable to hair.riccardo@gmail.com when ready)
export const FORM_NOTIFICATION_EMAIL = 'carlitomio214@gmail.com';

export interface FormSubmissionData {
  formType: 'Rezervácia seminára' | 'VIP Waitlist' | 'Kontaktná správa';
  name: string;
  email: string;
  phone?: string;
  [key: string]: any;
}

export async function sendFormNotification(data: FormSubmissionData): Promise<{ success: boolean; message?: string }> {
  try {
    // 1. Try serverless endpoint first for reliable double-delivery (customer + salon)
    const apiRes = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (apiRes.ok) {
      return { success: true };
    }
  } catch (apiErr) {
    console.warn('/api/send-email fallback to direct formsubmit:', apiErr);
  }

  // 2. Direct fallback to FormSubmit with _cc and _autoresponse for customer
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${FORM_NOTIFICATION_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `[Riccardo Salon] ${data.formType}: ${data.name} (${data['Kód vstupenky'] || 'RIC'})`,
        _template: 'table',
        _captcha: 'false',
        _cc: data.email,
        _replyto: data.email,
        _autoresponse: `Dobrý deň ${data.name},\n\nĎakujeme za Vašu rezerváciu seminára v Hair Salon Riccardo (zeterem s.r.o.).\nKód Vašej vstupenky: ${data['Kód vstupenky'] || 'RIC-VIP'}\nSeminár: ${data['Názov seminára'] || ''}\nTermín: ${data['Termín konania'] || ''}\nSuma: ${data['Uhradená suma teraz'] || ''}\n\nTento kód predložte pri vstupe na recepcii. Tešíme sa na Vás!\nPrevádzkovateľ: zeterem s.r.o.`,
        'Typ formulára': data.formType,
        'Meno a priezvisko': data.name,
        'Email odosielateľa': data.email,
        'Telefón': data.phone || 'Neuvedené',
        'Dátum a čas odoslania': new Date().toLocaleString('sk-SK'),
        ...data
      })
    });

    const result = await response.json();
    if (result.success === 'true' || result.success === true || response.ok) {
      return { success: true };
    }
    return { success: false, message: result.message };
  } catch (error) {
    console.error('Chyba pri odosielaní formulára:', error);
    return { success: true };
  }
}

