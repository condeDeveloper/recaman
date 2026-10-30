// A sequencia de Recaman (A005132):
//
//   a(0) = 0
//   a(n) = a(n-1) - n   se esse valor for positivo e ainda nao tiver aparecido
//          a(n-1) + n   caso contrario
//
// A regra cabe em duas linhas e o comportamento nao cabe em livro nenhum: ela
// recua sempre que pode, e quando nao pode, salta. A pergunta em aberto desde
// 1991 e se TODO inteiro acaba aparecendo. Ninguem sabe.
//
// Aqui estao duas implementacoes que nao compartilham estrutura: uma guarda os
// vistos num Set de inteiros, a outra num vetor de marcas. Se as duas
// discordarem em algum termo, uma esta errada.

/** Implementacao 1: conjunto de vistos. */
export function porConjunto(n) {
  const termos = [0];
  const vistos = new Set([0]);
  let atual = 0;
  for (let i = 1; i <= n; i++) {
    const recuo = atual - i;
    atual = recuo > 0 && !vistos.has(recuo) ? recuo : atual + i;
    termos.push(atual);
    vistos.add(atual);
  }
  return termos;
}

/**
 * Implementacao 2: vetor de marcas, com crescimento sob demanda. Nao usa Set,
 * nao usa hash: so indice de array. O limite superior de a(n) e n(n+1)/2, porque
 * no pior caso todo passo e um avanco.
 */
export function porMarcas(n) {
  // O teto teorico e n(n+1)/2, que para um milhao de termos pediria 500 GB.
  // Na pratica o maior valor fica perto de 6n, entao a tabela comeca pequena e
  // dobra quando precisa. Nenhum termo muda por causa disso: so a memoria.
  let marcado = new Uint8Array(Math.max(64, 8 * n));
  const garantir = (indice) => {
    if (indice < marcado.length) return;
    let novo = marcado.length;
    while (novo <= indice) novo *= 2;
    const maior = new Uint8Array(novo);
    maior.set(marcado);
    marcado = maior;
  };

  const termos = [0];
  marcado[0] = 1;
  let atual = 0;
  for (let i = 1; i <= n; i++) {
    const recuo = atual - i;
    atual = recuo > 0 && !marcado[recuo] ? recuo : atual + i;
    garantir(atual);
    termos.push(atual);
    marcado[atual] = 1;
  }
  return termos;
}

/**
 * Os primeiros termos da A005132. Juiz externo: estes valores nao saem do
 * codigo acima, e os quarenta primeiros foram conferidos passo a passo contra a
 * definicao em `testes/sequencia.test.js`.
 */
export const CONHECIDOS = [
  0, 1, 3, 6, 2, 7, 13, 20, 12, 21, 11, 22, 10, 23, 9, 24, 8, 25, 43, 62,
  42, 63, 41, 18, 42, 17, 43, 16, 44, 15, 45, 14, 46, 79, 113, 78, 114, 77, 39, 78,
];

/** Se o passo i foi recuo (true) ou avanco (false). */
export function passos(termos) {
  const saida = [];
  for (let i = 1; i < termos.length; i++) saida.push(termos[i] < termos[i - 1]);
  return saida;
}

/** Os valores que aparecem mais de uma vez, com quantas vezes. */
export function repetidos(termos) {
  const conta = new Map();
  for (const t of termos) conta.set(t, (conta.get(t) || 0) + 1);
  const saida = [];
  for (const [valor, vezes] of conta) if (vezes > 1) saida.push({ valor, vezes });
  return saida.sort((a, b) => a.valor - b.valor);
}

/**
 * O menor inteiro nao negativo que NAO aparece nos primeiros n termos. Enquanto
 * a conjectura estiver aberta, este numero e tudo o que da para dizer com
 * honestidade sobre "todo inteiro aparece".
 */
export function menorAusente(termos) {
  const vistos = new Set(termos);
  let k = 0;
  while (vistos.has(k)) k++;
  return k;
}

/** Em que passo o valor `alvo` aparece pela primeira vez, ou -1. */
export function primeiraAparicao(termos, alvo) {
  return termos.indexOf(alvo);
}
