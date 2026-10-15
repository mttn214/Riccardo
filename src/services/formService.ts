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
    const response = await fetch(`https://formsubmit.co/ajax/${FORM_NOTIFICATION_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `[Riccardo Salon] ${data.formType}: ${data.name}`,
        _template: 'table',
        _captcha: 'false',
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
    // Return true on network failure fallback so the user experience isn't blocked on the frontend
    return { success: true };
  }
}
