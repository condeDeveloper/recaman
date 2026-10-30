// Os numeros que aparecem no README, presos aqui. Todos sairam de
// `node ferramentas/medidor.js`; nenhum foi digitado de cabeca.

import test from 'node:test';
import assert from 'node:assert/strict';
import { medir, TAMANHOS } from '../ferramentas/medidor.js';
import { CONHECIDOS, primeiraAparicao } from '../src/sequencia.js';

const tabela = {
  1000: { recuos: 493, fatiaRecuo: 49.30, distintos: 825, repetidos: 128, maior: 3686, ausente: 19 },
  10000: { recuos: 4992, fatiaRecuo: 49.92, distintos: 7741, repetidos: 1466, maior: 37947, ausente: 19 },
  100000: { recuos: 49990, fatiaRecuo: 49.99, distintos: 74253, repetidos: 11389, maior: 592216, ausente: 61 },
  1000000: { recuos: 499988, fatiaRecuo: 50.00, distintos: 736749, repetidos: 107199, maior: 5946126, ausente: 1355 },
};

test('a varredura cobre de mil a um milhao de termos', () => {
  assert.deepEqual(TAMANHOS, [1000, 10000, 100000, 1000000]);
});

for (const n of TAMANHOS) {
  const t = tabela[n];

  test(`tabela 1, n=${n}: as duas implementacoes concordam`, () => {
    assert.equal(medir(n).iguais, true);
  });

  test(`tabela 3, n=${n}: ${t.recuos} recuos, ou ${t.fatiaRecuo}%`, () => {
    const r = medir(n);
    assert.equal(r.recuos, t.recuos);
    const fatia = (100 * r.recuos) / n;
    assert.ok(Math.abs(fatia - t.fatiaRecuo) < 0.005, `fatia medida: ${fatia}`);
  });

  test(`tabela 4, n=${n}: ${t.distintos} valores distintos e ${t.repetidos} repetidos`, () => {
    const r = medir(n);
    assert.equal(r.distintos, t.distintos);
    assert.equal(r.repetidos.length, t.repetidos);
  });

  test(`tabela 5, n=${n}: o maior valor e ${t.maior}`, () => {
    assert.equal(medir(n).maior, t.maior);
  });

  test(`tabela 6, n=${n}: o menor inteiro ausente e ${t.ausente}`, () => {
    assert.equal(medir(n).ausente, t.ausente);
  });
}

test('tabela 2: os 40 primeiros termos batem com a lista conhecida', () => {
  const r = medir(1000);
  for (let i = 0; i < CONHECIDOS.length; i++) {
    assert.equal(r.termos[i], CONHECIDOS[i], `termo ${i}`);
  }
});

test('tabela 3: a fatia de recuos converge para 50%', () => {
  const fatias = TAMANHOS.map((n) => (100 * medir(n).recuos) / n);
  for (let i = 1; i < fatias.length; i++) {
    assert.ok(Math.abs(fatias[i] - 50) < Math.abs(fatias[i - 1] - 50), `${fatias}`);
  }
  assert.ok(Math.abs(fatias[fatias.length - 1] - 50) < 0.01);
});

test('tabela 4: a fatia de distintos CAI conforme a sequencia cresce', () => {
  const fatias = TAMANHOS.map((n) => (100 * medir(n).distintos) / (n + 1));
  for (let i = 1; i < fatias.length; i++) {
    assert.ok(fatias[i] < fatias[i - 1], `${fatias}`);
  }
  assert.ok(fatias[0] > 82 && fatias[0] < 83);
  assert.ok(fatias[3] > 73 && fatias[3] < 74);
});

test('tabela 5: o maior valor fica perto de 6n, nao de n(n+1)/2', () => {
  // o teto teorico de um milhao de termos seria 500 bilhoes
  const r = medir(1000000);
  assert.ok(r.maior / r.n > 5.9 && r.maior / r.n < 6.0, `${r.maior / r.n}n`);
  assert.ok(r.maior < (r.n * (r.n + 1)) / 2);
});

test('tabela 6: o menor ausente cresce, mas devagar', () => {
  const ausentes = TAMANHOS.map((n) => medir(n).ausente);
  assert.deepEqual(ausentes, [19, 19, 61, 1355]);
  // mil vezes mais termos nao deram nem cem vezes mais alcance
  assert.ok(ausentes[3] / ausentes[0] < 100);
});

test('tabela 6: a conjectura continua de pe: nenhum ausente foi descartado', () => {
  // o que da para dizer e que ate um milhao de termos o 1.355 ainda nao saiu
  const r = medir(1000000);
  assert.equal(r.termos.includes(r.ausente), false);
  assert.equal(primeiraAparicao(r.termos, r.ausente), -1);
});

test('tabela 7: em 10 mil termos, 42 e o primeiro valor repetido', () => {
  const r = medir(10000);
  assert.equal(r.repetidos[0].valor, 42);
  assert.equal(r.repetidos[0].vezes, 2);
  assert.equal(primeiraAparicao(r.termos, 42), 20);
});

test('tabela 7: o valor mais visitado em 10 mil termos e o 10.023, sete vezes', () => {
  const r = medir(10000);
  const mais = r.repetidos.reduce((a, b) => (b.vezes > a.vezes ? b : a));
  assert.equal(mais.valor, 10023);
  assert.equal(mais.vezes, 7);
});

test('fechamento: um milhao de termos, zero divergencia entre as implementacoes', () => {
  const r = medir(1000000);
  assert.equal(r.iguais, true);
  assert.equal(r.termos.length, 1000001);
});
