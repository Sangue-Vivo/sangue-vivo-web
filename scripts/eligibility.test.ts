// Testes das regras da pré-triagem. Uso: npm run test:eligibility
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateEligibility, type EligibilityAnswers } from '../src/utils/eligibility.ts';

const TODAY = new Date(2026, 9, 20); // 20/10/2026
const iso = (d: Date) => d.toISOString().slice(0, 10);
const daysAgo = (n: number) => iso(new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() - n));
const ymd = (d?: Date) => (d ? `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}` : undefined);

// Todas as respostas favoráveis
const base: EligibilityAnswers = {
  birthDate: '2004-03-15', weightOk: 'yes', feelingWell: 'yes', slept6h: 'yes', alcohol12h: 'no',
  fattyMeal3h: 'no', fasting: 'no', tattoo: 'no', piercingOralGenital: 'none', antibiotic: 'none',
  otherMedication: 'no', pregnant: 'no', recentBirth: 'no', flu: 'none', donatedBefore: 'no',
};
const run = (extra: EligibilityAnswers) => evaluateEligibility({ ...base, ...extra }, TODAY);

test('respostas favoráveis liberam a doação', () => {
  assert.equal(run({}).status, 'eligible');
});

test('tatuagem: 7 dias em local avaliável e 4 meses nos demais casos', () => {
  assert.equal(ymd(run({ tattoo: 'yes', tattooDate: daysAgo(3), tattooLicensed: 'yes' }).returnDate), '2026-10-24');
  assert.equal(run({ tattoo: 'yes', tattooDate: daysAgo(10), tattooLicensed: 'yes' }).status, 'eligible');
  assert.equal(ymd(run({ tattoo: 'yes', tattooDate: '2026-09-01', tattooLicensed: 'unknown' }).returnDate), '2027-1-1');
});

test('gripe: 2 semanas com febre e 3 dias sem febre', () => {
  assert.equal(ymd(run({ flu: 'recovered', fluFever: 'yes', fluEndDate: '2026-10-15' }).returnDate), '2026-10-29');
  assert.equal(ymd(run({ flu: 'recovered', fluFever: 'no', fluEndDate: '2026-10-19' }).returnDate), '2026-10-22');
  assert.equal(run({ flu: 'recovered', fluFever: 'no', fluEndDate: '2026-10-10' }).status, 'eligible');
  const ongoing = run({ flu: 'ongoing' });
  assert.equal(ongoing.status, 'wait');
  assert.equal(ongoing.hasUndatedWait, true);
});

test('parto: 12 semanas, ou 12 meses durante a amamentação', () => {
  assert.equal(ymd(run({ recentBirth: 'yes', birthEventDate: '2026-09-01', breastfeeding: 'no' }).returnDate), '2026-11-24');
  assert.equal(ymd(run({ recentBirth: 'yes', birthEventDate: '2026-09-01', breastfeeding: 'yes' }).returnDate), '2027-9-1');
  assert.equal(run({ pregnant: 'yes' }).status, 'wait');
});

test('antibiótico: 2 semanas após o fim; outros remédios vão para a triagem', () => {
  assert.equal(ymd(run({ antibiotic: 'finished', antibioticEndDate: '2026-10-18' }).returnDate), '2026-11-1');
  assert.equal(run({ otherMedication: 'yes' }).status, 'review');
});

test('idade: 16 anos, primeira doação até os 60 e limite de 69', () => {
  assert.equal(ymd(run({ birthDate: '2011-01-05' }).returnDate), '2027-1-5');
  assert.equal(run({ birthDate: '2009-05-01' }).findings[0].kind, 'note');
  assert.equal(run({ birthDate: '1965-06-01', donatedBefore60: 'no' }).status, 'not_eligible');
  assert.equal(run({ birthDate: '1965-06-01', donatedBefore60: 'yes' }).status, 'eligible');
  assert.equal(run({ birthDate: '1955-06-01' }).status, 'not_eligible');
  assert.equal(run({ birthDate: '1966-01-01', donatedBefore60: 'no' }).status, 'eligible'); // 60 anos
});

test('peso abaixo de 50 kg impede a doação', () => {
  assert.equal(run({ weightOk: 'no' }).status, 'not_eligible');
});

test('intervalo entre doações: 60 ou 90 dias', () => {
  assert.equal(ymd(run({ donatedBefore: 'yes', lastDonationDate: '2026-09-20', intervalDays: '60' }).returnDate), '2026-11-19');
  assert.equal(ymd(run({ donatedBefore: 'yes', lastDonationDate: '2026-09-20', intervalDays: 'unknown' }).returnDate), '2026-12-19');
});

test('jejum só gera orientação', () => {
  const r = run({ fasting: 'yes' });
  assert.equal(r.status, 'eligible');
  assert.equal(r.findings[0].kind, 'note');
});

// As 1.024 combinações das dez perguntas originais, comparadas ao modelo do Quadro 5:
// qualquer resposta desfavorável impede a doação no dia, menos o jejum.
const UNFAVORABLE: Record<string, EligibilityAnswers> = {
  age: { birthDate: '1950-01-01' },
  weight: { weightOk: 'no' },
  health: { feelingWell: 'no' },
  sleep: { slept6h: 'no' },
  tattoo: { tattoo: 'yes', tattooDate: daysAgo(10), tattooLicensed: 'unknown' },
  alcohol: { alcohol12h: 'yes' },
  medication: { antibiotic: 'taking' },
  pregnancy: { pregnant: 'yes' },
  flu: { flu: 'recovered', fluFever: 'yes', fluEndDate: daysAgo(3) },
  fasting: { fasting: 'yes' },
};

test('as 1.024 combinações seguem o modelo de regras independentes', () => {
  const keys = Object.keys(UNFAVORABLE);
  let checked = 0;
  for (let mask = 0; mask < 1 << keys.length; mask++) {
    const chosen = keys.filter((_, i) => mask & (1 << i));
    const answers = chosen.reduce((acc, k) => ({ ...acc, ...UNFAVORABLE[k] }), {} as EligibilityAnswers);
    const r = run(answers);
    const blocks = chosen.some((k) => k !== 'fasting');
    assert.equal(r.status === 'eligible', !blocks, `combinação ${chosen.join(', ') || 'nenhuma'}`);
    // impedimentos só com prazo definido na norma sempre trazem data de retorno
    if (blocks && chosen.every((k) => ['tattoo', 'flu', 'fasting'].includes(k))) {
      assert.ok(r.returnDate && !r.hasUndatedWait, `sem data: ${chosen.join(', ')}`);
    }
    checked++;
  }
  assert.equal(checked, 1024);
});
