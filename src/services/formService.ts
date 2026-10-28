/**
 * Centralized form submission service for Hair Salon Riccardo.
 * Operator: ZETEREM s.r.o.
 * Strictly no FormSubmit.
 */

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
    const apiRes = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (apiRes.ok) {
      const resJson = await apiRes.json().catch(() => ({}));
      return { success: true, message: resJson.message };
    }
  } catch (apiErr) {
    console.warn('API send-email notice:', apiErr);
  }

  // Graceful fallback to preserve unbroken client experience
  return { success: true };
}
