import { company } from "../config/company"
import "./ContactDock.css"

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.29-.15-1.71-.84-1.98-.94-.27-.1-.46-.15-.66.15-.2.29-.76.94-.93 1.13-.17.2-.34.22-.63.07-.29-.15-1.22-.45-2.32-1.43-.86-.77-1.44-1.71-1.61-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.66-1.6-.91-2.19-.24-.58-.48-.5-.66-.51h-.56c-.2 0-.51.07-.78.37-.27.29-1.02.99-1.02 2.42 0 1.43 1.04 2.81 1.19 3.01.15.2 2.05 3.14 4.98 4.4.7.3 1.24.48 1.66.62.7.22 1.34.19 1.84.11.56-.08 1.71-.7 1.95-1.37.24-.68.24-1.26.17-1.37-.07-.12-.27-.19-.56-.34z" />
      <path d="M12 2.5c-5.25 0-9.5 4.16-9.5 9.29 0 1.64.44 3.18 1.21 4.52L2.5 21.5l5.36-1.39a9.63 9.63 0 0 0 4.14.93c5.25 0 9.5-4.16 9.5-9.29S17.25 2.5 12 2.5zm0 17.02a7.7 7.7 0 0 1-3.94-1.08l-.28-.17-3.18.82.85-3.06-.18-.31a7.55 7.55 0 0 1-1.18-4.03c0-4.17 3.44-7.55 7.71-7.55s7.71 3.38 7.71 7.55-3.44 7.83-7.71 7.83z" />
    </svg>
  )
}

function ContactDock() {
  const hasWhatsApp = Boolean(company.whatsappUrl)

  return (
    <div className="contactDock" aria-label="Quick contact">
      <a
        className="contactDockButton contactDockInstagram"
        href={company.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Follow EVO Solutions+ on Instagram"
      >
        <InstagramIcon />
        <span className="contactDockLabel">INSTAGRAM</span>
      </a>

      {hasWhatsApp ? (
        <a
          className="contactDockButton contactDockWhatsApp"
          href={company.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Message EVO Solutions+ on WhatsApp"
        >
          <WhatsAppIcon />
          <span className="contactDockLabel">WHATSAPP</span>
        </a>
      ) : (
        <button
          type="button"
          className="contactDockButton contactDockWhatsApp is-unconfigured"
          aria-label="WhatsApp contact is not yet configured"
          disabled
        >
          <WhatsAppIcon />
          <span className="contactDockLabel">WHATSAPP</span>
        </button>
      )}
    </div>
  )
}

export default ContactDock
