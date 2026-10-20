// Regras da pré-triagem, baseadas no Anexo IV-B da Portaria de Consolidação nº 5/2017
// (incluído pela Portaria GM/MS nº 11.685/2026). Cada resposta desfavorável é avaliada
// sozinha e, quando a norma define prazo, gera a data a partir da qual a pessoa pode doar.
// O resultado é só orientativo: a aptidão é decidida na triagem clínica do hemocentro.
import { addDays, addMonths, addWeeks, addYears, differenceInYears, isAfter, max } from 'date-fns';

export type YesNo = 'yes' | 'no';

export interface EligibilityAnswers {
  birthDate?: string;
  donatedBefore60?: YesNo;
  weightOk?: YesNo;
  feelingWell?: YesNo;
  slept6h?: YesNo;
  alcohol12h?: YesNo;
  fattyMeal3h?: YesNo;
  fasting?: YesNo;
  tattoo?: YesNo;
  tattooDate?: string;
  tattooLicensed?: 'yes' | 'no' | 'unknown';
  piercingOralGenital?: 'none' | 'wearing' | 'removed';
  piercingRemovalDate?: string;
  antibiotic?: 'none' | 'taking' | 'finished';
  antibioticEndDate?: string;
  otherMedication?: YesNo;
  pregnant?: YesNo;
  recentBirth?: YesNo;
  birthEventDate?: string;
  breastfeeding?: YesNo;
  flu?: 'none' | 'ongoing' | 'recovered';
  fluFever?: YesNo;
  fluEndDate?: string;
  donatedBefore?: YesNo;
  lastDonationDate?: string;
  intervalDays?: '60' | '90' | 'unknown';
}

/**
 * out: fora dos critérios (idade, peso, primeira doação após os 60).
 * wait: impedimento temporário; `until` traz a data quando a norma permite calcular.
 * review: depende de avaliação individual na triagem.
 * note: orientação que não impede a doação.
 */
export interface Finding {
  rule: string;
  kind: 'out' | 'wait' | 'review' | 'note';
  message: string;
  until?: Date;
}

export type EligibilityStatus = 'eligible' | 'review' | 'wait' | 'not_eligible';

export interface EligibilityResult {
  status: EligibilityStatus;
  findings: Finding[];
  /** Maior data de retorno entre os impedimentos com prazo. */
  returnDate?: Date;
  /** Há impedimento sem data definida (ex.: sintomas em curso). */
  hasUndatedWait: boolean;
}

export function parseDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const [y, m, d] = value.split('-').map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

export function ageOn(birthDate: string | undefined, today: Date): number | undefined {
  const birth = parseDate(birthDate);
  return birth ? differenceInYears(today, birth) : undefined;
}

