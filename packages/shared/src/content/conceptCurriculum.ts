import type { ConceptTheory, LearningModule, Lesson } from "../types.js";

function conceptLesson(
  id: string,
  title: string,
  summary: string,
  theory: ConceptTheory,
): Lesson {
  return {
    id,
    title,
    summary,
    operation: "add",
    difficultyTier: 1,
    practiceEnabled: false,
    conceptTheory: theory,
  };
}

const foundationsLessons: Lesson[] = [
  conceptLesson(
    "number-system",
    "Sistema numérico",
    "Naturais, inteiros e racionais: entender onde cada tipo de número aparece no dia a dia.",
    {
      introTip: "Se 0,5 e 0,25 ainda confundem, este tópico é o ponto de partida.",
      conceptBlocks: [
        {
          title: "Números naturais (ℕ)",
          body: "São os números que usamos para contar objetos: 0, 1, 2, 3… (em muitos livros o zero também entra nos naturais). Não têm parte “quebrada”.",
        },
        {
          title: "Números inteiros (ℤ)",
          body: "Incluem os negativos: …, −2, −1, 0, 1, 2… Usamos para temperatura abaixo de zero, saldo devedor, andar de elevador abaixo do térreo.",
        },
        {
          title: "Números racionais (ℚ)",
          body: "São os que podem ser escritos como fração de dois inteiros (denominador ≠ 0), como 1/2 ou −3/4. Decimais finitos ou periódicos costumam ser racionais.",
        },
      ],
      vocabulary: [
        { term: "Numerador", definition: "Parte de cima da fração: quantas partes levamos." },
        { term: "Denominador", definition: "Parte de baixo: em quantas partes o inteiro foi dividido." },
        { term: "Reta numérica", definition: "Representação em linha: à direita cresce, à esquerda diminui." },
      ],
      ruleNotes: [
        { title: "Todo natural é inteiro?", text: "Na prática escolar, costumamos ver ℕ ⊂ ℤ: todo natural é também inteiro." },
        { title: "Zero", text: "Zero não é nem positivo nem negativo; é o neutro da soma." },
        { title: "Fração ≠ inteiro às vezes", text: "1/2 é racional; o valor não é inteiro, mas o número em si pertence aos racionais." },
      ],
      examples: [
        {
          id: "ex-1",
          title: "Exemplo 1",
          expression: "−3  <  2",
          visualLines: ["Naturais próximos:     0   1   2   3", "Inteiros com −3:  …  −3  −2  −1   0   1 …"],
          explanation: "Na reta, −3 fica à esquerda de 2, portanto é menor.",
          note: "Sinal “menor” (<) aponta para o número menor.",
        },
        {
          id: "ex-2",
          title: "Exemplo 2",
          expression: "1/2  e  0,5",
          visualLines: ["Fração:  1", "        ─", "        2", "", "Decimal: 0,5"],
          explanation: "Um meio e cinco décimos representam a mesma quantidade; são escrituras diferentes do mesmo racional.",
        },
      ],
    },
  ),
  conceptLesson(
    "reading-writing",
    "Leitura e escrita de números",
    "Ler e escrever números com clareza, respeitando classes (unidade, milhar, milhão…).",
    {
      conceptBlocks: [
        {
          title: "Algarismos e valor",
          body: "O mesmo algarismo vale quantidades diferentes conforme o lugar: no 353, o 3 da esquerda vale trezentos e o da direita vale três.",
        },
        {
          title: "Classes no Brasil",
          body: "Agrupamos de três em três da direita para a esquerda: unidade simples, dezena, centena; depois milhar, dezena de milhar…",
        },
      ],
      vocabulary: [
        { term: "Algarismo", definition: "Símbolo de 0 a 9 usado para formar números." },
        { term: "Classes", definition: "Grupos de três ordens (unidade, milhar, milhão…)." },
        { term: "Ordem", definition: "Posição dentro da classe (unidade, dezena, centena)." },
      ],
      ruleNotes: [
        { title: "Separador de milhar", text: "Em textos brasileiros costuma-se espaço ou ponto: 1 234 ou 1.234." },
        { title: "Decimal", text: "No Brasil a vírgula separa parte inteira da decimal: 3,14." },
      ],
      examples: [
        {
          id: "ex-1",
          title: "Lendo 4.028",
          expression: "4028",
          visualLines: ["4 → quatro mil", "0 → zero centenas", "2 → vinte", "8 → oito", "", "Leitura: quatro mil e vinte e oito."],
          explanation: "Lemos da esquerda para a direita, ligando milhar às dezenas e unidades.",
        },
        {
          id: "ex-2",
          title: "Escrevendo por extenso",
          expression: "150,4",
          visualLines: ["Centena: 1", "Dezena: 5", "Unidade: 0", "Décimos: 4"],
          explanation: "Por extenso: cento e cinquenta vírgula quatro (ou cento e cinquenta e quatro décimos).",
        },
      ],
    },
  ),
  conceptLesson(
    "place-value",
    "Valor posicional",
    "Unidade, dezena, centena e além: a base do sistema decimal.",
    {
      conceptBlocks: [
        {
          title: "Base 10",
          body: "10 unidades formam 1 dezena; 10 dezenas formam 1 centena. Por isso “deslocar” o algarismo uma casa multiplica ou divide por 10.",
        },
        {
          title: "Decompondo",
          body: "O número 472 pode ser visto como 400 + 70 + 2. Isso ajuda na conta mental e na conta armada.",
        },
      ],
      vocabulary: [
        { term: "Unidade", definition: "Primeira ordem à direita (quantidade “soltas”)." },
        { term: "Dezena", definition: "Pacotes de 10 unidades." },
        { term: "Centena", definition: "Pacotes de 10 dezenas (100 unidades)." },
      ],
      ruleNotes: [
        { title: "Zero à esquerda", text: "07 e 7 representam a mesma quantidade; em números maiores, zeros ocupam ordens vazias." },
        { title: "Expandir ajuda", text: "Sempre que travar, reescreva o número somando potências de 10 implícitas." },
      ],
      examples: [
        {
          id: "ex-1",
          title: "Quadro posicional",
          expression: "263",
          visualLines: ["  C   D   U", "  2   6   3", "", "2 centenas + 6 dezenas + 3 unidades"],
          explanation: "Cada coluna mostra quantos “pacotes” de cada tamanho temos.",
        },
        {
          id: "ex-2",
          title: "Trocar de lugar",
          expression: "35 e 53",
          visualLines: ["35 = 3 dezenas + 5 unidades", "53 = 5 dezenas + 3 unidades", "", "São quantidades diferentes!"],
          explanation: "O valor posicional mostra por que a ordem dos algarismos importa.",
        },
      ],
    },
  ),
  conceptLesson(
    "comparison",
    "Comparação de números",
    "Usar >, < e = com segurança, inclusive com decimais e frações.",
    {
      conceptBlocks: [
        {
          title: "Reta mental",
          body: "Quem está mais à direita na reta numérica é maior. Entre dois positivos, o maior tem mais “tamanho”; entre negativos, o mais próximo de zero é maior.",
        },
        {
          title: "Decimais",
          body: "Compare ordem a ordem da esquerda para a direita: 0,5 e 0,25 — na parte inteira ambos são 0; nos décimos, 5 > 2, logo 0,5 > 0,25.",
        },
      ],
      vocabulary: [
        { term: ">", definition: "Maior que: o lado “aberto” aponta para o maior." },
        { term: "<", definition: "Menor que: a ponta aponta para o menor." },
        { term: "=", definition: "Igualdade: mesma quantidade." },
      ],
      ruleNotes: [
        { title: "0,5 e 0,25", text: "0,5 = 0,50; comparando décimos, 5 > 2, então 0,5 > 0,25." },
        { title: "Negativos", text: "−10 < −3, porque −10 está mais à esquerda na reta." },
      ],
      examples: [
        {
          id: "ex-1",
          title: "Decimais",
          expression: "0,5  >  0,25",
          visualLines: ["0,50", "0,25", "↑ mesmo alinhamento: 5 > 2 nos décimos"],
          explanation: "Igualamos casas decimais mentalmente e comparamos da esquerda para a direita.",
        },
        {
          id: "ex-2",
          title: "Frações mesma base",
          expression: "3/4  >  1/4",
          visualLines: ["Mesmo denominador: quem tem maior numerador vence."],
          explanation: "Três quartos é mais do que um quarto.",
        },
      ],
    },
  ),
];

