# A sequência de Recamán: recue se puder, salte se não

A regra cabe em duas linhas:

```
a(0) = 0
a(n) = a(n-1) - n   se isso for positivo e ainda não tiver aparecido
       a(n-1) + n   caso contrário
```

Recue sempre que der; quando não der, salte. Dá `0, 1, 3, 6, 2, 7, 13, 20, 12,
21, 11, 22, 10, 23, 9, 24, 8, 25, 43, 62, 42, ...` — e ninguém sabe se **todo**
inteiro acaba aparecendo. A pergunta está aberta desde 1991.

Este repositório calcula um milhão de termos por duas implementações que não
compartilham estrutura, e mede tudo o que dá para medir sem resolver a conjectura.
Node puro, sem dependência nenhuma.

## Os quatro achados

1. **A fatia de passos que recuam converge para exatamente 50%.** É 49,30% em mil
   termos, 49,92% em dez mil, 49,99% em cem mil e 50,00% em um milhão. A regra é
   assimétrica — recuar tem duas condições, avançar não tem nenhuma — e mesmo
   assim o empate é perfeito.
2. **A fatia de valores distintos cai conforme a sequência cresce:** 82,4% em mil
   termos, 77,4% em dez mil, 74,3% em cem mil e 73,7% em um milhão. Em um milhão
   de passos, 107.199 valores são visitados mais de uma vez.
3. **O menor inteiro ainda ausente cresce muito devagar: 19, 19, 61 e 1.355.** Mil
   vezes mais termos não deram nem cem vezes mais alcance. É tudo o que dá para
   afirmar com honestidade sobre a conjectura: nada aqui a prova nem a derruba.
4. **O maior valor fica perto de 6n, e não do teto teórico n(n+1)/2.** Em um
   milhão de termos o maior é 5.946.126; o teto seria 500 bilhões. Foi essa
   diferença que obrigou a segunda implementação a crescer a tabela sob demanda.

## As tabelas

Tudo abaixo sai de `node ferramentas/medidor.js`, e está preso em
`testes/medidas.test.js`.

### Recua ou avança?

| termos | recuos | fatia de recuos |
|---|---|---|
| 1.000 | 493 | 49,30% |
| 10.000 | 4.992 | 49,92% |
| 100.000 | 49.990 | 49,99% |
| 1.000.000 | 499.988 | **50,00%** |

### Quantos valores distintos aparecem

| termos | distintos | fatia | valores repetidos |
|---|---|---|---|
| 1.000 | 825 | 82,4% | 128 |
| 10.000 | 7.741 | 77,4% | 1.466 |
| 100.000 | 74.253 | 74,3% | 11.389 |
| 1.000.000 | 736.749 | **73,7%** | 107.199 |

### Até onde a sequência chega

| termos | maior valor | em múltiplos de n |
|---|---|---|
| 1.000 | 3.686 | 3,69n |
| 10.000 | 37.947 | 3,79n |
| 100.000 | 592.216 | 5,92n |
| 1.000.000 | 5.946.126 | 5,95n |

### O menor inteiro que ainda não apareceu

| termos | menor ausente |
|---|---|
| 1.000 | 19 |
| 10.000 | 19 |
| 100.000 | 61 |
| 1.000.000 | **1.355** |

Em mil termos faltam apenas três números abaixo de 80: o **19**, o **61** e o
**76**. O 4 e o 5, que parecem difíceis, chegam nos passos 131 e 129.

### Os valores visitados mais de uma vez

Em dez mil termos, 1.466 valores se repetem. O primeiro é o **42**, que aparece no
passo 20 e volta no 24. O mais visitado é o **10.023**, sete vezes.

## O que as medidas me corrigiram

- **Digitei a lista de termos "conhecidos" de cabeça e ela estava errada a partir
  do 28º.** Pus `a(27) = 9`; o certo é **16**. Derivando à mão: `a(26) = 43`, e
  `43 − 27 = 16`, que ainda não tinha aparecido, então a sequência recua para 16.
  O pior é onde o erro estava: no **juiz**, o arquivo que existe para pegar erro
  da implementação. A implementação estava certa e eu quase "consertei" o lado
  certo. Agora os primeiros termos são derivados passo a passo no teste, com a
  conta escrita, em vez de copiados.
- **Escrevi num teste que o 4 e o 5 não aparecem nos primeiros mil termos.
  Aparecem**, nos passos 131 e 129. Os que faltam de verdade abaixo de 80 são o
  19, o 61 e o 76. Números pequenos *parecem* difíceis de alcançar, e não é por aí
  que a sequência os deixa de fora.
- **A segunda implementação alocava o teto teórico `n(n+1)/2`.** Para um milhão
  de termos isso pede 500 GB, e o programa morria com `Array buffer allocation
  failed`. O maior valor de verdade fica perto de **6n**. A tabela passou a
  começar pequena e dobrar quando precisa — o que não muda nenhum termo, só a
  memória.

## Como está organizado

```
src/sequencia.js   as duas implementações, os passos, os repetidos e o ausente
ferramentas/medidor.js  roda as varreduras e imprime as tabelas acima
testes/            48 testes
```

Uma implementação guarda os valores vistos num `Set`; a outra num `Uint8Array` de
marcas, sem hash nenhum. As duas concordam em todos os 1.000.001 termos.

## Rodar

```bash
node --test testes/*.test.js   # a bateria inteira
node ferramentas/medidor.js    # recalcula todas as tabelas deste README
```

Sem `npm install`: não há dependência. Precisa de Node 18 ou mais novo.

## Licença

MIT.
