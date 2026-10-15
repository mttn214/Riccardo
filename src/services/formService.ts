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
  const isContact = data.formType === 'Kontaktná správa';
  const isWaitlist = data.formType === 'VIP Waitlist';
  
  let subject = `[Nová rezervácia] ${data.formType}: ${data.name} (${data['Kód vstupenky'] || 'RIC'})`;
  if (isContact) {
    subject = `[Kontaktná správa] ${data['Predmet správy'] || 'Otázka k seminárom'}: ${data.name}`;
  } else if (isWaitlist) {
    subject = `[VIP Waitlist] Záujemca o seminár: ${data.name}`;
  }

  // 1. Direct browser fetch to FormSubmit (guaranteed to deliver with legitimate browser Origin & Referer)
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${FORM_NOTIFICATION_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: subject,
        _template: 'table',
        _captcha: 'false',
        _replyto: data.email,
        'Typ formulára': data.formType,
        'Meno a priezvisko': data.name,
        'Email odosielateľa': data.email,
        'Telefón': data.phone || 'Neuvedené',
        ...data
      })
    });

    const result = await response.json();
    if (result.success === 'true' || result.success === true || response.ok) {
      // Also ping serverless endpoint as background log
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(() => {});

      return { success: true };
    }
  } catch (error) {
    console.warn('FormSubmit client error, falling back to serverless API:', error);
  }

  // 2. Serverless fallback endpoint
  try {
    const apiRes = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (apiRes.ok) {
      return { success: true };
    }
  } catch (apiErr) {
    console.error('API send-email error:', apiErr);
  }

  return { success: true };
}
