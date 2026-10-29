/**
 * Sensitive, polite, customer-friendly Slovak translations for payment errors.
 * Replaces harsh or technical English Stripe decline messages with empathetic guidance.
 */

export function formatSensitivePaymentError(rawError?: string | null, errorCode?: string): string {
  if (!rawError && !errorCode) {
    return 'Platbu sa nepodarilo autorizovať. Prosíme, skontrolujte zadané údaje alebo zvoľte platbu prevodom na účet.';
  }

  const text = (rawError || '').toLowerCase();
  const code = (errorCode || '').toLowerCase();

  // Insufficient funds
  if (
    code === 'insufficient_funds' ||
    text.includes('insufficient funds') ||
    text.includes('nedostatočný zostatok') ||
    text.includes('nedostatok prostriedkov')
  ) {
    return 'Platba neprebehla z dôvodu nedostatočného disponibilného zostatku na účte. Prosíme, skontrolujte zostatok na karte vo svojej bankovej aplikácii alebo vyskúšajte inú platobnú kartu či alternatívnu metódu.';
  }

  // Card declined by issuer / bank
  if (
    code === 'card_declined' ||
    code === 'generic_decline' ||
    text.includes('card has been declined') ||
    text.includes('card was declined') ||
    text.includes('do_not_honor')
  ) {
    return 'Platobná karta bola vašou bankou odmietnutá. Prosíme, skontrolujte si vo svojej bankovej aplikácii povolenie internetových platieb a denné limity, alebo použite inú platobnú kartu.';
  }

  // Expired card
  if (
    code === 'expired_card' ||
    text.includes('expired') ||
    text.includes('vypršala platnosť')
  ) {
    return 'Platnosť zadanej karty už vypršala. Prosíme, skontrolujte dátum platnosti na prednej strane karty alebo zadajte novú kartu.';
  }

  // Incorrect CVC
  if (
    code === 'incorrect_cvc' ||
    code === 'invalid_cvc' ||
    text.includes('cvc') ||
    text.includes('security code')
  ) {
    return 'Bezpečnostný kód CVC (3 číslice na zadnej strane karty) bol zadaný nesprávne. Skontrolujte ho prosím a zadajte znova.';
  }

  // Incorrect card number / invalid number
  if (
    code === 'incorrect_number' ||
    code === 'invalid_number' ||
    text.includes('card number is incorrect') ||
    text.includes('invalid card number')
  ) {
    return 'Číslo platobnej karty nie je správne. Prosíme, skontrolujte zadané číslice a skúste to znova.';
  }

  // 3D Secure / SCA authentication required or failed
  if (
    code === 'authentication_required' ||
    text.includes('3d secure') ||
    text.includes('authentication') ||
    text.includes('action failed')
  ) {
    return 'Bezpečnostné overenie platby (3D Secure vo vašej bankovej aplikácii alebo cez SMS kód) nebolo dokončené. Prosíme, potvrďte platbu vo svojej bankovej aplikácii.';
  }

  // Processing error / temporary bank timeout
  if (
    code === 'processing_error' ||
    text.includes('processing error') ||
    text.includes('bank processing')
  ) {
    return 'Pri spracovaní platby v banke nastala dočasná technická chyba. Prosíme, vyskúšajte to o minútu znova alebo zvoľte platbu bankovým prevodom.';
  }

  // Lost or stolen card
  if (code === 'lost_card' || code === 'stolen_card' || text.includes('stolen') || text.includes('lost')) {
    return 'Túto platobnú kartu nemožno použiť. Prosíme, kontaktujte svoju banku alebo zvoľte inú platobnú metódu.';
  }

  // Live Stripe account pending business verification
  if (
    text.includes('activated payment methods') ||
    text.includes('charges_enabled') ||
    text.includes('cannot charge') ||
    text.includes('inactive') ||
    text.includes('aktiváciu firemných údajov')
  ) {
    return 'Živý príjem platieb cez Stripe sa momentálne aktivuje. Pre garanciu vášho miesta na seminári zvoľte platbu bankovým prevodom na účet salónu.';
  }

  // Test mode real card notice (preserve informative help)
  if (text.includes('testovacieho prostredia') || text.includes('testovacom režime') || text.includes('real card')) {
    return 'Zadali ste reálnu bankovú kartu do testovacieho prostredia Stripe. Testovací režim odmieta reálne karty, aby vám nestiahol peniaze. Pre test použite tlačidlo „Vložiť testovaciu kartu“, alebo zvoľte rezerváciu na faktúru.';
  }

  // If already clean Slovak sentence, return it
  if (/[áäčďéíĺľňóôŕšťúýž]/i.test(rawError || '')) {
    return rawError!;
  }

  // Fallback sensitive message
  return 'Platbu sa nepodarilo autorizovať. Prosíme, skontrolujte údaje karty, disponibilný zostatok alebo zvoľte platbu bankovým prevodom na účet.';
}
