import type { Locale } from '@/lib/i18n';

export type PageKind = 'profile' | 'index' | 'pillar' | 'resource' | 'articles' | 'contact' | 'legal';
export type ImageKey = 'beige' | 'blue' | 'scrubs' | 'none';

export interface InnerPageContent {
  slug: string;
  alternateSlug: string;
  kind: PageKind;
  image: ImageKey;
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  sections: Array<{ title: string; body: string }>;
  related?: Array<{ title: string; text: string; href: string }>;
  pending?: string;
  medicalDraft?: boolean;
}

const es: InnerPageContent[] = [
  {
    slug: 'dr-ronald-salazar', alternateSlug: 'doctor-ronald-salazar', kind: 'profile', image: 'blue',
    eyebrow: 'Perfil profesional', title: 'Dr. Ronald Salazar',
    description: 'Perfil profesional del Dr. Ronald Salazar y su enfoque de atención ginecológica integral.',
    intro: 'La relación clínica comienza con una conversación clara, una evaluación individual y el respeto por las decisiones de cada paciente.',
    sections: [
      { title: 'Una atención centrada en la persona', body: 'El perfil definitivo explicará cómo el doctor acompaña a sus pacientes, cómo organiza la valoración y qué pueden esperar de la consulta. El mensaje personal requiere aprobación directa del Dr. Ronald Salazar.' },
      { title: 'Formación y trayectoria', body: 'Los títulos, instituciones, años de formación, fecha de inicio profesional y áreas de práctica se publicarán únicamente con respaldo documental.' },
      { title: 'Credenciales y práctica actual', body: 'El número profesional, asociaciones, certificaciones, centros de consulta y hospitales requieren confirmación y autorización antes de hacerse públicos.' },
    ],
    related: [{ title: 'Conocer las áreas de atención', text: 'Explora cómo se organiza la oferta clínica.', href: '/es/servicios/' }],
    pending: 'PENDIENTE_CONFIRMACION: biografía, mensaje personal, formación, credenciales, trayectoria y centros de atención.',
  },
  {
    slug: 'servicios', alternateSlug: 'services', kind: 'index', image: 'none', eyebrow: 'Servicios', title: 'Áreas de atención',
    description: 'Áreas de atención ginecológica, obstétrica, quirúrgica e integral del Dr. Ronald Salazar.',
    intro: 'La oferta se organiza en seis pilares para que cada paciente pueda identificar una ruta de atención comprensible. El catálogo final depende de confirmación clínica.',
    sections: [],
    related: [
      { title: 'Gineco-obstetricia', text: 'Embarazo, nacimiento y seguimiento relacionado.', href: '/es/gineco-obstetricia/' },
      { title: 'Ginecología', text: 'Consulta, prevención y evaluación ginecológica.', href: '/es/ginecologia/' },
      { title: 'Cirugía ginecológica', text: 'Valoración de procedimientos y alternativas.', href: '/es/cirugia-ginecologica/' },
      { title: 'Salud íntima', text: 'Atención discreta con objetivos definidos individualmente.', href: '/es/salud-intima/' },
      { title: 'Piso pélvico', text: 'Evaluación y coordinación interdisciplinaria.', href: '/es/piso-pelvico/' },
      { title: 'Atención integral', text: 'Nutrición, fisioterapia y acompañamiento por profesionales.', href: '/es/atencion-integral/' },
    ],
    pending: 'El catálogo de servicios y el profesional responsable de cada atención requieren aprobación final.',
  },
  {
    slug: 'gineco-obstetricia', alternateSlug: 'obstetrics', kind: 'pillar', image: 'beige', eyebrow: 'Pilar de atención', title: 'Gineco-obstetricia',
    description: 'Información sobre atención prenatal, nacimiento y recursos de embarazo.',
    intro: 'Acompañamiento durante el embarazo, el nacimiento y el seguimiento relacionado, adaptado a las condiciones de la madre y el bebé.', medicalDraft: true,
    sections: [
      { title: 'Consulta prenatal', body: 'Valoraciones durante el embarazo para dar seguimiento, revisar estudios y resolver dudas. La frecuencia, los exámenes y el alcance dependen de cada caso y de la oferta confirmada.' },
      { title: 'Plan de nacimiento', body: 'La vía de parto se evalúa individualmente. La coordinación hospitalaria, el acompañamiento y el seguimiento deben confirmarse antes de publicar detalles.' },
      { title: 'Cesárea', body: 'Una intervención quirúrgica que puede indicarse por razones médicas y requiere evaluación, planificación y una conversación individual sobre riesgos y alternativas.' },
    ],
    related: [{ title: 'Embarazo y recursos', text: 'Libro, curso prenatal y futuros artículos revisados.', href: '/es/embarazo/recursos/' }, { title: 'Solicitar valoración', text: 'Consulta los canales de contacto disponibles.', href: '/es/contacto/' }],
    pending: 'PENDIENTE_REVISION_MEDICA: prestaciones, hospitales, parto provínculo, coordinación y seguimiento.',
  },
  {
    slug: 'ginecologia', alternateSlug: 'gynecology', kind: 'pillar', image: 'beige', eyebrow: 'Pilar de atención', title: 'Ginecología y prevención cervical',
    description: 'Consulta ginecológica, PAP, VPH y colposcopía con información pendiente de revisión médica.',
    intro: 'Valoración ginecológica para abordar prevención, síntomas y necesidades específicas con información clara y seguimiento individual.', medicalDraft: true,
    sections: [
      { title: 'Consulta ginecológica', body: 'La entrevista, valoración y orientación se adaptan a cada caso. Los estudios disponibles en clínica y los coordinados externamente deben confirmarse.' },
      { title: 'PAP y prueba de VPH', body: 'Son estudios diferentes dentro del tamizaje cervical. La indicación, preparación e interpretación deben revisarse según antecedentes y recomendaciones aplicables.' },
      { title: 'Colposcopía', body: 'Evaluación del cuello uterino con magnificación, indicada en situaciones determinadas. No toda paciente la necesita ni siempre incluye toma de muestra.' },
    ],
    related: [{ title: 'Solicitar consulta ginecológica', text: 'Conoce los canales disponibles para una valoración.', href: '/es/contacto/' }],
    pending: 'PENDIENTE_CONFIRMACION: BPH/VPH, prueba cobas/covas, laboratorio, alcance y entrega de resultados.',
  },
  {
    slug: 'cirugia-ginecologica', alternateSlug: 'gynecological-surgery', kind: 'pillar', image: 'scrubs', eyebrow: 'Pilar de atención', title: 'Cirugía ginecológica mínimamente invasiva',
    description: 'Valoración de procedimientos ginecológicos mínimamente invasivos.',
    intro: 'Información equilibrada para comprender por qué puede considerarse un procedimiento, sus alternativas y los pasos de evaluación y seguimiento.', medicalDraft: true,
    sections: [
      { title: 'Histeroscopía', body: 'Permite observar el interior del útero y puede tener fines diagnósticos o terapéuticos. La modalidad, anestesia y ubicación requieren confirmación.' },
      { title: 'Ablación endometrial', body: 'Puede considerarse para tratar sangrado menstrual en pacientes seleccionadas. No es anticoncepción y requiere revisar alternativas e implicaciones reproductivas.' },
      { title: 'Miomectomía y polipectomía', body: 'La técnica depende de la indicación, localización y otros factores. Solo se publicarán las vías que el doctor efectivamente realice.' },
    ],
    related: [{ title: 'Solicitar valoración quirúrgica', text: 'La indicación y la técnica se definen después de una evaluación.', href: '/es/contacto/' }],
    pending: 'PENDIENTE_CONFIRMACION: catálogo, técnicas, anestesia, hospitales, preparación, recuperación y seguimiento.',
  },
  {
    slug: 'salud-intima', alternateSlug: 'intimate-health', kind: 'pillar', image: 'none', eyebrow: 'Pilar de atención', title: 'Salud íntima',
    description: 'Información respetuosa sobre valoración de salud íntima.',
    intro: 'Un espacio discreto para conversar sobre molestias, objetivos funcionales y expectativas sin presentar variaciones normales como defectos.', medicalDraft: true,
    sections: [
      { title: 'Valoración individual', body: 'La conversación debe explorar necesidades, expectativas, alternativas y límites antes de considerar cualquier procedimiento.' },
      { title: 'Labioplastia', body: 'Procedimiento que requiere explicar indicaciones, límites, posibles complicaciones y cuidados aprobados por el doctor.' },
      { title: 'Procedimientos por confirmar', body: 'No se publicará una descripción genérica de “rejuvenecimiento” ni del llamado tensado vaginal hasta confirmar técnica, evidencia y oferta real.' },
    ], pending: 'PENDIENTE_CONFIRMACION: técnica y disponibilidad de tensado vaginal, indicaciones y material clínico autorizado.',
  },
  {
    slug: 'piso-pelvico', alternateSlug: 'pelvic-floor', kind: 'pillar', image: 'none', eyebrow: 'Pilar de atención', title: 'Piso pélvico',
    description: 'Evaluación y coordinación de atención del piso pélvico.',
    intro: 'La atención del piso pélvico requiere identificar necesidades funcionales y coordinar con el profesional adecuado.', medicalDraft: true,
    sections: [
      { title: 'Evaluación', body: 'La página definitiva explicará quién realiza la evaluación, qué incluye y cómo se determina el plan de atención.' },
      { title: 'Fisioterapia', body: 'Debe distinguirse fisioterapia general de fisioterapia de piso pélvico y publicarse la formación de la profesional responsable.' },
      { title: 'Coordinación clínica', body: 'Cuando corresponda, el sitio explicará cómo se conectan la valoración médica y el acompañamiento funcional.' },
    ], pending: 'PENDIENTE_CONFIRMACION: profesional, formación, modalidades, alcance, sesiones y disponibilidad.',
  },
  {
    slug: 'atencion-integral', alternateSlug: 'integrated-care', kind: 'pillar', image: 'none', eyebrow: 'Pilar de atención', title: 'Atención integral',
    description: 'Coordinación de nutrición, fisioterapia y acompañamiento.',
    intro: 'Una ruta coordinada hacia profesionales con alcances definidos, sin atribuir todos los servicios al doctor ni presentarlos como un paquete no confirmado.',
    sections: [
      { title: 'Nutrición', body: 'La ficha identificará a la profesional, su formación, áreas confirmadas de atención, modalidad y seguimiento.' },
      { title: 'Fisioterapia', body: 'La oferta se limitará a los servicios realmente disponibles y explicará cuándo se relaciona con piso pélvico.' },
      { title: 'Coaching y acompañamiento', body: 'Se definirá su alcance y se aclarará que no sustituye psicoterapia, psiquiatría ni atención médica.' },
    ], pending: 'PENDIENTE_CONFIRMACION: equipo, credenciales, modalidades, coordinación, cobro y posibles planes.',
  },
  {
    slug: 'embarazo/recursos', alternateSlug: 'pregnancy/resources', kind: 'resource', image: 'beige', eyebrow: 'Embarazo', title: 'Recursos para el embarazo',
    description: 'Libro, curso prenatal y recursos educativos del Dr. Ronald Salazar.',
    intro: 'Recursos de preparación vinculados con la atención prenatal y el nacimiento, sin sustituir una consulta médica individual.',
    sections: [{ title: 'Educación y consulta', body: 'Cada recurso debe explicar su propósito, autoría, alcance y forma de acceso. La información educativa no se presentará como diagnóstico o atención personalizada.' }],
    related: [{ title: 'Libro', text: 'Tu embarazo junto al Dr. Ronald.', href: '/es/embarazo/libro/' }, { title: 'Curso prenatal', text: 'Programa, modalidad y plataforma por confirmar.', href: '/es/embarazo/curso-prenatal/' }],
    pending: 'Portada, título editorial exacto, enlaces, temario, plataforma y condiciones pendientes.',
  },
  {
    slug: 'embarazo/libro', alternateSlug: 'pregnancy/book', kind: 'resource', image: 'none', eyebrow: 'Libro', title: 'Tu embarazo junto al Dr. Ronald',
    description: 'Información editorial del libro Tu embarazo junto al Dr. Ronald.',
    intro: 'La página reunirá la portada autorizada, sinopsis, temas, formatos y enlace exacto de compra cuando sean confirmados.',
    sections: [{ title: 'Compra externa', body: 'La compra se completará en Amazon. No se mostrará un precio o disponibilidad fija sin un mecanismo confiable de actualización.' }],
    related: [{ title: 'Consulta prenatal', text: 'El libro complementa, pero no sustituye, la valoración médica.', href: '/es/gineco-obstetricia/' }],
    pending: 'PENDIENTE_CONFIRMACION: título exacto, apellido en portada, autor, sinopsis, portada, edición, formatos, país y URL de Amazon.',
  },
  {
    slug: 'embarazo/curso-prenatal', alternateSlug: 'pregnancy/prenatal-course', kind: 'resource', image: 'none', eyebrow: 'Curso', title: 'Curso prenatal',
    description: 'Información del curso prenatal pendiente de confirmación.',
    intro: 'El curso tendrá una presentación clara de contenidos, modalidad, duración, acceso y público cuando la clínica confirme la oferta.',
    sections: [{ title: 'Alcance educativo', body: 'El curso complementará la preparación familiar y no se atribuirá atención médica individual ni sustituirá una consulta.' }],
    related: [{ title: 'Atención del embarazo', text: 'Conoce el pilar de gineco-obstetricia.', href: '/es/gineco-obstetricia/' }],
    pending: 'PENDIENTE_CONFIRMACION: nombre, instructor, temario, modalidad, duración, acceso, público, plataforma y URL.',
  },
  {
    slug: 'articulos', alternateSlug: 'articles', kind: 'articles', image: 'none', eyebrow: 'Biblioteca', title: 'Artículos y orientación',
    description: 'Biblioteca de artículos médicos revisados del Dr. Ronald Salazar.',
    intro: 'Este espacio publicará respuestas a preguntas concretas con autor, revisor médico, fecha de revisión y referencias pertinentes.',
    sections: [{ title: 'Criterio editorial', body: 'No se publicarán artículos genéricos para rellenar búsquedas. Cada contenido deberá resolver una necesidad real y enlazar a un servicio relacionado.' }],
    pending: 'No hay artículos publicados: temas, autores, revisores y fuentes requieren aprobación editorial y médica.',
  },
  {
    slug: 'contacto', alternateSlug: 'contact', kind: 'contact', image: 'none', eyebrow: 'Contacto', title: 'Solicitar información para una cita',
    description: 'WhatsApp y teléfono del consultorio del Dr. Ronald Salazar para solicitar información sobre citas.',
    intro: 'Solicita información por WhatsApp o teléfono. La clínica confirmará disponibilidad y el siguiente paso; estos canales no ofrecen atención inmediata ni confirman automáticamente una cita.',
    sections: [{ title: 'Protege tu privacidad', body: 'No incluyas diagnósticos, síntomas, resultados ni otra información médica sensible en un formulario general.' }],
    pending: 'P0: email destinatario, dirección, mapa, horarios, protocolo de urgencias, privacidad y conservación de datos.',
  },
  {
    slug: 'privacidad', alternateSlug: 'privacy', kind: 'legal', image: 'none', eyebrow: 'Legal', title: 'Privacidad',
    description: 'Plantilla pendiente de la política de privacidad.', intro: 'La política definitiva será redactada o validada por el responsable legal y de privacidad de la clínica.',
    sections: [{ title: 'Contenido requerido', body: 'Responsable del tratamiento, finalidades, base aplicable, destinatarios, proveedores, conservación, derechos y canales de contacto.' }],
    pending: 'PENDIENTE_APROBACION_LEGAL. Esta página no es una política definitiva.',
  },
  {
    slug: 'terminos-de-uso', alternateSlug: 'terms-of-use', kind: 'legal', image: 'none', eyebrow: 'Legal', title: 'Uso del sitio',
    description: 'Plantilla pendiente de términos de uso del sitio.', intro: 'El contenido del sitio es informativo y no debe convertirse en una consulta, diagnóstico ni atención de urgencia.',
    sections: [{ title: 'Texto definitivo pendiente', body: 'Se requiere aprobación sobre alcance informativo, propiedad intelectual, enlaces externos, responsabilidad y jurisdicción aplicable.' }],
    pending: 'PENDIENTE_APROBACION_LEGAL. Esta página no contiene términos definitivos.',
  },
];

