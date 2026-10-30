#!/usr/bin/env node
// O medidor: roda as varreduras e imprime as tabelas que vao para o README.
// Nenhum numero do README e digitado a mao; todos saem daqui.

import {
  porConjunto, porMarcas, CONHECIDOS, passos, repetidos, menorAusente, primeiraAparicao,
} from '../src/sequencia.js';

const br = (x) => x.toLocaleString('pt-BR');

export const TAMANHOS = [1000, 10000, 100000, 1000000];

const guardado = new Map();

export function medir(n) {
  if (guardado.has(n)) return guardado.get(n);
  const termos = porConjunto(n);
  const outra = porMarcas(n);
  const iguais = termos.length === outra.length && termos.every((x, i) => x === outra[i]);

  let maior = 0;
  for (const x of termos) if (x > maior) maior = x;
  const recuos = passos(termos).filter(Boolean).length;
  const distintos = new Set(termos).size;

  const r = {
    n,
    termos,
    iguais,
    maior,
    recuos,
    distintos,
    ausente: menorAusente(termos),
    repetidos: repetidos(termos),
  };
  guardado.set(n, r);
  return r;
}

function imprimir() {
  console.log('\n== Tabela 1: as duas implementacoes concordam? ==');
  console.log('  Uma guarda os vistos num Set, a outra num vetor de marcas.');
  console.log('  termos | concordam em todos');
  for (const n of TAMANHOS) {
    const r = medir(n);
    console.log(`  ${br(n).padStart(9)} | ${r.iguais ? 'sim' : 'NAO'}`);
    if (!r.iguais) {
      console.error(`AS DUAS IMPLEMENTACOES DIVERGEM em n=${n}`);
      process.exit(1);
    }
  }

  console.log('\n== Tabela 2: a sequencia contra os termos conhecidos ==');
  {
    const r = medir(1000);
    let erros = 0;
    for (let i = 0; i < CONHECIDOS.length; i++) if (r.termos[i] !== CONHECIDOS[i]) erros++;
    console.log(`  primeiros ${CONHECIDOS.length} termos conferidos | divergencias: ${erros}`);
    console.log(`  ${CONHECIDOS.slice(0, 20).join(', ')}, ...`);
    if (erros > 0) process.exit(1);
  }

  console.log('\n== Tabela 3: recua ou avanca? ==');
  console.log('  termos | recuos | fatia de recuos');
  for (const n of TAMANHOS) {
    const r = medir(n);
    console.log(
      `  ${br(n).padStart(9)} | ${br(r.recuos).padStart(9)} | ${((100 * r.recuos) / n).toFixed(2)}%`
    );
  }

  console.log('\n== Tabela 4: quantos valores DISTINTOS aparecem ==');
  console.log('  termos | distintos | fatia | repetidos');
  for (const n of TAMANHOS) {
    const r = medir(n);
    console.log(
      `  ${br(n).padStart(9)} | ${br(r.distintos).padStart(9)} | ${((100 * r.distintos) / (n + 1)).toFixed(1)}% | ${br(r.repetidos.length)}`
    );
  }

  console.log('\n== Tabela 5: ate onde a sequencia chega ==');
  console.log('  termos | maior valor | em multiplos de n');
  for (const n of TAMANHOS) {
    const r = medir(n);
    console.log(`  ${br(n).padStart(9)} | ${br(r.maior).padStart(11)} | ${(r.maior / n).toFixed(2)}n`);
  }

  console.log('\n== Tabela 6: o menor inteiro que ainda NAO apareceu ==');
  console.log('  E uma conjectura em aberto desde 1991 se todo inteiro aparece.');
  console.log('  Tudo o que da para afirmar com honestidade esta nesta coluna.');
  console.log('  termos | menor ausente');
  for (const n of TAMANHOS) {
    const r = medir(n);
    console.log(`  ${br(n).padStart(9)} | ${br(r.ausente)}`);
  }

  console.log('\n== Tabela 7: os valores que a sequencia visita mais de uma vez ==');
  {
    const r = medir(10000);
    const mais = r.repetidos.reduce((a, b) => (b.vezes > a.vezes ? b : a));
    console.log(`  em 10.000 termos, ${br(r.repetidos.length)} valores aparecem mais de uma vez`);
    console.log(`  o primeiro deles e ${r.repetidos[0].valor}, visitado ${r.repetidos[0].vezes} vezes`);
    console.log(`  o mais visitado e ${br(mais.valor)}, ${mais.vezes} vezes`);
    console.log(`  o 42 aparece primeiro no passo ${primeiraAparicao(r.termos, 42)}`);
  }

  console.log('\n== Fechamento ==');
  const grande = medir(1000000);
  console.log(`  termos calculados ................ ${br(1000000)}`);
  console.log(`  implementacoes que divergiram .... 0`);
  console.log(`  fatia de recuos .................. ${((100 * grande.recuos) / grande.n).toFixed(2)}%`);
  console.log(`  valores distintos ................ ${br(grande.distintos)}`);
  console.log(`  menor inteiro ausente ............ ${br(grande.ausente)}`);
  console.log('');
}

if (process.argv[1]?.endsWith('medidor.js')) imprimir();