const fractionsLessons: Lesson[] = [
  conceptLesson(
    "fraction-intro",
    "O que é uma fração",
    "Parte de um inteiro dividido em partes iguais: numerador, denominador e significado.",
    {
      conceptBlocks: [
        {
          title: "Ideia central",
          body: "Denominador diz em quantas partes iguais dividimos o inteiro. Numerador diz quantas dessas partes estamos falando.",
        },
      ],
      vocabulary: [
        { term: "Fração própria", definition: "Numerador menor que denominador (menor que 1 inteiro)." },
        { term: "Fração imprópria", definition: "Numerador ≥ denominador; representa 1 ou mais inteiros." },
      ],
      ruleNotes: [
        { title: "Denominador nunca é zero", text: "Dividir o inteiro em “zero partes” não faz sentido." },
      ],
      examples: [
        {
          id: "ex-1",
          title: "Quatro partes iguais",
          expression: "3/4",
          visualLines: [
            "Inteiro dividido em 4:",
            "┌───┬───┬───┬───┐",
            "│▮▮▮│▮▮▮│▮▮▮│░░░│",
            "└───┴───┴───┴───┘",
            "3 partes pintadas de 4",
          ],
          explanation: "O denominador 4 diz em quantas fatias dividimos; o numerador 3 diz quantas pegamos.",
        },
      ],
    },
  ),
  conceptLesson(
    "fraction-simplify",
    "Simplificar frações",
    "Dividir numerador e denominador pelo mesmo número (fator comum) sem mudar o valor.",
    {
      conceptBlocks: [
        {
          title: "Fração equivalente",
          body: "6/8 = 3/4 porque ambos representam a mesma razão; simplificar é escolher representantes menores.",
        },
      ],
      vocabulary: [
        { term: "MDC", definition: "Maior divisor comum: divide em cima e embaixo até não poder mais." },
      ],
      ruleNotes: [
        { title: "Sempre o mesmo fator", text: "O que você divide em cima deve ser igual ao de baixo." },
      ],
      examples: [
        {
          id: "ex-1",
          title: "Simplificar 6/8",
          expression: "6/8 = 3/4",
          armedLines: ["÷2", "6   3", "─ = ─", "8   4"],
          explanation: "MDC(6,8)=2. Dividimos numerador e denominador por 2.",
        },
      ],
    },
  ),
  conceptLesson(
    "fraction-decimal",
    "Fração ↔ decimal",
    "Converter entre formas para comparar e calcular.",
    {
      conceptBlocks: [
        {
          title: "Fração → decimal",
          body: "Divida numerador pelo denominador: 1/4 = 0,25.",
        },
        {
          title: "Decimal → fração",
          body: "Conte casas decimais: 0,25 = 25/100 = 1/4 após simplificar.",
        },
      ],
      vocabulary: [
        { term: "Decimal exato", definition: "Divisão termina (ex.: 1/4 = 0,25)." },
        { term: "Dízima", definition: "Parte decimal infinita e periódica em alguns racionais." },
      ],
      ruleNotes: [
        { title: "Lembrete clássico", text: "1/2 = 0,5 = 50% — vale treinar até ficar automático." },
      ],
      examples: [
        {
          id: "ex-1",
          title: "Meio",
          expression: "1/2 = 0,5 = 50%",
          visualLines: ["Metade do inteiro", "Metade em decimal", "Metade em %"],
          explanation: "Três formas para a mesma quantidade relativa.",
        },
      ],
    },
  ),
  conceptLesson(
    "fraction-ops",
    "Operações com frações (introdução)",
    "Mesmo denominador: some os numeradores. Denominadores diferentes: precisa de denominador comum (MMC).",
    {
      conceptBlocks: [
        {
          title: "Mesma base",
          body: "1/5 + 2/5 = 3/5. A “unidade de medida” das partes é a mesma.",
        },
        {
          title: "Bases diferentes",
          body: "1/2 + 1/4: reescrevemos 1/2 como 2/4, depois 2/4 + 1/4 = 3/4.",
        },
      ],
      vocabulary: [
        { term: "MMC", definition: "Menor múltiplo comum dos denominadores para alinhar as partes." },
      ],
      ruleNotes: [
        { title: "Multiplicação", text: "Multiplica em linha reta: (2/3)×(4/5) = 8/15 (simplifique ao final)." },
        { title: "Divisão", text: "Inverte a segunda fração e multiplica (regra prática escolar)." },
      ],
      examples: [
        {
          id: "ex-1",
          title: "Soma",
          expression: "1/2 + 1/4 = 3/4",
          visualLines: ["1/2 = 2/4", "2/4 + 1/4 = 3/4"],
          explanation: "Igualamos os denominadores antes de somar os numeradores.",
        },
      ],
    },
  ),
  conceptLesson(
    "percent-intro",
    "Porcentagem (%)",
    "Significa “por cem”: comparação e descontos no dia a dia.",
    {
      conceptBlocks: [
        {
          title: "Definição",
          body: "50% é a mesma razão que 50/100 ou 0,50. 100% é o inteiro de referência.",
        },
      ],
      vocabulary: [
        { term: "Referência", definition: "O ‘100%’ é sempre relativo a um total escolhido." },
      ],
      ruleNotes: [
        { title: "Desconto", text: "20% de desconto: paga 80% do preço (100% − 20%)." },
      ],
      examples: [
        {
          id: "ex-1",
          title: "De fração para %",
          expression: "3/4 = 75%",
          visualLines: ["3 ÷ 4 = 0,75", "0,75 × 100 = 75%"],
          explanation: "Multiplicamos o decimal por 100 e usamos o símbolo %.",
        },
      ],
    },
  ),
];

