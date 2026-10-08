import { contactDetails } from '@/data/contact';

export const socialLinks = {
  instagram: {
    label: 'Instagram',
    href: 'https://www.instagram.com/dr.ronaldsalazarmora/',
    handle: '@dr.ronaldsalazarmora',
    placeholder: false,
  },
  tiktok: {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@dr.ronaldvirtual',
    handle: '@dr.ronaldvirtual',
    placeholder: false,
  },
  whatsappChannel: {
    label: 'Canal de WhatsApp',
    href: contactDetails.whatsappChannel.href,
    handle: 'Doctor Ronald Salazar',
    placeholder: false,
  },
  facebook: {
    label: 'Facebook',
    href: 'https://www.instagram.com/dr.ronaldsalazarmora/',
    handle: 'Canal oficial pendiente',
    placeholder: true,
  },
} as const;

export const officialSocialProfiles = [
  socialLinks.instagram.href,
  socialLinks.tiktok.href,
  socialLinks.whatsappChannel.href,
];
