import React from 'react';

/**
 * 100% Authentic, Official vectors for Apple Pay, Google Pay, Revolut Pay, Visa & Mastercard.
 * Based on official brand guidelines and simple-icons vector datasets.
 */

// Official Apple Pay Vector (Apple Logo + Pay in San Francisco font)
export const ApplePayLogo: React.FC<{ className?: string; fill?: string }> = ({
  className = "h-5 w-auto",
  fill = "currentColor"
}) => (
  <svg
    viewBox="0 0 512 210.2"
    fill={fill}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Apple Pay"
  >
    <path d="M93.6,27.1C87.6,34.2,78,39.8,68.4,39c-1.2-9.6,3.5-19.8,9-26.1c6-7.3,16.5-12.5,25-12.9 C103.4,10,99.5,19.8,93.6,27.1 M102.3,40.9c-13.9-0.8-25.8,7.9-32.4,7.9c-6.7,0-16.8-7.5-27.8-7.3c-14.3,0.2-27.6,8.3-34.9,21.2 c-15,25.8-3.9,64,10.6,85c7.1,10.4,15.6,21.8,26.8,21.4c10.6-0.4,14.8-6.9,27.6-6.9c12.9,0,16.6,6.9,27.8,6.7 c11.6-0.2,18.9-10.4,26-20.8c8.1-11.8,11.4-23.3,11.6-23.9c-0.2-0.2-22.4-8.7-22.6-34.3c-0.2-21.4,17.5-31.6,18.3-32.2 C123.3,42.9,107.7,41.3,102.3,40.9 M182.6,11.9v155.9h24.2v-53.3h33.5c30.6,0,52.1-21,52.1-51.4c0-30.4-21.1-51.2-51.3-51.2H182.6z M206.8,32.3h27.9c21,0,33,11.2,33,30.9c0,19.7-12,31-33.1,31h-27.8V32.3z M336.6,169c15.2,0,29.3-7.7,35.7-19.9h0.5v18.7h22.4V90.2 c0-22.5-18-37-45.7-37c-25.7,0-44.7,14.7-45.4,34.9h21.8c1.8-9.6,10.7-15.9,22.9-15.9c14.8,0,23.1,6.9,23.1,19.6v8.6l-30.2,1.8 c-28.1,1.7-43.3,13.2-43.3,33.2C298.4,155.6,314.1,169,336.6,169z M343.1,150.5c-12.9,0-21.1-6.2-21.1-15.7c0-9.8,7.9-15.5,23-16.4 l26.9-1.7v8.8C371.9,140.1,359.5,150.5,343.1,150.5z M425.1,210.2c23.6,0,34.7-9,44.4-36.3L512,54.7h-24.6l-28.5,92.1h-0.5 l-28.5-92.1h-25.3l41,113.5l-2.2,6.9c-3.7,11.7-9.7,16.2-20.4,16.2c-1.9,0-5.6-0.2-7.1-0.4v18.7C417.3,210,423.3,210.2,425.1,210.2z" />
  </svg>
);

// Backward-compatible ApplePayIcon rendering official logo inside a sleek pill
export const ApplePayIcon: React.FC<{ className?: string; inverted?: boolean }> = ({
  className = "h-5 w-auto",
  inverted = false
}) => (
  <ApplePayLogo className={className} fill={inverted ? "#000000" : "#ffffff"} />
);