const measuresLessons: Lesson[] = [
  conceptLesson(
    "length-units",
    "Comprimento",
    "Metro, centímetro, quilômetro: medir distâncias e conversões básicas.",
    {
      conceptBlocks: [{ title: "Escalas", body: "km para medidas grandes; m e cm no cotidiano." }],
      vocabulary: [
        { term: "m", definition: "Metro — unidade principal do SI no dia a dia." },
        { term: "cm", definition: "Centésimo do metro." },
        { term: "km", definition: "Mil metros." },
      ],
      ruleNotes: [{ title: "1 km", text: "1 km = 1000 m." }],
      examples: [
        {
          id: "ex-1",
          title: "Converter",
          expression: "2 km = ? m",
          visualLines: ["2 × 1000 = 2000 m"],
          explanation: "Cada quilômetro vale mil metros.",
        },
      ],
    },
  ),
  conceptLesson(
    "mass-units",
    "Massa",
    "Quilograma e grama: peso de objetos e receitas.",
    {
      conceptBlocks: [{ title: "Base", body: "1 kg = 1000 g. Balanças costumam mostrar kg ou g." }],
      vocabulary: [
        { term: "kg", definition: "Quilograma." },
        { term: "g", definition: "Grama." },
      ],
      ruleNotes: [{ title: "Trocar unidade", text: "Multiplique ou divida por potências de 10 conforme o prefixo." }],
      examples: [
        {
          id: "ex-1",
          title: "Receita",
          expression: "500 g = ? kg",
          visualLines: ["500 ÷ 1000 = 0,5 kg"],
          explanation: "Gramas para quilos: dividimos por 1000.",
        },
      ],
    },
  ),
  conceptLesson(
    "time-units",
    "Tempo",
    "Hora, minuto e segundo: ler relógios e durações.",
    {
      conceptBlocks: [{ title: "60 base", body: "60 segundos = 1 minuto; 60 minutos = 1 hora." }],
      vocabulary: [
        { term: "h", definition: "Hora." },
        { term: "min", definition: "Minuto." },
        { term: "s", definition: "Segundo." },
      ],
      ruleNotes: [{ title: "1 hora", text: "1 hora = 60 minutos." }],
      examples: [
        {
          id: "ex-1",
          title: "Duração",
          expression: "90 min = ? h",
          visualLines: ["90 ÷ 60 = 1,5 h", "(1 h e 30 min)"],
          explanation: "Convertemos minutos em horas dividindo por 60.",
        },
      ],
    },
  ),
  conceptLesson(
    "unit-conversion",
    "Conversões",
    "Estratégia: usar fatores iguais a 1 (ex.: 1000 m / 1 km) e cancelar unidades.",
    {
      conceptBlocks: [
        {
          title: "Fator de conversão",
          body: "Escreva a relação conhecida como fração (1000 m / 1 km) e multiplique medindo se a unidade cancela certo.",
        },
      ],
      vocabulary: [{ term: "Prefixo", definition: "k = mil, c = centésimo, m = milésimo (cuidado: m também é metro!)." }],
      ruleNotes: [{ title: "Checar sentido", text: "Quilômetro é maior que metro: o número em km deve ser menor que em m para a mesma distância." }],
      examples: [
        {
          id: "ex-1",
          title: "km → m",
          expression: "3,5 km",
          visualLines: ["3,5 × 1000 = 3500 m"],
          explanation: "Multiplicamos por 1000 porque cada km vale mil metros.",
        },
      ],
    },
  ),
];

