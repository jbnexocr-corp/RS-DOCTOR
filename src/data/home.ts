import type { Locale } from '@/lib/i18n';

export type HomeContent = {
  skip: string;
  nav: { home: string; doctor: string; services: string; pregnancy: string; articles: string; contact: string; appointment: string };
  hero: { eyebrow: string; title: string; intro: string; primary: string; secondary: string; note: string; imageAlt: string };
  services: { eyebrow: string; title: string; intro: string; items: Array<{ title: string; text: string }> };
  doctor: { eyebrow: string; title: string; text: string; pending: string; link: string; imageAlt: string };
  principles: { eyebrow: string; title: string; items: Array<{ title: string; text: string }> };
  surgery: { eyebrow: string; title: string; text: string; link: string; imageAlt: string; caption: string };
  resources: { eyebrow: string; title: string; intro: string; bookTitle: string; bookText: string; courseTitle: string; courseText: string; pending: string };
  contact: { eyebrow: string; title: string; text: string; primary: string; secondary: string; pending: string };
  footer: { summary: string; navigation: string; services: string; legal: string; privacy: string; terms: string; pending: string; rights: string };
};

export const homeContent: Record<Locale, HomeContent> = {
  es: {
    skip: 'Saltar al contenido principal',
    nav: { home: 'Inicio', doctor: 'Dr. Ronald', services: 'Servicios', pregnancy: 'Embarazo y recursos', articles: 'Artículos', contact: 'Contacto', appointment: 'Solicitar cita' },
    hero: {
      eyebrow: 'Ginecología integral',
      title: 'Atención ginecológica y obstétrica para cada etapa de tu vida.',
      intro: 'Un espacio para conocer al Dr. Ronald Salazar, comprender tus opciones de atención y solicitar una valoración con claridad y privacidad.',
      primary: 'Solicitar una cita', secondary: 'Conocer los servicios',
      note: 'La disponibilidad se confirma directamente con la clínica.',
      imageAlt: 'Dr. Ronald Salazar en su consultorio, con traje beige',
    },
    services: {
      eyebrow: 'Áreas de atención', title: 'Una ruta clara para cada necesidad',
      intro: 'La atención se organiza en seis áreas. Cada servicio y procedimiento se recomienda únicamente después de una valoración individual.',
      items: [
        { title: 'Gineco-obstetricia', text: 'Acompañamiento durante el embarazo, el nacimiento y el seguimiento relacionado.' },
        { title: 'Ginecología', text: 'Consulta ginecológica, prevención y evaluación de necesidades específicas.' },
        { title: 'Cirugía ginecológica', text: 'Valoración de procedimientos con información sobre alternativas, beneficios, riesgos y seguimiento.' },
        { title: 'Salud íntima', text: 'Atención discreta y respetuosa, centrada en objetivos funcionales y necesidades individuales.' },
        { title: 'Piso pélvico', text: 'Evaluación clínica y coordinación con profesionales capacitados cuando corresponda.' },
        { title: 'Atención integral', text: 'Coordinación de nutrición, fisioterapia y acompañamiento según la oferta confirmada.' },
      ],
    },
    doctor: {
      eyebrow: 'El profesional', title: 'Dr. Ronald Salazar',
      text: 'La atención comienza con una conversación comprensible y una evaluación individual. El perfil profesional completo se publicará cuando la formación, credenciales y trayectoria cuenten con validación documental.',
      pending: 'Credenciales, número profesional, formación y centros de atención pendientes de confirmación.',
      link: 'Conocer el perfil profesional', imageAlt: 'Dr. Ronald Salazar sentado en su consultorio, con traje azul',
    },
    principles: {
      eyebrow: 'En consulta', title: 'Información para decidir con tranquilidad',
      items: [
        { title: 'Claridad', text: 'Explicaciones directas y comprensibles sobre la valoración y los siguientes pasos.' },
        { title: 'Privacidad', text: 'Canales de contacto que evitan solicitar información médica sensible.' },
        { title: 'Criterio individual', text: 'Las opciones de atención dependen de las necesidades y la evaluación de cada paciente.' },
      ],
    },
    surgery: {
      eyebrow: 'Valoración quirúrgica', title: 'Cirugía ginecológica mínimamente invasiva',
      text: 'Información equilibrada para comprender por qué puede considerarse un procedimiento, qué alternativas existen y cómo se planifica el seguimiento. La técnica y el lugar de realización se confirman para cada caso.',
      link: 'Conocer el enfoque quirúrgico', imageAlt: 'Dr. Ronald Salazar con uniforme quirúrgico en un quirófano',
      caption: 'La indicación y la vía quirúrgica requieren valoración individual.',
    },
    resources: {
      eyebrow: 'Embarazo y preparación', title: 'Recursos para acompañar el proceso',
      intro: 'El libro y el curso prenatal tendrán páginas propias y se conectarán con la atención del embarazo sin sustituir una consulta médica individual.',
      bookTitle: 'Tu embarazo junto al Dr. Ronald', bookText: 'Una página editorial con portada, sinopsis, temas, formatos y el enlace exacto a Amazon.',
      courseTitle: 'Curso prenatal', courseText: 'Información confirmada sobre temario, modalidad, duración, acceso, público y plataforma.',
      pending: 'Enlaces, edición, portada y datos comerciales pendientes de confirmación.',
    },
    contact: {
      eyebrow: 'Solicitud de atención', title: 'El siguiente paso empieza con una conversación.',
      text: 'Solicita información para una cita directamente al consultorio. La clínica confirmará la disponibilidad y el siguiente paso.',
      primary: 'Solicitar cita por WhatsApp', secondary: 'Llamar al consultorio',
      pending: 'No compartas diagnósticos, resultados ni información médica sensible. Este canal no atiende emergencias.',
    },
    footer: {
      summary: 'Información clara y atención ginecológica integral.', navigation: 'Navegación', services: 'Áreas', legal: 'Legal',
      privacy: 'Privacidad', terms: 'Uso del sitio', pending: 'Dirección, mapa, horarios y protocolo de urgencias pendientes de confirmación.', rights: 'Todos los derechos reservados.',
    },
  },
  en: {
    skip: 'Skip to main content',
    nav: { home: 'Home', doctor: 'Dr. Ronald', services: 'Services', pregnancy: 'Pregnancy resources', articles: 'Articles', contact: 'Contact', appointment: 'Request an appointment' },
    hero: {
      eyebrow: 'Comprehensive gynecology',
      title: 'Gynecological and obstetric care for every stage of life.',
      intro: 'A place to meet Dr. Ronald Salazar, understand your care options, and request an evaluation with clarity and privacy.',
      primary: 'Request an appointment', secondary: 'Explore services', note: 'Availability is confirmed directly by the clinic.',
      imageAlt: 'Dr. Ronald Salazar in his office wearing a beige suit',
    },
    services: {
      eyebrow: 'Care areas', title: 'A clear path for every need',
      intro: 'Care is organized into six areas. Every service and procedure is recommended only after an individual evaluation.',
      items: [
        { title: 'Obstetrics', text: 'Support throughout pregnancy, birth, and related follow-up.' },
        { title: 'Gynecology', text: 'Gynecological consultation, prevention, and assessment of specific needs.' },
        { title: 'Gynecological surgery', text: 'Procedure evaluation with information on alternatives, benefits, risks, and follow-up.' },
        { title: 'Intimate health', text: 'Discreet, respectful care centered on functional goals and individual needs.' },
        { title: 'Pelvic floor', text: 'Clinical evaluation and coordination with qualified professionals when appropriate.' },
        { title: 'Integrated care', text: 'Coordination of nutrition, physiotherapy, and support according to the confirmed offering.' },
      ],
    },
    doctor: {
      eyebrow: 'The physician', title: 'Dr. Ronald Salazar',
      text: 'Care begins with a clear conversation and an individual evaluation. The complete professional profile will be published once education, credentials, and experience have been documented and approved.',
      pending: 'Credentials, professional license, education, and care locations are pending confirmation.',
      link: 'View professional profile', imageAlt: 'Dr. Ronald Salazar seated in his office wearing a blue suit',
    },
    principles: {
      eyebrow: 'During your visit', title: 'Information that supports calm decisions',
      items: [
        { title: 'Clarity', text: 'Direct, understandable explanations about the evaluation and next steps.' },
        { title: 'Privacy', text: 'Contact channels designed not to request sensitive medical information.' },
        { title: 'Individual judgment', text: 'Care options depend on each patient’s needs and evaluation.' },
      ],
    },
    surgery: {
      eyebrow: 'Surgical evaluation', title: 'Minimally invasive gynecological surgery',
      text: 'Balanced information to understand why a procedure may be considered, which alternatives exist, and how follow-up is planned. The technique and facility are confirmed for each case.',
      link: 'Explore the surgical approach', imageAlt: 'Dr. Ronald Salazar in surgical scrubs in an operating room',
      caption: 'The indication and surgical approach require an individual evaluation.',
    },
    resources: {
      eyebrow: 'Pregnancy and preparation', title: 'Resources to support the process',
      intro: 'The book and prenatal course will have dedicated pages and connect with pregnancy care without replacing individual medical advice.',
      bookTitle: 'Your pregnancy with Dr. Ronald', bookText: 'An editorial page with the approved cover, summary, topics, formats, and exact Amazon link.',
      courseTitle: 'Prenatal course', courseText: 'Confirmed information on the syllabus, format, duration, access, audience, and platform.',
      pending: 'Links, edition, cover, and commercial details are pending confirmation.',
    },
    contact: {
      eyebrow: 'Request care', title: 'The next step begins with a conversation.',
      text: 'Request appointment information directly from the office. The clinic will confirm availability and the next step.',
      primary: 'Request an appointment on WhatsApp', secondary: 'Call the office',
      pending: 'Do not share diagnoses, results, or sensitive medical information. This is not an emergency channel.',
    },
    footer: {
      summary: 'Clear information and comprehensive gynecological care.', navigation: 'Navigation', services: 'Care areas', legal: 'Legal',
      privacy: 'Privacy', terms: 'Terms of use', pending: 'Address, map, hours, and emergency guidance pending confirmation.', rights: 'All rights reserved.',
    },
  },
};
