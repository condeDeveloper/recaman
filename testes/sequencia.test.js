import test from 'node:test';
import assert from 'node:assert/strict';
import {
  porConjunto, porMarcas, CONHECIDOS, passos, repetidos, menorAusente, primeiraAparicao,
} from '../src/sequencia.js';

test('a sequencia comeca em zero', () => {
  assert.deepEqual(porConjunto(0), [0]);
});

test('os primeiros termos seguem a definicao, passo a passo', () => {
  // conferido a mao, um por um, sem olhar nenhuma lista:
  // a(1): 0-1 nao e positivo        -> 0+1 = 1
  // a(2): 1-2 nao e positivo        -> 1+2 = 3
  // a(3): 3-3 = 0, nao e positivo   -> 3+3 = 6
  // a(4): 6-4 = 2, novo             -> 2
  // a(5): 2-5 nao e positivo        -> 2+5 = 7
  // a(6): 7-6 = 1, ja apareceu      -> 7+6 = 13
  // a(7): 13-7 = 6, ja apareceu     -> 13+7 = 20
  // a(8): 20-8 = 12, novo           -> 12
  assert.deepEqual(porConjunto(8), [0, 1, 3, 6, 2, 7, 13, 20, 12]);
});

test('a(27) e 16, e nao 9', () => {
  // a(26) = 43 e 43-27 = 16, que ainda nao tinha aparecido: recua
  const t = porConjunto(27);
  assert.equal(t[26], 43);
  assert.equal(t[27], 16);
  assert.equal(t.slice(0, 27).includes(16), false);
});

test('os 40 primeiros termos batem com a lista conhecida', () => {
  assert.deepEqual(porConjunto(CONHECIDOS.length - 1), CONHECIDOS);
});

test('toda regra da definicao e respeitada, nos primeiros 20 mil termos', () => {
  const t = porConjunto(20000);
  const vistos = new Set([0]);
  for (let i = 1; i < t.length; i++) {
    const recuo = t[i - 1] - i;
    const podeRecuar = recuo > 0 && !vistos.has(recuo);
    assert.equal(t[i], podeRecuar ? recuo : t[i - 1] + i, `termo ${i}`);
    vistos.add(t[i]);
  }
});

test('nenhum termo e negativo', () => {
  for (const x of porConjunto(50000)) assert.ok(x >= 0);
});

test('cada passo anda exatamente n para um lado ou para o outro', () => {
  const t = porConjunto(10000);
  for (let i = 1; i < t.length; i++) {
    assert.equal(Math.abs(t[i] - t[i - 1]), i, `passo ${i}`);
  }
});

test('as duas implementacoes dao a mesma sequencia, ate 200 mil termos', () => {
  for (const n of [10, 100, 1000, 50000, 200000]) {
    assert.deepEqual(porMarcas(n), porConjunto(n), `n=${n}`);
  }
});

test('a implementacao por marcas cresce a tabela sem mudar nenhum termo', () => {
  // o vetor comeca com 8n posicoes e o maior valor passa disso em n grande
  const n = 100000;
  const t = porMarcas(n);
  let maior = 0;
  for (const x of t) if (x > maior) maior = x;
  assert.ok(maior > 5 * n, `o maior valor foi ${maior}`);
  assert.deepEqual(t, porConjunto(n));
});

test('passos marca recuo e avanco corretamente', () => {
  const t = [0, 1, 3, 6, 2, 7];
  assert.deepEqual(passos(t), [false, false, false, true, false]);
});

test('o primeiro recuo acontece no passo 4', () => {
  const p = passos(porConjunto(10));
  assert.equal(p.indexOf(true), 3);
});

test('menorAusente acha o primeiro buraco', () => {
  assert.equal(menorAusente([0, 1, 2, 4]), 3);
  assert.equal(menorAusente([1, 2, 3]), 0);
  assert.equal(menorAusente([0, 1, 2, 3]), 4);
});

test('os ausentes abaixo de 80, em mil termos, sao 19, 61 e 76', () => {
  // o 4 e o 5 demoram, mas chegam: nos passos 131 e 129
  const t = porConjunto(1000);
  const faltam = [];
  for (let k = 0; k < 80; k++) if (!t.includes(k)) faltam.push(k);
  assert.deepEqual(faltam, [19, 61, 76]);
  assert.equal(t.indexOf(4), 131);
  assert.equal(t.indexOf(5), 129);
});

test('o menor ausente so cresce conforme mais termos sao calculados', () => {
  let anterior = 0;
  for (const n of [100, 1000, 10000, 100000]) {
    const atual = menorAusente(porConjunto(n));
    assert.ok(atual >= anterior, `n=${n}: ${atual} depois de ${anterior}`);
    anterior = atual;
  }
});

test('repetidos lista os valores visitados mais de uma vez', () => {
  const r = repetidos([1, 2, 2, 3, 3, 3]);
  assert.deepEqual(r, [{ valor: 2, vezes: 2 }, { valor: 3, vezes: 3 }]);
});

test('a sequencia nao e injetiva: o 42 e visitado duas vezes', () => {
  const t = porConjunto(100);
  assert.equal(t.filter((x) => x === 42).length, 2);
  assert.equal(primeiraAparicao(t, 42), 20);
});

test('primeiraAparicao devolve -1 para quem ainda nao apareceu', () => {
  assert.equal(primeiraAparicao(porConjunto(1000), 19), -1);
  assert.equal(primeiraAparicao(porConjunto(1000), 61), -1);
});

test('a sequencia nunca repete o mesmo valor em passos seguidos', () => {
  const t = porConjunto(50000);
  for (let i = 1; i < t.length; i++) assert.notEqual(t[i], t[i - 1], `passo ${i}`);
});