const geometryLessons: Lesson[] = [
  conceptLesson(
    "shapes",
    "Formas planas",
    "Quadrado, retângulo, triângulo e círculo: reconhecer e nomear.",
    {
      conceptBlocks: [
        { title: "Polígonos", body: "Quadrado e retângulo têm 4 ângulos retos; o quadrado tem os quatro lados iguais." },
        { title: "Triângulo", body: "Três lados; pode ser equilátero, isósceles ou escaleno." },
        { title: "Círculo", body: "Todos os pontos à mesma distância do centro; essa distância é o raio." },
      ],
      vocabulary: [
        { term: "Lado", definition: "Segmento que forma a borda do polígono." },
        { term: "Raio", definition: "Distância do centro à borda do círculo." },
      ],
      ruleNotes: [{ title: "Quadrado especial", text: "Quadrado é um retângulo com lados iguais." }],
      examples: [
        {
          id: "ex-1",
          title: "Retângulo",
          expression: "base × altura (área, próxima aula)",
          visualLines: ["┌──────┐", "│      │", "└──────┘"],
          explanation: "Dois pares de lados paralelos e ângulos retos.",
        },
      ],
    },
  ),
  conceptLesson(
    "area-perimeter",
    "Área e perímetro",
    "Perímetro “cerca” a forma; área mede o interior.",
    {
      conceptBlocks: [
        {
          title: "Retângulo",
          body: "Área A = base × altura. Perímetro P = soma dos lados = 2b + 2h.",
        },
        {
          title: "Sentido",
          body: "Área usa quadradinhos (unidades²); perímetro usa só o contorno (unidades).",
        },
      ],
      vocabulary: [
        { term: "Área", definition: "Superfície coberta dentro da forma." },
        { term: "Perímetro", definition: "Comprimento do contorno." },
      ],
      ruleNotes: [{ title: "Unidade", text: "Área em cm²: cada 1 cm² é um quadradinho de 1 cm de lado." }],
      examples: [
        {
          id: "ex-1",
          title: "Retângulo 3 × 2",
          expression: "A = 3 × 2 = 6",
          visualLines: ["▮▮▮", "▮▮▮", "(2 linhas de 3 quadrados)"],
          explanation: "Contamos 6 unidades de área.",
          note: "Perímetro: 3+2+3+2 = 10 unidades de comprimento.",
        },
      ],
    },
  ),
  conceptLesson(
    "circle-intro",
    "Círculo (introdução)",
    "Circunferência, raio e noção de π em linguagem simples.",
    {
      conceptBlocks: [
        {
          title: "π (pi)",
          body: "Razão entre o comprimento da circunferência e o diâmetro; valor aproximado 3,14 em muitos exercícios.",
        },
      ],
      vocabulary: [
        { term: "Diâmetro", definition: "Segmento que passa pelo centro e toca dois pontos opostos." },
      ],
      ruleNotes: [{ title: "Fórmula (referência)", text: "Comprimento C ≈ 2πr (para aprofundar depois)." }],
      examples: [
        {
          id: "ex-1",
          title: "Raio 1",
          expression: "r = 1",
          visualLines: ["   ●", " (○)  ← todos os pontos da borda à mesma distância do centro"],
          explanation: "Visualmente: compasso aberto no raio e gira ao redor do centro.",
        },
      ],
    },
  ),
];

