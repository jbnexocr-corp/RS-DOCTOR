import type { Locale } from '@/lib/i18n';

export type ServiceDetail = {
  slug: string;
  alternateSlug: string;
  pillarSlug: string;
  title: string;
  eyebrow: string;
  description: string;
  summary: string;
  sections: Array<{ title: string; body: string }>;
  questions: string[];
  reviewStatus: 'pending-medical-review';
};

type ServiceSeed = {
  esSlug: string;
  enSlug: string;
  esPillar: string;
  enPillar: string;
  esTitle: string;
  enTitle: string;
  esSummary: string;
  enSummary: string;
  esQuestions: string[];
  enQuestions: string[];
};

const seeds: ServiceSeed[] = [
  { esSlug: 'consulta-prenatal', enSlug: 'prenatal-consultation', esPillar: 'gineco-obstetricia', enPillar: 'obstetrics', esTitle: 'Consulta prenatal', enTitle: 'Prenatal consultation', esSummary: 'Página preparada para explicar el inicio y seguimiento del control prenatal según la oferta confirmada.', enSummary: 'A page prepared to explain how prenatal care begins and continues according to the confirmed offering.', esQuestions: ['¿Cómo se inicia el control prenatal?', '¿Qué información conviene llevar?', '¿Cómo se coordinan los siguientes controles?'], enQuestions: ['How does prenatal care begin?', 'What information should I bring?', 'How are follow-up visits coordinated?'] },
  { esSlug: 'parto-vaginal', enSlug: 'vaginal-birth', esPillar: 'gineco-obstetricia', enPillar: 'obstetrics', esTitle: 'Atención del parto vaginal', enTitle: 'Vaginal birth care', esSummary: 'Estructura editorial para explicar preparación, valoración, coordinación hospitalaria y seguimiento.', enSummary: 'Editorial structure for preparation, assessment, hospital coordination, and follow-up.', esQuestions: ['¿Cómo se conversa el plan de nacimiento?', '¿Dónde se coordina la atención?', '¿Qué seguimiento se ofrece?'], enQuestions: ['How is a birth plan discussed?', 'Where is care coordinated?', 'What follow-up is available?'] },
  { esSlug: 'cesarea', enSlug: 'cesarean-birth', esPillar: 'gineco-obstetricia', enPillar: 'obstetrics', esTitle: 'Parto por cesárea', enTitle: 'Cesarean birth', esSummary: 'Información equilibrada sobre evaluación, planificación y recuperación que requiere aprobación médica.', enSummary: 'Balanced information about evaluation, planning, and recovery pending medical approval.', esQuestions: ['¿Cómo se planifica una cesárea?', '¿Qué alternativas se conversan?', '¿Cómo se organiza el seguimiento?'], enQuestions: ['How is a cesarean birth planned?', 'Which alternatives are discussed?', 'How is follow-up organized?'] },
  { esSlug: 'consulta-ginecologica', enSlug: 'gynecology-consultation', esPillar: 'ginecologia', enPillar: 'gynecology', esTitle: 'Consulta ginecológica', enTitle: 'Gynecology consultation', esSummary: 'Ruta para explicar entrevista, valoración, estudios disponibles y orientación individual.', enSummary: 'A route for explaining the interview, evaluation, available studies, and individual guidance.', esQuestions: ['¿Qué puedo conversar en la consulta?', '¿Qué debo llevar?', '¿Cómo se coordinan estudios y seguimiento?'], enQuestions: ['What can I discuss during the visit?', 'What should I bring?', 'How are tests and follow-up coordinated?'] },
  { esSlug: 'papanicolaou', enSlug: 'pap-smear', esPillar: 'ginecologia', enPillar: 'gynecology', esTitle: 'Papanicolaou (PAP)', enTitle: 'Pap smear', esSummary: 'Página específica para diferenciar el PAP de otras pruebas cervicales sin interpretar resultados en línea.', enSummary: 'A dedicated page distinguishing the Pap test from other cervical tests without interpreting results online.', esQuestions: ['¿En qué se diferencia de la prueba de VPH?', '¿Cómo se prepara la consulta?', '¿Cómo se reciben los resultados?'], enQuestions: ['How is it different from HPV testing?', 'How should I prepare?', 'How are results delivered?'] },
  { esSlug: 'prueba-vph', enSlug: 'hpv-test', esPillar: 'ginecologia', enPillar: 'gynecology', esTitle: 'Prueba de VPH', enTitle: 'HPV testing', esSummary: 'Estructura preparada para explicar la prueba, su alcance confirmado y su relación con otros hallazgos.', enSummary: 'A prepared structure explaining the test, its confirmed scope, and its relationship to other findings.', esQuestions: ['¿Qué identifica la prueba?', '¿Es lo mismo que un PAP?', '¿Cómo se coordina el seguimiento?'], enQuestions: ['What does the test identify?', 'Is it the same as a Pap test?', 'How is follow-up coordinated?'] },
  { esSlug: 'colposcopia', enSlug: 'colposcopy', esPillar: 'ginecologia', enPillar: 'gynecology', esTitle: 'Colposcopía', enTitle: 'Colposcopy', esSummary: 'Página para explicar cuándo puede considerarse, qué ocurre durante la valoración y cómo continúa el proceso.', enSummary: 'A page explaining when it may be considered, what happens during assessment, and what comes next.', esQuestions: ['¿Cuándo puede indicarse?', '¿Siempre incluye toma de muestra?', '¿Cómo se entregan resultados?'], enQuestions: ['When may it be indicated?', 'Does it always include tissue sampling?', 'How are results delivered?'] },
  { esSlug: 'histeroscopia', enSlug: 'hysteroscopy', esPillar: 'cirugia-ginecologica', enPillar: 'gynecological-surgery', esTitle: 'Histeroscopía', enTitle: 'Hysteroscopy', esSummary: 'Información para diferenciar usos diagnósticos y terapéuticos según la práctica confirmada.', enSummary: 'Information distinguishing diagnostic and therapeutic uses according to the confirmed practice.', esQuestions: ['¿Qué valoración se necesita?', '¿Dónde se realiza?', '¿Cómo se organiza la recuperación?'], enQuestions: ['What evaluation is needed?', 'Where is it performed?', 'How is recovery organized?'] },
  { esSlug: 'ablacion-endometrial', enSlug: 'endometrial-ablation', esPillar: 'cirugia-ginecologica', enPillar: 'gynecological-surgery', esTitle: 'Ablación endometrial', enTitle: 'Endometrial ablation', esSummary: 'Página preparada para explicar selección, alternativas, limitaciones e implicaciones reproductivas.', enSummary: 'A page prepared to explain selection, alternatives, limitations, and reproductive implications.', esQuestions: ['¿Quién podría considerarla?', '¿Qué alternativas existen?', '¿Qué seguimiento requiere?'], enQuestions: ['Who might consider it?', 'What alternatives exist?', 'What follow-up is required?'] },
  { esSlug: 'miomectomia', enSlug: 'myomectomy', esPillar: 'cirugia-ginecologica', enPillar: 'gynecological-surgery', esTitle: 'Miomectomía', enTitle: 'Myomectomy', esSummary: 'Estructura para explicar evaluación, vías disponibles, alternativas y seguimiento sin prometer resultados.', enSummary: 'A structure explaining evaluation, available approaches, alternatives, and follow-up without promising results.', esQuestions: ['¿Cómo se evalúan los miomas?', '¿De qué depende la vía?', '¿Cómo se planifica el seguimiento?'], enQuestions: ['How are fibroids evaluated?', 'What determines the approach?', 'How is follow-up planned?'] },
  { esSlug: 'polipectomia', enSlug: 'polypectomy', esPillar: 'cirugia-ginecologica', enPillar: 'gynecological-surgery', esTitle: 'Polipectomía', enTitle: 'Polypectomy', esSummary: 'Página preparada para precisar el tipo de pólipo, la técnica confirmada y el protocolo de seguimiento.', enSummary: 'A page prepared to clarify polyp type, confirmed technique, and follow-up protocol.', esQuestions: ['¿Qué valoración se realiza?', '¿Cómo se relaciona con la histeroscopía?', '¿Qué ocurre después?'], enQuestions: ['What assessment is performed?', 'How does it relate to hysteroscopy?', 'What happens afterward?'] },
  { esSlug: 'labioplastia', enSlug: 'labiaplasty', esPillar: 'salud-intima', enPillar: 'intimate-health', esTitle: 'Labioplastia', enTitle: 'Labiaplasty', esSummary: 'Información respetuosa sobre valoración, expectativas, alternativas, límites y posibles riesgos.', enSummary: 'Respectful information about assessment, expectations, alternatives, limitations, and possible risks.', esQuestions: ['¿Cómo se realiza la valoración?', '¿Qué alternativas se conversan?', '¿Cómo se explica la recuperación?'], enQuestions: ['How is the assessment performed?', 'Which alternatives are discussed?', 'How is recovery explained?'] },
  { esSlug: 'valoracion-piso-pelvico', enSlug: 'pelvic-floor-assessment', esPillar: 'piso-pelvico', enPillar: 'pelvic-floor', esTitle: 'Valoración de piso pélvico', enTitle: 'Pelvic floor assessment', esSummary: 'Ruta clara para identificar quién realiza la valoración, su alcance y los siguientes pasos.', enSummary: 'A clear route identifying who performs the assessment, its scope, and next steps.', esQuestions: ['¿Quién realiza la valoración?', '¿Qué incluye?', '¿Cómo se define un plan?'], enQuestions: ['Who performs the assessment?', 'What does it include?', 'How is a plan defined?'] },
  { esSlug: 'fisioterapia-piso-pelvico', enSlug: 'pelvic-floor-physiotherapy', esPillar: 'piso-pelvico', enPillar: 'pelvic-floor', esTitle: 'Fisioterapia de piso pélvico', enTitle: 'Pelvic floor physiotherapy', esSummary: 'Página para presentar a la persona profesional responsable, alcance, modalidad y coordinación clínica.', enSummary: 'A page presenting the responsible professional, scope, format, and clinical coordination.', esQuestions: ['¿Quién brinda el servicio?', '¿Cómo se coordina con la valoración médica?', '¿Qué modalidad está disponible?'], enQuestions: ['Who provides the service?', 'How is it coordinated with medical assessment?', 'Which format is available?'] },
  { esSlug: 'nutricion', enSlug: 'nutrition', esPillar: 'atencion-integral', enPillar: 'integrated-care', esTitle: 'Nutrición', enTitle: 'Nutrition', esSummary: 'Ficha preparada para identificar profesional, formación, alcance, modalidad y coordinación.', enSummary: 'A prepared profile identifying the professional, education, scope, format, and coordination.', esQuestions: ['¿Quién brinda la atención?', '¿Qué alcance tiene?', '¿Cómo se coordina el seguimiento?'], enQuestions: ['Who provides care?', 'What is its scope?', 'How is follow-up coordinated?'] },
  { esSlug: 'coaching', enSlug: 'coaching', esPillar: 'atencion-integral', enPillar: 'integrated-care', esTitle: 'Coaching y acompañamiento', enTitle: 'Coaching and support', esSummary: 'Página para delimitar claramente su alcance y diferenciarlo de atención médica o salud mental.', enSummary: 'A page clearly defining its scope and distinguishing it from medical or mental health care.', esQuestions: ['¿Quién ofrece el acompañamiento?', '¿Cuál es su alcance?', '¿Qué servicios no sustituye?'], enQuestions: ['Who provides support?', 'What is its scope?', 'Which services does it not replace?'] },
];