const en: InnerPageContent[] = es.map((page) => {
  const translations: Record<string, Partial<InnerPageContent>> = {
    'dr-ronald-salazar': { slug: 'doctor-ronald-salazar', alternateSlug: 'dr-ronald-salazar', eyebrow: 'Professional profile', title: 'Dr. Ronald Salazar', description: 'Professional profile of Dr. Ronald Salazar and his approach to comprehensive gynecological care.', intro: 'Clinical care begins with a clear conversation, an individual evaluation, and respect for each patient’s decisions.', sections: [{ title: 'Person-centered care', body: 'The final profile will explain the physician’s approach, how an evaluation is organized, and what patients can expect. A personal message requires Dr. Ronald Salazar’s approval.' }, { title: 'Education and experience', body: 'Degrees, institutions, years of training, start of professional practice, and areas of care will be published only with supporting documentation.' }, { title: 'Credentials and current practice', body: 'Professional registration, memberships, certifications, consultation offices, and hospitals require confirmation and authorization.' }], related: [{ title: 'Explore care areas', text: 'See how clinical care is organized.', href: '/en/services/' }], pending: 'CONFIRMATION_PENDING: biography, education, credentials, experience, and care locations.' },
    servicios: { slug: 'services', alternateSlug: 'servicios', eyebrow: 'Services', title: 'Care areas', description: 'Gynecological, obstetric, surgical, and integrated care areas.', intro: 'Care is organized into six pillars so patients can identify a clear path. The final catalog requires clinical confirmation.', related: [{ title: 'Obstetrics', text: 'Pregnancy, birth, and related follow-up.', href: '/en/obstetrics/' }, { title: 'Gynecology', text: 'Consultation, prevention, and gynecological evaluation.', href: '/en/gynecology/' }, { title: 'Gynecological surgery', text: 'Evaluation of procedures and alternatives.', href: '/en/gynecological-surgery/' }, { title: 'Intimate health', text: 'Discreet care with individually defined goals.', href: '/en/intimate-health/' }, { title: 'Pelvic floor', text: 'Evaluation and interdisciplinary coordination.', href: '/en/pelvic-floor/' }, { title: 'Integrated care', text: 'Nutrition, physiotherapy, and support by qualified professionals.', href: '/en/integrated-care/' }], pending: 'The service catalog and responsible professional for each service require final approval.' },
    'gineco-obstetricia': { slug: 'obstetrics', alternateSlug: 'gineco-obstetricia', title: 'Obstetrics', eyebrow: 'Care pillar', description: 'Information about prenatal care, birth, and pregnancy resources.', intro: 'Support throughout pregnancy, birth, and related follow-up, adapted to the conditions of mother and baby.', sections: [{ title: 'Prenatal consultation', body: 'Evaluations during pregnancy to monitor progress, review studies, and address questions. Frequency, testing, and scope depend on each case and the confirmed offering.' }, { title: 'Birth planning', body: 'The route of birth is evaluated individually. Hospital coordination, support, and follow-up must be confirmed before details are published.' }, { title: 'Cesarean birth', body: 'A surgical intervention that may be medically indicated and requires evaluation, planning, and an individual discussion of risks and alternatives.' }], related: [{ title: 'Pregnancy resources', text: 'Book, prenatal course, and future reviewed articles.', href: '/en/pregnancy/resources/' }, { title: 'Request an evaluation', text: 'View the available contact channels.', href: '/en/contact/' }], pending: 'MEDICAL_REVIEW_PENDING: services, hospitals, birth terminology, coordination, and follow-up.' },
    ginecologia: { slug: 'gynecology', alternateSlug: 'ginecologia', title: 'Gynecology and cervical prevention', eyebrow: 'Care pillar', description: 'Gynecological consultation, cervical screening, and colposcopy.', intro: 'Gynecological evaluation for prevention, symptoms, and specific needs with clear information and individual follow-up.', sections: [{ title: 'Gynecological consultation', body: 'The interview, evaluation, and guidance are adapted to each case. Studies available in the clinic and those coordinated externally must be confirmed.' }, { title: 'Cervical cytology and HPV testing', body: 'These are different tools used in cervical screening. Preparation, indications, and interpretation require medical review.' }, { title: 'Colposcopy', body: 'An examination of the cervix using magnification, indicated in specific situations. Not every patient needs it, and it does not always include tissue sampling.' }], related: [{ title: 'Request a consultation', text: 'View the available channels for an evaluation.', href: '/en/contact/' }], pending: 'CONFIRMATION_PENDING: HPV terminology, cobas test, laboratory, scope, and result delivery.' },
    'cirugia-ginecologica': { slug: 'gynecological-surgery', alternateSlug: 'cirugia-ginecologica', title: 'Minimally invasive gynecological surgery', eyebrow: 'Care pillar', description: 'Evaluation of minimally invasive gynecological procedures.', intro: 'Balanced information about why a procedure may be considered, alternatives, evaluation, and follow-up.', sections: [{ title: 'Hysteroscopy', body: 'This procedure allows the interior of the uterus to be examined and may be diagnostic or therapeutic. Setting, anesthesia, and available approach require confirmation.' }, { title: 'Endometrial ablation', body: 'It may be considered for menstrual bleeding in selected patients. It is not contraception and requires discussion of alternatives and reproductive implications.' }, { title: 'Myomectomy and polypectomy', body: 'The technique depends on the indication, location, and other factors. Only approaches the physician currently performs will be published.' }], related: [{ title: 'Request a surgical evaluation', text: 'The indication and technique are defined after individual assessment.', href: '/en/contact/' }], pending: 'CONFIRMATION_PENDING: procedures, techniques, anesthesia, hospitals, preparation, recovery, and follow-up.' },
    'salud-intima': { slug: 'intimate-health', alternateSlug: 'salud-intima', title: 'Intimate health', eyebrow: 'Care pillar', description: 'Respectful information about intimate health evaluation.', intro: 'A discreet setting to discuss discomfort, functional goals, and expectations without presenting normal anatomy as a defect.', sections: [{ title: 'Individual evaluation', body: 'The conversation should explore needs, expectations, alternatives, and limitations before any procedure is considered.' }, { title: 'Labiaplasty', body: 'A procedure that requires an approved explanation of indications, limitations, possible complications, and care.' }, { title: 'Procedures requiring confirmation', body: 'No generic “rejuvenation” description will be published until the actual technique, evidence, and offering are confirmed.' }], pending: 'CONFIRMATION_PENDING: technique, availability, indications, and authorized clinical materials.' },
    'piso-pelvico': { slug: 'pelvic-floor', alternateSlug: 'piso-pelvico', title: 'Pelvic floor', eyebrow: 'Care pillar', description: 'Pelvic floor evaluation and coordinated care.', intro: 'Pelvic floor care requires identifying functional needs and coordinating with the appropriate professional.', sections: [{ title: 'Evaluation', body: 'The final page will explain who performs the assessment, what it includes, and how a care plan is determined.' }, { title: 'Physiotherapy', body: 'General physiotherapy must be distinguished from pelvic floor physiotherapy, with the responsible professional’s training identified.' }, { title: 'Clinical coordination', body: 'When appropriate, the site will explain how medical evaluation and functional support work together.' }], pending: 'CONFIRMATION_PENDING: professional, education, formats, scope, sessions, and availability.' },
    'atencion-integral': { slug: 'integrated-care', alternateSlug: 'atencion-integral', title: 'Integrated care', eyebrow: 'Care pillar', description: 'Coordination of nutrition, physiotherapy, and support.', intro: 'A coordinated path to professionals with defined scopes, without attributing every service to the doctor.', sections: [{ title: 'Nutrition', body: 'The profile will identify the professional, education, confirmed areas of care, format, and follow-up.' }, { title: 'Physiotherapy', body: 'The offering will be limited to services actually available and explain when it relates to pelvic floor care.' }, { title: 'Coaching and support', body: 'Its scope will be defined and will clearly state that it does not replace psychotherapy, psychiatry, or medical care.' }], pending: 'CONFIRMATION_PENDING: team, credentials, formats, coordination, billing, and any plans.' },
    'embarazo/recursos': { slug: 'pregnancy/resources', alternateSlug: 'embarazo/recursos', title: 'Pregnancy resources', eyebrow: 'Pregnancy', description: 'Book, prenatal course, and educational resources.', intro: 'Preparation resources connected to prenatal and birth care without replacing individual medical advice.', sections: [{ title: 'Education and consultation', body: 'Each resource must explain its purpose, authorship, scope, and access. Educational information will not be presented as personalized medical care.' }], related: [{ title: 'Book', text: 'Your pregnancy with Dr. Ronald.', href: '/en/pregnancy/book/' }, { title: 'Prenatal course', text: 'Program, format, and platform pending confirmation.', href: '/en/pregnancy/prenatal-course/' }], pending: 'Cover, exact title, links, syllabus, platform, and commercial terms are pending.' },
    'embarazo/libro': { slug: 'pregnancy/book', alternateSlug: 'embarazo/libro', title: 'Your pregnancy with Dr. Ronald', eyebrow: 'Book', description: 'Editorial information about the pregnancy book.', intro: 'This page will include the approved cover, summary, topics, formats, and exact purchase link once confirmed.', sections: [{ title: 'External purchase', body: 'The purchase will be completed on Amazon. Fixed pricing or availability will not be shown without a reliable update mechanism.' }], related: [{ title: 'Prenatal care', text: 'The book complements but does not replace medical evaluation.', href: '/en/obstetrics/' }], pending: 'CONFIRMATION_PENDING: exact title, author, summary, cover, edition, formats, country, and Amazon URL.' },
    'embarazo/curso-prenatal': { slug: 'pregnancy/prenatal-course', alternateSlug: 'embarazo/curso-prenatal', title: 'Prenatal course', eyebrow: 'Course', description: 'Prenatal course information pending confirmation.', intro: 'The course will clearly explain its content, format, duration, access, and audience once confirmed.', sections: [{ title: 'Educational scope', body: 'The course will support family preparation and will not be described as individualized medical care or a replacement for consultation.' }], related: [{ title: 'Pregnancy care', text: 'Explore the obstetrics care pillar.', href: '/en/obstetrics/' }], pending: 'CONFIRMATION_PENDING: name, instructor, syllabus, format, duration, access, audience, platform, and URL.' },
    articulos: { slug: 'articles', alternateSlug: 'articulos', title: 'Articles and guidance', eyebrow: 'Library', description: 'Library of medically reviewed articles.', intro: 'This space will answer focused questions with an author, medical reviewer, review date, and relevant references.', sections: [{ title: 'Editorial standard', body: 'Generic articles will not be published merely to fill search results. Each article must answer a real need and link to a relevant service.' }], pending: 'No articles are published. Topics, authors, reviewers, and sources require editorial and medical approval.' },
    contacto: { slug: 'contact', alternateSlug: 'contacto', title: 'Request appointment information', eyebrow: 'Contact', description: 'Office WhatsApp and phone number for requesting appointment information with Dr. Ronald Salazar.', intro: 'Request information by WhatsApp or phone. The clinic will confirm availability and the next step; these channels do not provide immediate care or automatically confirm an appointment.', sections: [{ title: 'Protect your privacy', body: 'Do not include diagnoses, symptoms, results, or other sensitive medical information in a general contact form.' }], pending: 'P0: recipient email, address, map, hours, emergency guidance, privacy, and data retention.' },
    privacidad: { slug: 'privacy', alternateSlug: 'privacidad', title: 'Privacy', eyebrow: 'Legal', description: 'Pending privacy policy template.', intro: 'The final policy must be drafted or approved by the clinic’s legal and privacy lead.', sections: [{ title: 'Required content', body: 'Data controller, purposes, legal basis, recipients, service providers, retention, rights, and contact channels.' }], pending: 'LEGAL_APPROVAL_PENDING. This page is not a final privacy policy.' },
    'terminos-de-uso': { slug: 'terms-of-use', alternateSlug: 'terminos-de-uso', title: 'Terms of use', eyebrow: 'Legal', description: 'Pending website terms template.', intro: 'Website content is informational and does not constitute a consultation, diagnosis, or emergency care.', sections: [{ title: 'Final text pending', body: 'Approval is required for informational scope, intellectual property, external links, liability, and applicable jurisdiction.' }], pending: 'LEGAL_APPROVAL_PENDING. This page does not contain final terms.' },
  };
  const translated = translations[page.slug] ?? {};
  return {
    ...page,
    ...translated,
    sections: translated.sections ?? page.sections,
    related: translated.related ?? page.related?.map((item) => ({ ...item, href: item.href.replace(/^\/es\//, '/en/') })),
  };
});

export const innerPages: Record<Locale, InnerPageContent[]> = { es, en };