const algebraLessons: Lesson[] = [
  conceptLesson(
    "variables",
    "Variáveis (x, y…)",
    "Letras representam números desconhecidos ou que podem mudar.",
    {
      conceptBlocks: [
        { title: "Por que letras?", body: "Generaliza regras: ‘qualquer número x’ segue a mesma lógica." },
      ],
      vocabulary: [
        { term: "Incógnita", definition: "Valor que queremos descobrir (comum em equações)." },
      ],
      ruleNotes: [{ title: "Termos", text: "Em 3x + 2, 3x é um termo e 2 é outro." }],
      examples: [
        {
          id: "ex-1",
          title: "Traduzir",
          expression: "“Um número x com 5 a mais”",
          visualLines: ["x + 5"],
          explanation: "A frase vira expressão algébrica.",
        },
      ],
    },
  ),
  conceptLesson(
    "expressions",
    "Expressões simples",
    "Calcular valor quando sabemos as variáveis; respeitar ordem de operações.",
    {
      conceptBlocks: [
        { title: "Substituir", body: "Se x = 4, então 2x + 1 = 2(4) + 1 = 9." },
      ],
      vocabulary: [
        { term: "Coeficiente", definition: "Número que multiplica a variável (o 2 em 2x)." },
      ],
      ruleNotes: [{ title: "Ordem", text: "Parênteses, potências, multiplicação/divisão, soma/subtração." }],
      examples: [
        {
          id: "ex-1",
          title: "Avaliar",
          expression: "x = 3 em 2x − 1",
          visualLines: ["2(3) − 1 = 6 − 1 = 5"],
          explanation: "Substituímos x por 3 e calculamos.",
        },
      ],
    },
  ),
  conceptLesson(
    "equations-basic",
    "Equações básicas",
    "Manter igualdade: o que fizer de um lado, faça do outro.",
    {
      conceptBlocks: [
        {
          title: "Objetivo",
          body: "Isolar a variável: em x + 5 = 12, subtraímos 5 dos dois lados e obtemos x = 7.",
        },
      ],
      vocabulary: [
        { term: "Lado esquerdo / direito", definition: "Separados pelo sinal de igual." },
      ],
      ruleNotes: [{ title: "Balanceamento", text: "Soma, subtrai, multiplica ou divide nos dois lados para manter a igualdade verdadeira." }],
      examples: [
        {
          id: "ex-1",
          title: "Clássico",
          expression: "x + 5 = 12",
          armedLines: ["x + 5 = 12", "   −5   −5", "x = 7"],
          explanation: "Tiramos 5 dos dois lados para isolar x.",
        },
      ],
    },
  ),
];

