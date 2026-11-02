import type { PageKey } from "../i18n";
import type { Strings } from "./es";

export const name = "Português";

export const slugs: Record<PageKey, string> = {
  uses: "para-quem",
  worksheets: "fichas",
  convert: "converter",
  privacy: "privacidade",
  accessibility: "acessibilidade",
};

export const strings: Strings = {
  meta: {
    description:
      "Ajuda à leitura livre e gratuita para pessoas com PHDA e dislexia: destaca o início de cada palavra na web e nos seus livros digitais. Tudo fica no seu dispositivo.",
  },
  nav: {
    skip: "Saltar para o conteúdo",
    home: "Início",
    convert: "Converter um livro",
    privacy: "Privacidade",
    accessibility: "Acessibilidade",
    github: "Código-fonte",
    language: "Idioma",
    theme: {
      label: "Tema",
      light: "claro",
      dark: "escuro",
    },
  },
  hero: {
    headline: "Leia à sua maneira",
    lede: "Destaca suavemente o início de cada palavra para que os olhos tenham onde pousar. Para pessoas com PHDA, dislexia ou para quem simplesmente se sente mais à vontade assim. Gratuito, sem contas, e nada sai do seu dispositivo.",
  },
  install: {
    chrome: "Adicionar ao Chrome ou Edge",
    firefox: "Adicionar ao Firefox",
    preview:
      "Ainda não está nas lojas. Entretanto, pode instalar a versão de pré-visualização a partir do GitHub.",
  },
  demo: {
    heading: "Experimente com o seu próprio texto",
    intro:
      "Cole qualquer texto. O resultado atualiza-se de imediato e não há limite de comprimento.",
    input: "O seu texto",
    output: "Como fica",
    sample:
      "Ler deve ser confortável. Há pessoas que perdem o sítio onde estavam, saltam palavras ou se cansam antes do fim de um parágrafo. Marcar o início de cada palavra dá aos olhos um ponto de apoio: experimente várias intensidades e estilos até encontrar o seu.",
    strength: "Intensidade",
    style: "Estilo",
    styles: {
      "bold-fade": "Negrito e esbatido",
      bold: "Negrito",
      color: "Cor",
      underline: "Sublinhado",
      fade: "Esbater o resto",
    },
    more: "Mais opções",
    every: "Destacar",
    everyOptions: ["Todas as palavras", "1 em cada 2 palavras", "1 em cada 3 palavras"],
    lineHeight: "Espaçamento entre linhas",
    maxWidth: "Largura máxima da linha",
    pageDefault: "Normal",
    widths: ["Estreita (50 carateres)", "Média (65 carateres)", "Larga (80 carateres)"],
  },
  privacy: {
    heading: "Nada sai do seu dispositivo",
    body: [
      "A extensão, esta página e o conversor de livros funcionam inteiramente no seu navegador. Não há nenhum servidor para onde enviar seja o que for.",
      "Sem contas, sem estatísticas, sem cookies e sem limites de utilização.",
    ],
    more: "Ler a política de privacidade",
  },
  faq: {
    heading: "Perguntas",
    items: [
      {
        q: "Funciona mesmo?",
        a: [
          "Depende da pessoa. Os estudos publicados até agora não mostram que, em média, se leia mais depressa ou se compreenda melhor com este tipo de destaque.",
          "O que muitas pessoas dizem é que a leitura se torna mais confortável, que se perdem menos ou que é mais fácil começar. Por isso não prometemos rapidez: oferecemos uma ajuda que pode ajustar ou desligar. Experimente a demonstração e fique com o que lhe for útil.",
        ],
      },
      {
        q: "Tem algum custo?",
        a: [
          "Não, e nunca terá. Sem versão paga, sem limite de palavras, sem limite de tamanho de ficheiro. É software livre com licença MPL-2.0.",
        ],
      },
      {
        q: "Posso usá-lo com os meus livros digitais?",
        a: [
          "Sim. Em «Converter um livro», escolhe um ficheiro EPUB, TXT, Markdown ou HTML e descarrega uma cópia com destaque. A conversão é feita no seu navegador. Os livros com DRM não podem ser convertidos.",
        ],
      },
      {
        q: "Funciona em qualquer língua?",
        a: [
          "Em todas as línguas que separam as palavras com espaços, incluindo as que se escrevem da direita para a esquerda. O chinês, o japonês, o tailandês e outras escritas sem espaços ficam como estão.",
        ],
      },
      {
        q: "E se eu usar um leitor de ecrã?",
        a: ["O texto é lido exatamente como antes: nenhum caráter é acrescentado nem removido."],
      },
      {
        q: "Funciona no telemóvel?",
        a: ["Sim, com o Firefox para Android. Mais tarde haverá uma aplicação própria."],
      },
    ],
  },
  footer: {
    license: "Software livre com licença MPL-2.0.",
  },
  uses: {
    title: "Para quem é",
    intro:
      "Cada pessoa lê à sua maneira. Aqui ficam algumas formas de usar a ferramenta, conforme quem é e para que precisa dela. Todas têm algo em comum: é uma ajuda opcional, que pode ajustar ou desligar, e não recolhe dados nenhuns.",
    homeHeading: "Para quem é",
    how: "Como usar",
    care: "A ter em conta",
    cases: [
      {
        id: "education",
        title: "Educação",
        summary:
          "Para docentes, escolas e famílias que querem adaptar as leituras sem criar materiais novos.",
        link: "Ideias para a sala de aula e para casa",
        lede: "Para docentes, equipas de apoio educativo e famílias que querem que ler custe um pouco menos, sem preparar materiais diferentes para cada aluno ou aluna.",
        steps: [
          "Adapte os materiais que já tem: converta leituras, apontamentos ou livros em EPUB, TXT, Markdown ou HTML e partilhe-os tal como estão.",
          "Na aula, projete a demonstração com o texto do dia e experimentem juntos várias intensidades e estilos. Deixe que cada aluno ou aluna diga o que lhe parece mais confortável.",
          "Nos computadores da escola, a extensão funciona sem contas nem registos e não recolhe dados dos alunos.",
          "Crie fichas de leitura com letra grande e uma moldura simpática em «Fichas» e depois imprima-as ou guarde-as em PDF.",
          "Em casa, a mesma extensão ajuda nos trabalhos de casa e na leitura na web.",
        ],
        notes: [
          "É uma ajuda opcional: ajuda alguns alunos e outros não. Deixe cada pessoa escolher e desligá-la se quiser.",
          "Não substitui o apoio educativo nem o diagnóstico de dificuldades de aprendizagem.",
        ],
      },
      {
        id: "speech-therapy",
        title: "Terapeutas da fala e outros profissionais",
        summary:
          "Para terapeutas da fala, psicólogos educacionais e orientadores que procuram uma ferramenta simples para experimentar nas sessões.",
        link: "Como usar nas sessões",
        lede: "Para terapeutas da fala, psicólogos educacionais, orientadores e outros profissionais que acompanham pessoas com dificuldades de leitura.",
        steps: [
          "Na sessão, cole um texto na demonstração e experimente várias configurações com a pessoa. Anote a que lhe parece mais confortável: intensidade, estilo, palavras destacadas, espaçamento entre linhas.",
          "Prepare materiais de trabalho com o conversor e entregue-os em papel, no ecrã ou num leitor de livros digitais.",
          "Recomende a extensão para usar em casa, com as configurações que escolheram juntos.",
          "Tudo funciona no dispositivo: nenhum texto nem dado de pacientes passa por um servidor.",
        ],
        notes: [
          "Não é um tratamento nem um método de intervenção na leitura. Pode ser um apoio dentro do seu trabalho.",
          "Os estudos não mostram um ganho médio de velocidade nem de compreensão. Apresente-o como uma questão de conforto e preferência, e avalie caso a caso.",
        ],
      },
      {
        id: "adults",
        title: "Adultos",
        summary:
          "Para quem quer voltar a ler mas não se consegue concentrar, perde o fio ou se cansa depressa.",
        link: "Como começar",
        lede: "Se quer ler mais mas custa-lhe começar, perde o fio, lê a mesma frase três vezes ou à segunda página já não tem energia, isto pode ajudar. E se não ajudar, não faz mal.",
        steps: [
          "Instale a extensão e ative-a com Alt+B num artigo que lhe interesse. Comece por textos curtos.",
          "Converta um livro que tenha mesmo vontade de ler e passe-o para o seu leitor de livros digitais ou para o telemóvel.",
          "Ajuste a intensidade até se sentir confortável. Em «Mais opções» pode aumentar o espaçamento entre linhas e estreitar as linhas: para muitas pessoas, isso ajuda tanto como o destaque.",
          "Se num dia se tornar cansativo, desligue-a. É a sua maneira de ler, não uma regra.",
        ],
        notes: [
          "Não funciona para toda a gente, e não faz mal. Dê-lhe alguns dias antes de decidir.",
          "Se acha que a PHDA ou a dislexia podem estar por trás das suas dificuldades, falar com um profissional pode ajudar.",
        ],
      },
    ],
  },
  worksheets: {
    title: "Fichas de leitura",
    nav: "Fichas",
    intro:
      "Crie fichas com letra grande, o início de cada palavra destacado e uma moldura simpática. Escolha um texto de exemplo ou escreva o seu e depois imprima-o ou descarregue-o.",
    editor: "Personalizar a ficha",
    example: "Escolher um texto",
    titleLabel: "Título",
    textLabel: "Texto",
    theme: "Moldura",
    themes: {
      none: "Sem moldura",
      simple: "Simples",
      clouds: "Nuvens",
      garden: "Jardim",
      stars: "Estrelas",
      vehicles: "Carros e camiões",
    },
    size: "Tamanho do texto",
    sizes: ["Grande", "Muito grande", "Enorme"],
    nameDate: "Adicionar nome e data",
    name: "Nome",
    date: "Data",
    lines: "Linhas para escrever",
    linesOptions: ["Nenhuma", "3 linhas", "6 linhas", "10 linhas"],
    preview: "Pré-visualização",
    showPageSize: "Mostrar o tamanho da página",
    pageSizes: {
      portrait: "A4 vertical (210 × 297 mm)",
      landscape: "A4 horizontal (297 × 210 mm)",
    },
    pageN: "Página {n}",
    editHint:
      "Pode escrever diretamente na ficha: clique no título ou no texto. O destaque é aplicado quando terminar.",
    editTitle: "Título da ficha",
    editText: "Texto da ficha",
    print: "Imprimir ou guardar em PDF",
    download: "Descarregar a ficha",
    printHint:
      "Para a guardar em PDF, escolha «Guardar como PDF» na janela de impressão. É impressa com fundo branco para poupar tinta.",
    downloadHint:
      "O ficheiro descarregado é uma página web que pode abrir e imprimir sempre que quiser, mesmo sem ligação à internet.",
    fileName: "ficha",
    tabs: { text: "Texto", layout: "Paginação", emphasis: "Destaque" },
    myTexts: "Os meus textos",
    save: "Guardar nos meus textos",
    saved: "«{title}» foi guardado nos meus textos.",
    remove: "Retirar dos meus textos",
    removed: "«{title}» foi retirado dos meus textos.",
    exportTexts: "Exportar os meus textos",
    importTexts: "Importar textos",
    imported: "Textos importados: {n}.",
    importEmpty:
      "Esse ficheiro não tem textos. Use um ficheiro .md com títulos «## » ou um ficheiro .txt.",
    libraryNote:
      "Os seus textos ficam guardados apenas neste navegador. Exporte-os para guardar uma cópia, partilhá-los ou passá-los para outro computador.",
    exportHeading: "Os meus textos para fichas",
    levelKey: "Nível",
    textsFileName: "os-meus-textos-fichas",
    orientation: "Orientação",
    orientations: { portrait: "Vertical", landscape: "Horizontal" },
    overflow:
      "A ficha passa para uma segunda página. Para caber numa só, encurte o texto, escolha um tamanho de texto mais pequeno ou retire linhas.",
  },
  settings: {
    title: "Definições de leitura",
    open: "Abrir as definições de leitura",
    close: "Fechar",
    note: "Aplicam-se à demonstração, às fichas e ao conversor, e ficam guardadas apenas neste navegador.",
    presets: "As minhas definições guardadas",
    empty:
      "Ainda não guardou nenhumas definições. Dê um nome às atuais para voltar a elas com um clique.",
    name: "Nome",
    placeholder: "Por exemplo: Leitura na aula",
    save: "Guardar",
    apply: "Usar as definições «{name}»",
    remove: "Eliminar «{name}»",
    saved: "Definições «{name}» guardadas.",
    removed: "«{name}» foi eliminado.",
    applied: "Agora está a usar «{name}».",
    reset: "Voltar às definições predefinidas",
    restored: "Definições predefinidas repostas.",
  },
  convert: {
    title: "Converter um livro",
    intro:
      "Escolha um livro ou um documento e descarregue uma cópia com destaque. O ficheiro nunca sai do seu dispositivo: tudo acontece neste navegador, sem limite de tamanho.",
    pick: "Escolher um ficheiro",
    drop: "ou largue-o aqui",
    formats: "EPUB, TXT, Markdown ou HTML",
    selected: "Ficheiro escolhido:",
    output: "Formato de saída",
    outputs: { epub: "EPUB (livro digital)", html: "HTML (página web)", md: "Markdown" },
    options: "Como destacar",
    start: "Converter",
    progress: "A converter: {n} %",
    cancel: "Cancelar",
    cancelled: "Conversão cancelada. Não foi guardado nada.",
    done: "Pronto. O seu ficheiro está preparado.",
    download: "Descarregar {name}",
    errors: {
      unsupported:
        "Este formato não pode ser convertido. Escolha um ficheiro EPUB, TXT, Markdown ou HTML.",
      drm: "Este livro tem DRM (proteção contra cópia), por isso não pode ser convertido. Se o comprou, pergunte à loja se lhe pode dar uma cópia sem DRM.",
      invalid:
        "Não foi possível ler este ficheiro. Confirme que abre no seu leitor ou experimente outro.",
      failed: "A conversão falhou ({detail}). Se voltar a acontecer, diga-nos no GitHub.",
    },
    labels: { part: "Parte", contents: "Índice" },
    steps: {
      choose: "Escolha o seu livro",
      adjust: "Ajuste o aspeto",
      convert: "Converta e descarregue",
    },
    previewTitle: "Como vai começar o seu livro",
    previewEmpty: "Escolha um ficheiro e a primeira página aparece aqui, com destaque.",
    previewLoading: "A preparar a pré-visualização…",
    previewNote:
      "Vista aproximada: cada leitor mostra o livro com o seu próprio tipo e tamanho de letra.",
    previewNone: "Não foi encontrado texto no início do ficheiro, mas pode convertê-lo na mesma.",
    change: "Escolher outro ficheiro",
    devices: {
      heading: "Como passá-lo para o seu leitor",
      items: [
        {
          name: "Kindle",
          text: "Use o Send to Kindle da Amazon (site, aplicação ou e-mail) e escolha o ficheiro EPUB. A Amazon adapta-o para o seu Kindle.",
        },
        {
          name: "Kobo",
          text: "Ligue o Kobo ao computador com o cabo USB e copie o EPUB para lá. Ejete-o e o livro aparece na sua biblioteca.",
        },
        {
          name: "PocketBook",
          text: "Copie-o por USB, como num Kobo, ou envie-o por e-mail com o serviço Send-to-PocketBook.",
        },
      ],
      calibre:
        "Se usa o Calibre, adicione o ficheiro à sua biblioteca e envie-o para o leitor como qualquer outro livro.",
    },
  },
  pages: {
    privacy: {
      title: "Privacidade",
      body: [
        "Não recolhemos dados. Nenhuns.",
        "A extensão, este site e o conversor funcionam inteiramente no seu dispositivo. O que lê e os ficheiros que converte nunca são enviados para lado nenhum: não temos servidores.",
        "Não usamos estatísticas, cookies, telemetria, nem tipos de letra ou scripts de outros sites.",
        "A extensão guarda as suas definições (intensidade, estilo, sites onde a quer sempre ativa) no armazenamento do seu próprio navegador. Se a sincronização do navegador estiver ativa, o navegador pode copiá-las entre os seus dispositivos; nós nunca as vemos.",
        "A extensão pede apenas as permissões de que precisa. O acesso a um site concreto, ou a todos os sites, só é pedido quando escolhe «Sempre neste site» ou «Em todos os sites», e pode retirá-lo a qualquer momento.",
      ],
    },
    accessibility: {
      title: "Acessibilidade",
      body: [
        "O destaque nunca altera o que um leitor de ecrã lê: o texto é exatamente o mesmo, caráter a caráter. Verificamos isto com testes automáticos, e com o NVDA e o VoiceOver antes de cada versão.",
        "Tudo funciona só com o teclado. A extensão liga-se e desliga-se com Alt+B, e pode mudar o atalho nas definições do navegador.",
        "As cores do destaque derivam da cor do próprio texto, por isso o contraste mantém-se no modo claro, no modo escuro e no tema de cada site.",
        "Este site usa o tipo de letra Atkinson Hyperlegible, criado para distinguir bem as letras, e respeita as preferências do seu sistema para o modo escuro e a redução de movimento.",
        "Se encontrar uma barreira, abra uma issue no GitHub: é um erro, e vamos tratá-lo como tal.",
      ],
    },
  },
};
