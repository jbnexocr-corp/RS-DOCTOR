const whatsappMessage = 'Hola, quisiera información para solicitar una cita.';

export const contactDetails = {
  phone: {
    display: '+506 6429 7669',
    international: '+50664297669',
    href: 'tel:+50664297669',
  },
  whatsapp: {
    href: `https://wa.me/50664297669?text=${encodeURIComponent(whatsappMessage)}`,
    message: whatsappMessage,
  },
  whatsappChannel: {
    label: 'Doctor Ronald Salazar',
    href: 'https://whatsapp.com/channel/0029VbCVQ0L35fLzdPzd1o38',
  },
} as const;