const logicLessons: Lesson[] = [
  conceptLesson(
    "word-problems",
    "Problemas com texto",
    "Ler com calma, destacar dados e perguntas, escolher operação.",
    {
      conceptBlocks: [
        {
          title: "Estratégia",
          body: "1) O que é dado? 2) O que se pede? 3) Desenhe ou escreva em símbolos. 4) Confira se a resposta faz sentido.",
        },
      ],
      vocabulary: [
        { term: "Dado", definition: "Informação numérica explícita no enunciado." },
      ],
      ruleNotes: [{ title: "Unidade", text: "Responda na unidade pedida (reais, metros, pessoas…)." }],
      examples: [
        {
          id: "ex-1",
          title: "Modelo",
          expression: "“Comprei 3 por R$ 5 cada”",
          visualLines: ["Total = 3 × 5 = 15 reais"],
          explanation: "Multiplicação agrupa quantidades iguais.",
        },
      ],
    },
  ),
  conceptLesson(
    "rule-of-three",
    "Regra de três simples",
    "Proporção direta: montar razões iguais e achar o valor faltante.",
    {
      conceptBlocks: [
        {
          title: "Ideia",
          body: "Se 2 livros custam R$ 40, quanto custam 5 na mesma proporção? Montamos tabela e cruzamos multiplicações.",
        },
      ],
      vocabulary: [
        { term: "Grandeza proporcional", definition: "Quando uma dobra, a outra dobra na mesma razão." },
      ],
      ruleNotes: [{ title: "Atenção", text: "Só use se o contexto for proporcional (nem tudo na vida é!)." }],
      examples: [
        {
          id: "ex-1",
          title: "Direta",
          expression: "2 → 40 | 5 → ?",
          visualLines: ["? = (5 × 40) / 2 = 100"],
          explanation: "Multiplica em cruz e divide pelo terceiro valor.",
        },
      ],
    },
  ),
  conceptLesson(
    "logic-reasoning",
    "Raciocínio lógico",
    "Se… então…, casos possíveis e eliminação de alternativas.",
    {
      conceptBlocks: [
        { title: "Implicação", body: "Se chove, rua molhada (em geral). Testar consistência ajuda em múltipla escolha." },
      ],
      vocabulary: [
        { term: "Contraexemplo", definition: "Um caso que derruba uma afirmação ‘sempre’." },
      ],
      ruleNotes: [{ title: "Paciência", text: "Anote hipóteses pequenas antes de saltar para a conta." }],
      examples: [
        {
          id: "ex-1",
          title: "Eliminar",
          expression: "Par ou ímpar?",
          visualLines: ["127 termina em 7 → ímpar"],
          explanation: "Olhamos o último algarismo para paridade.",
        },
      ],
    },
  ),
  conceptLesson(
    "graphs-intro",
    "Gráficos simples",
    "Ler eixos, escalas e tendência (sobe, desce, constante).",
    {
      conceptBlocks: [
        { title: "Eixos", body: "Horizontal costuma ser tempo ou categoria; vertical é a quantidade medida." },
      ],
      vocabulary: [
        { term: "Escala", definition: "Quanto cada “quadradinho” vale no eixo." },
      ],
      ruleNotes: [{ title: "Título", text: "Sempre leia o título do gráfico antes de concluir." }],
      examples: [
        {
          id: "ex-1",
          title: "Tendência",
          expression: "Linha sobe",
          visualLines: [
            "Valor",
            "  │     ╱",
            "  │   ╱",
            "  │ ╱",
            "  └──────► tempo",
          ],
          explanation: "Em gráficos de linha, subida indica crescimento da grandeza ao longo do eixo horizontal.",
        },
      ],
    },
  ),
];