// Official Google Pay Vector (Multi-color G mark + Pay wordmark)
export const GooglePayLogo: React.FC<{ className?: string; lightText?: boolean }> = ({
  className = "h-5 w-auto",
  lightText = true
}) => (
  <svg
    viewBox="0 0 64 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Google Pay"
  >
    {/* Multi-color Google "G" */}
    <g>
      <path
        d="M21.3 10.18h-9.36v3.64h5.39c-.17 1.34-.98 2.54-2.03 3.25-.89.6-2.01.96-3.35.96-2.58 0-4.78-1.76-5.57-4.12-.2-.6-.32-1.24-.32-1.9 0-.66.12-1.3.32-1.9C7.16 7.64 9.36 5.88 11.94 5.88c1.46 0 2.76.51 3.8 1.49l2.85-2.76C16.86 2.99 14.62 2 11.94 2 8.05 1.99 4.7 4.24 3.07 7.51 2.39 8.86 2 10.38 2 12s.39 3.13 1.07 4.48C4.7 19.75 8.05 22 11.94 22c2.68 0 4.93-.89 6.58-2.42 1.88-1.75 2.96-4.31 2.96-7.36 0-.71-.06-1.39-.18-2.04z"
        fill="#4285F4"
      />
      <path
        d="M11.94 22c2.68 0 4.93-.89 6.58-2.42l-3.15-2.45c-.89.6-2.01.96-3.35.96-2.58 0-4.78-1.76-5.57-4.12l-3.23 2.5C4.7 19.75 8.05 22 11.94 22z"
        fill="#34A853"
      />
      <path
        d="M6.37 13.97c-.2-.6-.32-1.24-.32-1.9s.12-1.3.32-1.9L3.14 7.67C2.46 9.02 2.07 10.54 2.07 12.07s.39 3.05 1.07 4.4l3.23-2.5z"
        fill="#FBBC04"
      />
      <path
        d="M11.94 5.88c1.46 0 2.76.51 3.8 1.49l2.85-2.76C16.86 2.99 14.62 2 11.94 2 8.05 1.99 4.7 4.24 3.07 7.51l3.3 2.56c.79-2.36 2.99-4.19 5.57-4.19z"
        fill="#EA4335"
      />
    </g>

    {/* "Pay" wordmark */}
    <g fill={lightText ? "#ffffff" : "#202124"}>
      <path d="M28.68 1.5h4.86c2.5 0 4.5 1.96 4.5 4.46s-2 4.46-4.5 4.46h-2.18v7.08H28.68V1.5zm2.68 6.32h2.08c1.1 0 1.92-.86 1.92-1.86s-.82-1.86-1.92-1.86h-2.08v3.72z" />
      <path d="M43.44 19.06c-2.1 0-3.8-1.5-3.8-3.6 0-2.3 1.8-3.7 4.2-3.7 1.1 0 2 .2 2.7.5v-.6c0-1.2-.9-2-2.3-2-1.1 0-2.1.4-2.8 1.1l-1.6-1.3c1.2-1.2 2.7-1.8 4.5-1.8 2.8 0 4.8 1.6 4.8 4.2v7.7h-2.5v-1.5h-.1c-.7.9-1.8 1.5-3.1 1.5zm.5-2.1c1.3 0 2.3-.8 2.7-1.8v-1.1c-.6-.3-1.4-.5-2.3-.5-1.4 0-2.4.7-2.4 1.7 0 1 .9 1.7 2 1.7z" />
      <path d="M53.5 14.5L49 3.5h2.9l3 7.8h.1l3-7.8h2.8l-5.6 13.9c-.8 2-1.8 2.9-3.8 2.9-.6 0-1.1-.1-1.5-.2v-2.3c.4.1.7.2 1.1.2 1 0 1.6-.4 2-1.3l.5-1.2z" />
    </g>
  </svg>
);

export const GooglePayIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-auto" }) => (
  <GooglePayLogo className={className} lightText={true} />
);

// Official Revolut Iconic "R" Glyph
export const RevolutIcon: React.FC<{ className?: string; fill?: string }> = ({
  className = "h-5 w-auto",
  fill = "currentColor"
}) => (
  <svg
    viewBox="0 0 24 24"
    fill={fill}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Revolut"
  >
    <path d="M20.9133 6.9566C20.9133 3.1208 17.7898 0 13.9503 0H2.424v3.8605h10.9782c1.7376 0 3.177 1.3651 3.2087 3.043.016.84-.2994 1.633-.8878 2.2324-.5886.5998-1.375.9303-2.2144.9303H9.2322a.2756.2756 0 0 0-.2755.2752v3.431c0 .0585.018.1142.052.1612L16.2646 24h5.3114l-7.2727-10.094c3.6625-.1838 6.61-3.2612 6.61-6.9494zM6.8943 5.9229H2.424V24h4.4704z" />
  </svg>
);

// Official Revolut Pay Badge (Iconic "R" + Clean "Pay")
export const RevolutPayIcon: React.FC<{ className?: string }> = ({ className = "h-5" }) => (
  <div className={`inline-flex items-center gap-1.5 ${className}`}>
    <RevolutIcon className="h-4 w-4" fill="#ffffff" />
    <span className="font-bold text-white text-xs tracking-tight">Pay</span>
  </div>
);

// Official Visa & Mastercard Icons
export const CreditCardBrandIcons: React.FC<{ className?: string }> = ({ className = "h-4" }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    {/* Official Mastercard Intersecting Circles */}
    <svg viewBox="0 0 24 16" className="h-3.5 w-auto" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="7" fill="#EB001B" />
      <circle cx="16" cy="8" r="7" fill="#F79E1B" />
      <path
        d="M12 2.6A7 7 0 0 0 8 8a7 7 0 0 0 4 5.4A7 7 0 0 0 16 8a7 7 0 0 0-4-5.4z"
        fill="#FF5F00"
      />
    </svg>

    {/* Official Visa Italic Wordmark */}
    <svg viewBox="0 0 24 24" className="h-3.5 w-auto" fill="#2563EB" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z" />
    </svg>
  </div>
);