const commonSections = {
  es: [
    { title: 'Qué es y para qué se utiliza', body: 'Esta sección queda estructurada para incorporar una explicación aprobada, directa y comprensible del servicio sin diagnosticar ni prometer resultados.' },
    { title: 'Valoración y preparación', body: 'La evaluación previa, los requisitos, el lugar de atención y cualquier preparación se publicarán únicamente cuando la clínica confirme su proceso real.' },
    { title: 'Alternativas, límites y seguimiento', body: 'La versión aprobada presentará alternativas, beneficios posibles, limitaciones, riesgos y seguimiento de forma equilibrada y específica.' },
  ],
  en: [
    { title: 'What it is and why it is used', body: 'This section is structured for an approved, direct, and understandable explanation without diagnosing or promising outcomes.' },
    { title: 'Assessment and preparation', body: 'Prior evaluation, requirements, care setting, and preparation will be published only after the clinic confirms its actual process.' },
    { title: 'Alternatives, limitations, and follow-up', body: 'The approved version will present alternatives, possible benefits, limitations, risks, and follow-up in a balanced, specific way.' },
  ],
};

export const serviceDetails: Record<Locale, ServiceDetail[]> = {
  es: seeds.map((item) => ({ slug: item.esSlug, alternateSlug: item.enSlug, pillarSlug: item.esPillar, title: item.esTitle, eyebrow: 'Servicio', description: `${item.esTitle} — información para solicitar una valoración con el Dr. Ronald Salazar.`, summary: item.esSummary, sections: commonSections.es, questions: item.esQuestions, reviewStatus: 'pending-medical-review' })),
  en: seeds.map((item) => ({ slug: item.enSlug, alternateSlug: item.esSlug, pillarSlug: item.enPillar, title: item.enTitle, eyebrow: 'Service', description: `${item.enTitle} — information for requesting an evaluation with Dr. Ronald Salazar.`, summary: item.enSummary, sections: commonSections.en, questions: item.enQuestions, reviewStatus: 'pending-medical-review' })),
};