export const FOUNDATIONS_MODULE: LearningModule = {
  id: "foundations",
  title: "Fundamentos",
  description:
    "Sistema numérico, leitura/escrita, valor posicional e comparação de números — base para todos os demais tópicos.",
  available: true,
  lessons: foundationsLessons,
};

export const FRACTIONS_DECIMALS_MODULE: LearningModule = {
  id: "fractions",
  title: "Frações e decimais",
  description:
    "Frações, simplificação, conversões, operações introdutórias e porcentagem (ex.: 1/2 = 0,5 = 50%).",
  available: true,
  lessons: fractionsLessons,
};

export const MEASURES_MODULE: LearningModule = {
  id: "measures",
  title: "Medidas e unidades",
  description: "Comprimento, massa, tempo e conversões para o cotidiano.",
  available: true,
  lessons: measuresLessons,
};

export const GEOMETRY_MODULE: LearningModule = {
  id: "geometry",
  title: "Geometria básica",
  description: "Formas planas, área, perímetro e noção de círculo.",
  available: true,
  lessons: geometryLessons,
};

export const ALGEBRA_MODULE: LearningModule = {
  id: "algebra-intro",
  title: "Introdução à álgebra",
  description: "Variáveis, expressões e equações simples.",
  available: true,
  lessons: algebraLessons,
};

export const LOGIC_MODULE: LearningModule = {
  id: "logic-interpretation",
  title: "Interpretação e lógica",
  description: "Problemas com texto, regra de três, raciocínio e leitura de gráficos.",
  available: true,
  lessons: logicLessons,
};
