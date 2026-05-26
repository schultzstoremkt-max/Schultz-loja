import { Product } from '../types';

export const PRODUCTS: Product[] = [
  // CATEGORIA 1: Camas e Colchões (beds_mattresses)
  {
    id: 'cama-eletrica-articulada-schultz-prime',
    name: 'Cama Articulada Elétrica Schultz Prime',
    description: 'Cama motorizada com controle sem fio, elevação de cabeceira e pés para alívio circulatório e postural.',
    fullDescription: 'A Cama Articulada Elétrica Schultz Prime oferece o ápice do conforto ortopédico e terapêutico. Projetada para quem busca melhorar a circulação, aliviar dores nas costas ou simplesmente desfrutar de conforto personalizado para leitura e descanso. Conta com motorização silenciosa operada via controle remoto sem fio, permitindo o ajuste preciso de cabeça e pernas de forma independente.',
    price: 3890.00,
    oldPrice: 4290.00,
    category: 'beds_mattresses',
    image: '/src/assets/images/cama_articulada_1779747741598.png',
    advantages: [
      'Controle sem fio intuitivo',
      'Estrutura em aço carbono reforçado',
      'Articulação em 3 pontos independentes',
      'Alívio para refluxo e apneia',
      'Favorece o retorno venoso (pernas cansadas)'
    ],
    sizes: ['Solteiro (88x188 cm)', 'Casal (138x188 cm)', 'Queen (158x198 cm)'],
    sku: 'BED-SCH-EL-01',
    inStock: true
  },
  {
    id: 'colchao-ortopedico-schultz-d45',
    name: 'Colchão Ortopédico Densidade D45 Schultz',
    description: 'Colchão anatômico com espuma selada D45 extra-confortável e camada de Viscoelástico NASA para suporte inteligente.',
    fullDescription: 'Projetado para oferecer alinhamento perfeito para a coluna vertebral, o Colchão Ortopédico Schultz D45 combina o suporte de alta firmeza da densidade 45 com o acolhimento do viscoelástico (tecnologia NASA). Este colchão distribui o peso corporal uniformemente, reduzindo os pontos de pressão nos ombros e quadris e minimizando movimentos noturnos.',
    price: 2490.00,
    oldPrice: 2890.00,
    category: 'beds_mattresses',
    image: '/src/assets/images/colchao_ortopedico_1779747759796.png',
    advantages: [
      'Espuma certificada pró-saúde D45',
      'Camada Comfort-NASA de 4cm',
      'Tratamento antiácaro, antimofo e antialérgico',
      'Suporta até 150kg por pessoa',
      'Garantia estrutural de 5 anos'
    ],
    sizes: ['Solteiro (88x188 cm)', 'Casal (138x188 cm)', 'Queen (158x198 cm)', 'King (193x203 cm)'],
    densities: ['D45 Firme Ortopédico', 'D33 Macio Adaptativo'],
    sku: 'MAT-SCH-D45-02',
    inStock: true
  },
  {
    id: 'colchao-ortopedico-bio-magne',
    name: 'Colchão Ortopédico Bio-Magne Magnético',
    description: 'Tecnologia de pastilhas magnéticas e infravermelho longo que estimula a circulação e relaxamento muscular.',
    fullDescription: 'O Colchão Bio-Magne traz o que há de mais moderno em terapias integradas para o sono. Equipado com pastilhas de magnetos e infravermelho longo acopladas no perfilado terapêutico, ele simula os benefícios da caminhada descalço na terra e do sol matinal. Alivia tensões musculares agudas e auxilia na regeneração corporal durante a noite.',
    price: 3150.00,
    category: 'beds_mattresses',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600&auto=format&fit=crop',
    advantages: [
      'Magnetoterapia ativa',
      'Infravermelho longo de última geração',
      'Massagem vibratória eletrônica integrada',
      'Tecnologia Rabatan aerada e fresca',
      'Alinhamento postural ortopédico'
    ],
    sizes: ['Casal (138x188 cm)', 'Queen (158x198 cm)', 'King (193x203 cm)'],
    sku: 'MAT-SCH-MAG-03',
    inStock: true
  },

  // CATEGORIA 2: Travesseiros e Almofadas (pillows_cushions)
  {
    id: 'travesseiro-cervical-nasa-schultz',
    name: 'Travesseiro Cervical Anatômico NASA Schultz',
    description: 'Formato ergonômico com côncavos de suporte para pescoço em espuma termossensível premium.',
    fullDescription: 'Desenvolvido por especialistas em ortopedia, o Travesseiro Cervical Schultz NASA possui um perfil anatômico inovador que desenha o contorno exato do pescoço e da cabeça. Feito inteiramente de espuma viscoelástica termossensível de retorno lento, ele impede a contratura muscular do pescoço e alivia dores na cervical e torcicolo ao acordar.',
    price: 189.00,
    oldPrice: 229.00,
    category: 'pillows_cushions',
    image: '/src/assets/images/travesseiro_cervical_1779747775345.png',
    advantages: [
      'Design ondulado ergonômico de 2 alturas',
      'Espuma Viscoelástica NASA Premium',
      'Capa removível e lavável em fibra de algodão',
      'Previne ronco por melhor abertura de vias aéreas',
      'Células abertas para circulação de ar'
    ],
    sku: 'PIL-SCH-NASA-04',
    inStock: true
  },
  {
    id: 'travesseiro-triangular-anti-refluxo',
    name: 'Almofada de Cunha Triangular Anti-Refluxo',
    description: 'Cunha ortopédica para inclinação do tronco, prevenindo refluxo gastroesofágico e facilitando a leitura.',
    fullDescription: 'Esta cunha de suporte triangular fornece uma inclinação suave e estável garantindo que o esôfago fique acima do nível gastro, eliminando o desconforto decorrente de refluxo, azia e tosse noturna. Também pode ser usada abaixo das pernas para drenagem linfática e melhora de varizes.',
    price: 145.00,
    category: 'pillows_cushions',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=600&auto=format&fit=crop',
    advantages: [
      'Espuma de alta resiliência anti-deformação',
      'Inclinação ideal cientificamente testada',
      'Capa em microfibra macia com zíper',
      'Uso multifuncional (tronco ou pernas)',
      'Fácil transporte e super leve'
    ],
    sku: 'PIL-SCH-CUN-05',
    inStock: true
  },
  {
    id: 'almofada-ergonomica-gel-coccyx',
    name: 'Almofada de Assento Ergonômica Gel-Coccyx',
    description: 'Protetor de cóccix com abertura traseira anatômica e gel de resfriamento para cadeiras de escritório e carro.',
    fullDescription: 'Alivie a pressão no osso cóccix e melhore sua postura instantaneamente. Esta almofada ergonômica distribui o peso da bacia de forma equilibrada, protegendo a região lombo-sacra e evitando as dores ciáticas provocadas por longas horas sentado no trabalho, home-office ou dirigindo.',
    price: 169.00,
    category: 'pillows_cushions',
    image: 'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?q=80&w=600&auto=format&fit=crop',
    advantages: [
      'Recorte estratégico em U para cóccix livre',
      'Camada superior de gel refrescante',
      'Base inferior antiderrapante de alta aderência',
      'Espuma de memória de alta densidade',
      'Alça de transporte integrada'
    ],
    sku: 'PIL-SCH-GEL-06',
    inStock: true
  },

  // CATEGORIA 3: Calçados e Tênis (footwear_shoes)
  {
    id: 'tenis-ortopedico-schultz-flex-air',
    name: 'Tênis Ortopédico Schultz Flex-Air',
    description: 'Tênis ultra leve com sola com amortecimento ativo e palmilha anatômica inteligente anti-impacto.',
    fullDescription: 'O Tênis Ortopédico Schultz Flex-Air une estilo moderno e benefícios clínicos incomparáveis. Desenvolvido para caminhar sem dor, ele possui amortecimento pneumático que reduz em até 85% o impacto nas articulações (joelhos, tornozelos e quadril). Sua palmilha interna conta com arco moldado para pés planos, cavos e neutros.',
    price: 349.00,
    oldPrice: 399.00,
    category: 'footwear_shoes',
    image: '/src/assets/images/tenis_ortopedico_1779747792624.png',
    advantages: [
      'Amortecimento ativo de alto impacto',
      'Malha mesh respirável com ajuste elástico',
      'Palmilha removível com suporte de arco plantar',
      'Ideal para fascite plantar e esporão de calcâneo',
      'Solado em borracha antiderrapante'
    ],
    sizes: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44'],
    colors: ['Cinza e Azul', 'Cinza e Verde', 'Preto Clássico'],
    sku: 'SHO-SCH-FLEX-07',
    inStock: true
  },
  {
    id: 'sandalia-anatomica-confort',
    name: 'Sandália Anatômica Schultz Confort',
    description: 'Sandália ortopédica ereta com apoio metatarso exclusivo e tiras reguláveis macias.',
    fullDescription: 'A sandália Schultz Confort é campeã em aceitação devido ao seu descanso articular no caminhar diário. Produzida em poliuretano expandido extremamente macio, absorve as microvibrações do solo e reduz as dores causadas pela esporose e neuroma de Morton. Ideal para o uso domiciliar ou passeios casuais sob o sol.',
    price: 159.00,
    category: 'footwear_shoes',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop',
    advantages: [
      'Absorção de impacto de nível militar',
      'Tiras com ajuste autocolante rápido',
      'Ultra leve (menos de 180g por pé)',
      'Suporte para fascite de face plantar lisa',
      'Impermeável e higienizável'
    ],
    sizes: ['34', '35', '36', '37', '38', '39', '40'],
    colors: ['Bege Natural', 'Preto Nobre', 'Verde Oliva'],
    sku: 'SHO-SCH-SAND-08',
    inStock: true
  },
  {
    id: 'palmilha-gel-active-cushion',
    name: 'Palmilha Ortopédica Gel Ultra-Cushion',
    description: 'Palmilha com colmeia de amortecimento em gel nos calcanhares e suporte rígido termoplástico para o arco.',
    fullDescription: 'Transforme qualquer calçado comum em um calçado ortopédico protetor. As palmilhas Schultz Gel Ultra-Cushion possuem uma inovadora tecnologia de colmeia de gel no calcanhar que dissipa a pressão do impacto da pisada e uma concha rígida de nylon que estabiliza o calcanhar contra desvios pronados e supinados.',
    price: 79.90,
    category: 'footwear_shoes',
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=600&auto=format&fit=crop',
    advantages: [
      'Gel de absorção de impacto polimérico',
      'Suporte anatômico firme do arco longitudinal',
      'Linhas de recorte para ajuste de tamanho preciso',
      'Tecido Dry-Fit respirável com controle de odores',
      'Ideal para rotinas de quem passa horas em pé'
    ],
    sizes: ['35-40 (Recortável)', '41-44 (Recortável)'],
    sku: 'SHO-SCH-PAL-09',
    inStock: true
  },

  // CATEGORIA 4: Roupas e Órteses (clothing_accessories)
  {
    id: 'corretor-postural-neoprene',
    name: 'Corretor Postural Ajustável Schultz Neoprene',
    description: 'Corretor magnético ajustável com hastes de suporte reforçado para alinhamento dos ombros e coluna.',
    fullDescription: 'Projetado para treinar sua memória muscular, o Corretor Postural Schultz puxa suavemente seus ombros para trás, alinhando a coluna vertebral de maneira biomecanicamente correta. Fabricado em neoprene respirável ultra-resistente, é discreto e confortável o suficiente para ser utilizado sob as roupas no escritório ou durante exercícios.',
    price: 119.00,
    oldPrice: 149.00,
    category: 'clothing_accessories',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600&auto=format&fit=crop',
    advantages: [
      'Alças de alta tração com reforço acolchoado',
      'Hastes de aço flexíveis integradas para proteção lombar',
      'Neoprene respirável que evita suor excessivo',
      'Totalmente ajustável com velcro premium',
      'Resultados visíveis em poucas semanas de uso'
    ],
    sizes: ['P', 'M', 'G', 'GG'],
    sku: 'ACC-SCH-POS-10',
    inStock: true
  },
  {
    id: 'meia-compressao-medicago',
    name: 'Meias de Compressão Graduada 20-30 mmHg',
    description: 'Par de meias elásticas de compressão graduada para combate a varizes, inchaço laboral e fadiga.',
    fullDescription: 'As meias de compressão graduada Schultz agem exercendo pressão decrescente do tornozelo em direção à coxa. Essa ação mecânica acelera a velocidade da corrente sanguínea de retorno, estimulando as válvulas venosas e prevenindo edemas (inchaços), trombose venosa profunda (TVP) e fadiga muscular em viagens ou longas rotinas.',
    price: 89.00,
    category: 'clothing_accessories',
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=600&auto=format&fit=crop',
    advantages: [
      'Compressão médica certificada de 20-30 mmHg',
      'Calcanhar e ponteiras reforçados para durabilidade',
      'Textura ultra elástica hipoalergênica',
      'Tecido respirável e sedoso na pele',
      'Unissex e anatômica'
    ],
    sizes: ['M (Panturrilha de 33-38cm)', 'G (Panturrilha de 38-44cm)', 'GG (Panturrilha de 44-50cm)'],
    colors: ['Bege Médico', 'Preto Esportivo'],
    sku: 'ACC-SCH-MEI-11',
    inStock: true
  },
  {
    id: 'joelheira-premium-estabilizadora',
    name: 'Joelheira Premium com Hastes Laterais Flexíveis',
    description: 'Órtese elástica com orifício rotular de silicone e molas bilaterais para suporte total da patela e ligamentos.',
    fullDescription: 'Desenvolvida para conferir máxima segurança e estabilidade, a Joelheira Schultz Premium conta com duas hastes em mola de aço flexível nas laterais para garantir que o joelho faça apenas a flexão/extensão correta do ligamento. Possui anel amortecedor de silicone premium que massageia e fixa a patela na posição ortopédica ideal.',
    price: 129.00,
    category: 'clothing_accessories',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600&auto=format&fit=crop', // Multi-use sport health placeholder
    advantages: [
      'Hastes de mola bilaterais para estabilidade ligamental',
      'Anel de silicone frontal para centralização rotular',
      'Dispositivo em malha tricotada térmica 3D',
      'Tiras de velcro bilaterais para fixação customizável',
      'Ideal para prevenção de entorses e pós-operatório'
    ],
    sizes: ['M', 'G', 'GG'],
    sku: 'ACC-SCH-JOE-12',
    inStock: true
  }
];