export function evaluateEligibility(a: EligibilityAnswers, today: Date = new Date()): EligibilityResult {
  const findings: Finding[] = [];
  const wait = (rule: string, message: string, until?: Date) => {
    // prazo já cumprido não impede a doação
    if (until && !isAfter(until, today)) return;
    findings.push({ rule, kind: 'wait', message, until });
  };

  // Idade (art. 39)
  const birth = parseDate(a.birthDate);
  const age = ageOn(a.birthDate, today);
  if (birth && age !== undefined) {
    if (age < 16) {
      wait('age', 'A doação é permitida a partir dos 16 anos.', addYears(birth, 16));
    } else if (age >= 70) {
      findings.push({ rule: 'age', kind: 'out', message: 'A doação é permitida até 69 anos, 11 meses e 29 dias.' });
    } else if (age >= 61 && a.donatedBefore60 === 'no') {
      findings.push({ rule: 'age', kind: 'out', message: 'A primeira doação precisa acontecer até 60 anos, 11 meses e 29 dias.' });
    } else if (age < 18) {
      findings.push({ rule: 'age', kind: 'note', message: 'Menores de 18 anos precisam de autorização por escrito do responsável a cada doação.' });
    }
  }

  // Peso (art. 40)
  if (a.weightOk === 'no') {
    findings.push({ rule: 'weight', kind: 'out', message: 'O peso mínimo para doar é 50 kg.' });
  }

  // Estado clínico (art. 36) e sono (critério básico do Ministério da Saúde)
  if (a.feelingWell === 'no') {
    wait('health', 'É preciso estar bem de saúde no dia da doação. Refaça a pré-triagem quando estiver recuperado.');
  }
  if (a.slept6h === 'no') {
    wait('sleep', 'É preciso ter dormido pelo menos 6 horas nas últimas 24 horas. Descanse e refaça a pré-triagem em outro dia.');
  }

  // Álcool (art. 49) e alimentação (art. 47)
  if (a.alcohol12h === 'yes') {
    wait('alcohol', 'Aguarde 12 horas depois do consumo de bebida alcoólica.');
  }
  if (a.fattyMeal3h === 'yes') {
    wait('fattyMeal', 'Aguarde 3 horas depois de uma refeição gordurosa.');
  }
  if (a.fasting === 'yes') {
    findings.push({ rule: 'fasting', kind: 'note', message: 'Não venha em jejum: faça uma refeição leve. O hemocentro oferece lanche antes da coleta.' });
  }

  // Tatuagem, maquiagem definitiva e piercing (art. 65; art. 66, VII; Anexo 2)
  const tattooDate = parseDate(a.tattooDate);
  if (a.tattoo === 'yes' && tattooDate) {
    if (a.tattooLicensed === 'yes') {
      wait('tattoo', 'Após tatuagem, maquiagem definitiva ou piercing, aguarde 7 dias. O hemocentro confirma na triagem se o local permite avaliar a segurança do procedimento; se não permitir, o prazo é de 4 meses.', addDays(tattooDate, 7));
    } else {
      wait('tattoo', 'Quando não é possível avaliar a segurança do procedimento, o prazo após tatuagem, maquiagem definitiva ou piercing é de 4 meses.', addMonths(tattooDate, 4));
    }
  }
  if (a.piercingOralGenital === 'wearing') {
    wait('piercing', 'Com piercing na boca ou na região genital, a doação é liberada 4 meses depois da retirada.');
  } else if (a.piercingOralGenital === 'removed') {
    const removed = parseDate(a.piercingRemovalDate);
    if (removed) wait('piercing', 'A doação é liberada 4 meses depois da retirada do piercing oral ou genital.', addMonths(removed, 4));
  }

  // Medicamentos (art. 44; art. 53, § 2º)
  if (a.antibiotic === 'taking') {
    wait('antibiotic', 'Você poderá doar 2 semanas depois de terminar o antibiótico e de os sintomas acabarem.');
  } else if (a.antibiotic === 'finished') {
    const end = parseDate(a.antibioticEndDate);
    if (end) wait('antibiotic', 'Após antibiótico, aguarde 2 semanas do fim do tratamento e dos sintomas.', addWeeks(end, 2));
  }
  if (a.otherMedication === 'yes') {
    findings.push({ rule: 'medication', kind: 'review', message: 'Outros medicamentos são avaliados individualmente na triagem. Leve o nome e a dose do remédio.' });
  }

  // Gestação, parto, abortamento e lactação (art. 45)
  if (a.pregnant === 'yes') {
    wait('pregnancy', 'Durante a gestação não é possível doar. A doação é liberada 12 semanas após o parto, se não estiver amamentando.');
  } else if (a.recentBirth === 'yes') {
    const event = parseDate(a.birthEventDate);
    if (event) {
      if (a.breastfeeding === 'yes') {
        wait('pregnancy', 'Durante a amamentação, a doação é liberada 12 meses após o parto.', addMonths(event, 12));
      } else {
        wait('pregnancy', 'Após parto ou abortamento, aguarde 12 semanas.', addWeeks(event, 12));
      }
    }
  }

  // Gripe e resfriado (art. 55)
  if (a.flu === 'ongoing') {
    wait('flu', 'Com sintomas de gripe ou resfriado não é possível doar. Refaça a pré-triagem quando os sintomas acabarem.');
  } else if (a.flu === 'recovered') {
    const end = parseDate(a.fluEndDate);
    if (end) {
      if (a.fluFever === 'yes') {
        wait('flu', 'Após gripe ou resfriado com febre de 38 °C ou mais, aguarde 2 semanas do fim dos sintomas.', addWeeks(end, 2));
      } else {
        wait('flu', 'Após resfriado comum, aguarde 3 dias do fim dos sintomas.', addDays(end, 3));
      }
    }
  }

  // Intervalo entre doações (art. 38): 60 dias para homens e 90 para mulheres
  const last = parseDate(a.lastDonationDate);
  if (a.donatedBefore === 'yes' && last) {
    const days = a.intervalDays === '60' ? 60 : 90;
    const message = a.intervalDays === 'unknown'
      ? 'O intervalo mínimo é de 60 dias para homens e 90 para mulheres. Usamos 90 dias; o hemocentro confirma na triagem.'
      : `O intervalo mínimo entre doações é de ${days} dias.`;
    wait('interval', message, addDays(last, days));
  }

  const dated = findings.filter((f) => f.kind === 'wait' && f.until).map((f) => f.until as Date);
  const returnDate = dated.length ? max(dated) : undefined;
  const hasUndatedWait = findings.some((f) => f.kind === 'wait' && !f.until);

  let status: EligibilityStatus = 'eligible';
  if (findings.some((f) => f.kind === 'out')) status = 'not_eligible';
  else if (findings.some((f) => f.kind === 'wait')) status = 'wait';
  else if (findings.some((f) => f.kind === 'review')) status = 'review';

  return { status, findings, returnDate, hasUndatedWait };
}
