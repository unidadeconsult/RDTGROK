// ============================================================
// RDT Central de Criacao - Demo Data
// demo: true
// ============================================================

import type {
  Pauta,
  PautaAttributes,
  PautaStatus,
  VidaUtil,
  Semaforo,
  Ideia,
  Angulo,
  ConteudoDerivado,
  VozEditorial,
  RadarItem,
  NavItem,
} from './types';

// --- Helpers ---

function computeOverall(attrs: PautaAttributes): number {
  const sum =
    attrs.atualidade +
    attrs.debate +
    attrs.originalidade +
    attrs.emocao +
    attrs.versatilidade +
    attrs.vidaUtil +
    attrs.potencialVisual +
    attrs.profundidade;
  return Math.round(sum / 8);
}

export function getOverallLabel(score: number): string {
  if (score >= 95) return 'BOLA DE OURO';
  if (score >= 88) return 'PAUTA TITULAR';
  if (score >= 78) return 'OTIMA OPCAO';
  if (score >= 68) return 'BOA PAUTA';
  if (score >= 55) return 'BANCO';
  if (score >= 40) return 'BASE';
  return 'OBSERVACAO';
}

export function getOverallColor(score: number): string {
  if (score >= 95) return '#FFD700';
  if (score >= 88) return '#22C55E';
  if (score >= 78) return '#3B82F6';
  if (score >= 68) return '#8B5CF6';
  if (score >= 55) return '#F59E0B';
  if (score >= 40) return '#F97316';
  return '#EF4444';
}

// --- Angulos (70+) ---

const angulos: Angulo[] = [
  // Pauta 1 angulos (p1)
  { id: 'ang-001', pautaId: 'p1', tipo: 'jornalistico', titulo: 'Bastidores da negociacao com o City', resumo: 'Detalhes exclusivos de como o Palmeiras articulou a venda bilionaria ao Manchester City', porqueFunciona: 'Bastidores sempre geram curiosidade e engajamento', formatos: ['materia', 'thread'], plataformas: ['site', 'x'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-002', pautaId: 'p1', tipo: 'analitico', titulo: 'Impacto tatico no Palmeiras sem Estevao', resumo: 'Analise de como Abel Ferreira vai recompor o ataque sem a joia', porqueFunciona: 'Torcedor quer saber como o time vai jogar', formatos: ['video', 'carrossel'], plataformas: ['youtube', 'instagram'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-003', pautaId: 'p1', tipo: 'comparacao', titulo: 'Estevao vs Neymar aos 18 anos', resumo: 'Comparacao estatistica entre as duas joias brasileiras na mesma idade', porqueFunciona: 'Comparacoes com Neymar sempre viralizam', formatos: ['carrossel', 'post'], plataformas: ['instagram', 'x'], favorito: false, aprovado: true, descartado: false },
  // Pauta 2 angulos (p2)
  { id: 'ang-004', pautaId: 'p2', tipo: 'tatico', titulo: 'O esquema tatico ideal para o Fla com Gabigol de volta', resumo: 'Analise tatica de como Gabigol pode ser encaixado no time titular', porqueFunciona: 'Discussao tatica com idolo gera debate intenso', formatos: ['video', 'carrossel'], plataformas: ['youtube', 'instagram'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-005', pautaId: 'p2', tipo: 'emocional', titulo: 'O reencontro: Gabigol e a Nacaoo', resumo: 'A relacao emocional entre Gabigol e a torcida do Flamengo ao longo dos anos', porqueFunciona: 'Historia de amor entre jogador e torcida emociona', formatos: ['video', 'materia'], plataformas: ['youtube', 'site'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-006', pautaId: 'p2', tipo: 'provocador', titulo: 'Gabigol ainda tem nivel para ser titular?', resumo: 'Provocacao sobre a condicao fisica e tecnica atual do atacante', porqueFunciona: 'Pergunta polemica gera engajamento massivo', formatos: ['enquete', 'post'], plataformas: ['x', 'instagram'], favorito: false, aprovado: true, descartado: false },
  // Pauta 3 angulos (p3)
  { id: 'ang-007', pautaId: 'p3', tipo: 'historico', titulo: 'As maiores viradas da historia da Libertadores', resumo: 'Linha do tempo com as viradas mais epicas do torneio continental', porqueFunciona: 'Contexto historico enriquece cobertura', formatos: ['carrossel', 'thread'], plataformas: ['instagram', 'x'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-008', pautaId: 'p3', tipo: 'dados', titulo: 'Libertadores em numeros: semifinais 2026', resumo: 'Estatisticas detalhadas dos semifinalistas com graficos comparativos', porqueFunciona: 'Dados sustentam narrativas e geram compartilhamento', formatos: ['infografico', 'carrossel'], plataformas: ['instagram', 'site'], favorito: false, aprovado: true, descartado: false },
  // Pauta 4 angulos (p4)
  { id: 'ang-009', pautaId: 'p4', tipo: 'personagem', titulo: 'Quem e Bremer: do interior do RS ao topo da Europa', resumo: 'Perfil completo do zagueiro que voltou ao Brasil para liderar o Corinthians', porqueFunciona: 'Historia de vida conecta com o torcedor', formatos: ['materia', 'video'], plataformas: ['site', 'youtube'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-010', pautaId: 'p4', tipo: 'tatico', titulo: 'O que Bremer agrega defensivamente ao Corinthians', resumo: 'Analise de posicionamento, duelos aereos e saida de bola do zagueiro', porqueFunciona: 'Conteudo tatico qualifica a discussao', formatos: ['video', 'carrossel'], plataformas: ['youtube', 'instagram'], favorito: false, aprovado: true, descartado: false },
  // Pauta 5 angulos (p5)
  { id: 'ang-011', pautaId: 'p5', tipo: 'analitico', titulo: 'O Brasileirao mais equilibrado da historia?', resumo: 'Analise estatistica mostrando a proximidade recorde entre os times', porqueFunciona: 'Narrativa de campeonato aberto engaja todas as torcidas', formatos: ['materia', 'infografico'], plataformas: ['site', 'instagram'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-012', pautaId: 'p5', tipo: 'humor', titulo: 'Memes da rodada: ninguem quer ser lider', resumo: 'Compilado humoristico sobre a instabilidade do campeonato', porqueFunciona: 'Humor viraliza e humaniza a cobertura', formatos: ['carrossel', 'reels'], plataformas: ['instagram', 'x'], favorito: false, aprovado: true, descartado: false },
  // Pauta 6 angulos (p6)
  { id: 'ang-013', pautaId: 'p6', tipo: 'jornalistico', titulo: 'Os bastidores da demissao no Sao Paulo', resumo: 'Apuracao sobre os motivos reais da saida do treinador', porqueFunciona: 'Bastidores de crise institucional geram cliques', formatos: ['materia', 'thread'], plataformas: ['site', 'x'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-014', pautaId: 'p6', tipo: 'pergunta', titulo: 'Quem deve ser o proximo tecnico do Sao Paulo?', resumo: 'Enquete e analise dos nomes cotados para assumir o Tricolor', porqueFunciona: 'Participacao do torcedor na decisao engaja', formatos: ['enquete', 'post'], plataformas: ['x', 'instagram'], favorito: false, aprovado: true, descartado: false },
  // Pauta 7 angulos (p7)
  { id: 'ang-015', pautaId: 'p7', tipo: 'storytelling', titulo: 'Santos: da Serie B ao sonho da Libertadores', resumo: 'Narrativa da reconstrucao do Santos desde o rebaixamento', porqueFunciona: 'Historias de superacao cativam qualquer publico', formatos: ['video', 'materia'], plataformas: ['youtube', 'site'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-016', pautaId: 'p7', tipo: 'torcedor', titulo: 'A voz da arquibancada: santistas contam a travessia', resumo: 'Depoimentos de torcedores que nao abandonaram o time na Serie B', porqueFunciona: 'Conteudo gerado pela torcida cria identificacao', formatos: ['reels', 'carrossel'], plataformas: ['instagram', 'tiktok'], favorito: false, aprovado: true, descartado: false },
  // Pauta 8 angulos (p8)
  { id: 'ang-017', pautaId: 'p8', tipo: 'analitico', titulo: 'Vinicius Jr e a evolucao que o tornou o melhor do mundo', resumo: 'Analise da evolucao tecnica e tatica de Vini Jr desde 2018', porqueFunciona: 'Brasileiro melhor do mundo e pauta obrigatoria', formatos: ['video', 'materia'], plataformas: ['youtube', 'site'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-018', pautaId: 'p8', tipo: 'curiosidade', titulo: '10 coisas que voce nao sabia sobre Vinicius Jr', resumo: 'Curiosidades sobre a vida e carreira do craque', porqueFunciona: 'Listicles com curiosidades tem alta taxa de clique', formatos: ['carrossel', 'thread'], plataformas: ['instagram', 'x'], favorito: false, aprovado: true, descartado: false },
  // Pauta 9 angulos (p9)
  { id: 'ang-019', pautaId: 'p9', tipo: 'contraponto', titulo: 'VAR: solucao ou problema para o futebol brasileiro?', resumo: 'Argumentos dos dois lados sobre a eficacia do VAR no Brasil', porqueFunciona: 'Debate polarizado com opinioes fortes', formatos: ['video', 'enquete'], plataformas: ['youtube', 'x'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-020', pautaId: 'p9', tipo: 'dados', titulo: 'VAR em numeros: erros corrigidos vs polemicas criadas', resumo: 'Levantamento estatistico completo sobre intervencoes do VAR em 2026', porqueFunciona: 'Dados objetivos em tema polemico ganham autoridade', formatos: ['infografico', 'materia'], plataformas: ['instagram', 'site'], favorito: false, aprovado: true, descartado: false },
  // Pauta 10 angulos (p10)
  { id: 'ang-021', pautaId: 'p10', tipo: 'provocador', titulo: 'Botafogo e o novo grande do Rio?', resumo: 'Analise sobre a ascensao do Botafogo e o declinio de rivais cariocas', porqueFunciona: 'Provocacao entre rivais e combustivel de engajamento', formatos: ['post', 'video'], plataformas: ['x', 'youtube'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-022', pautaId: 'p10', tipo: 'tatico', titulo: 'O modelo de jogo que fez o Botafogo campeao', resumo: 'Desmontagem tatica do sistema de jogo do Glorioso', porqueFunciona: 'Conteudo tatico aprofundado fideliza audiencia', formatos: ['video', 'carrossel'], plataformas: ['youtube', 'instagram'], favorito: false, aprovado: true, descartado: false },
  // Pauta 11 angulos (p11)
  { id: 'ang-023', pautaId: 'p11', tipo: 'emocional', titulo: 'Vasco e o peso da camisa mais pesada do Brasil', resumo: 'Reflexao sobre a responsabilidade historica do Vasco e seus desafios atuais', porqueFunciona: 'Narrativa emocional conecta com torcida gigante', formatos: ['video', 'materia'], plataformas: ['youtube', 'site'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-024', pautaId: 'p11', tipo: 'historico', titulo: 'O Vasco que mudou o futebol: 1923 e a luta contra o racismo', resumo: 'Resgate historico do papel pioneiro do Vasco no futebol brasileiro', porqueFunciona: 'Historia transformadora tem apelo universal', formatos: ['materia', 'carrossel'], plataformas: ['site', 'instagram'], favorito: true, aprovado: true, descartado: false },
  // Pauta 12 angulos (p12)
  { id: 'ang-025', pautaId: 'p12', tipo: 'jornalistico', titulo: 'Mercado da bola: os clubes que mais investiram em 2026', resumo: 'Ranking completo de investimentos dos clubes brasileiros na janela', porqueFunciona: 'Ranking e dinheiro geram debate acalorado', formatos: ['materia', 'infografico'], plataformas: ['site', 'instagram'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-026', pautaId: 'p12', tipo: 'comparacao', titulo: 'Brasil vs Europa: quem gasta melhor no mercado?', resumo: 'Comparacao de eficiencia nas contratacoes entre ligas', porqueFunciona: 'Comparacao internacional amplia o debate', formatos: ['carrossel', 'thread'], plataformas: ['instagram', 'x'], favorito: false, aprovado: true, descartado: false },
  // Pauta 13 angulos (p13)
  { id: 'ang-027', pautaId: 'p13', tipo: 'tatico', titulo: 'A revolucao tatica de Dorival na Selecao', resumo: 'Como Dorival implementou um novo estilo de jogo na Selecao', porqueFunciona: 'Selecao sempre interessa e analise tatica qualifica', formatos: ['video', 'materia'], plataformas: ['youtube', 'site'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-028', pautaId: 'p13', tipo: 'comparacao', titulo: 'Selecao 2002 vs Selecao 2026: quem vence?', resumo: 'Comparacao posicao por posicao entre as duas geracoes', porqueFunciona: 'Nostalgia combinada com atualidade e formula vencedora', formatos: ['carrossel', 'enquete'], plataformas: ['instagram', 'x'], favorito: true, aprovado: true, descartado: false },
  // Pauta 14 angulos (p14)
  { id: 'ang-029', pautaId: 'p14', tipo: 'personagem', titulo: 'De Horizonte a Europa: a historia de Endrick', resumo: 'Perfil completo da trajetoria do atacante desde as categorias de base', porqueFunciona: 'Historia de joia brasileira sempre interessa', formatos: ['materia', 'video'], plataformas: ['site', 'youtube'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-030', pautaId: 'p14', tipo: 'dados', titulo: 'Os numeros de Endrick no Real Madrid', resumo: 'Analise estatistica detalhada da temporada do brasileiro', porqueFunciona: 'Numeros sustentam narrativas e geram debate', formatos: ['infografico', 'carrossel'], plataformas: ['instagram', 'x'], favorito: false, aprovado: true, descartado: false },
  // Pauta 15 angulos (p15)
  { id: 'ang-031', pautaId: 'p15', tipo: 'analitico', titulo: 'Gremio e a crise financeira que ameaca o futebol', resumo: 'Raio-x das financas do Gremio e o impacto no desempenho esportivo', porqueFunciona: 'Tema financeiro e essencial mas pouco explorado', formatos: ['materia', 'infografico'], plataformas: ['site', 'instagram'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-032', pautaId: 'p15', tipo: 'torcedor', titulo: 'Gremistas entre a paixao e a frustracao', resumo: 'Panorama do sentimento da torcida gremista com a gestao atual', porqueFunciona: 'Voz do torcedor humaniza reportagens financeiras', formatos: ['reels', 'enquete'], plataformas: ['instagram', 'x'], favorito: false, aprovado: true, descartado: false },
  // Pauta 16 angulos (p16)
  { id: 'ang-033', pautaId: 'p16', tipo: 'storytelling', titulo: 'O renascimento do Cruzeiro: SAF e nova era', resumo: 'Narrativa da transformacao do Cruzeiro desde a chegada da SAF', porqueFunciona: 'Historia de reconstrucao inspira e engaja', formatos: ['video', 'materia'], plataformas: ['youtube', 'site'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-034', pautaId: 'p16', tipo: 'comparacao', titulo: 'SAFs brasileiras: quem esta dando certo?', resumo: 'Comparativo entre os modelos de SAF de Botafogo, Cruzeiro, Bahia e Vasco', porqueFunciona: 'Tema atual com impacto em varios clubes', formatos: ['materia', 'carrossel'], plataformas: ['site', 'instagram'], favorito: false, aprovado: true, descartado: false },
  // Pauta 17 angulos (p17)
  { id: 'ang-035', pautaId: 'p17', tipo: 'curiosidade', titulo: 'Os estadios mais bonitos do Brasil para 2026', resumo: 'Tour pelos estadios reformados e novos para a temporada', porqueFunciona: 'Conteudo visual forte e nostalgico', formatos: ['carrossel', 'video'], plataformas: ['instagram', 'youtube'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-036', pautaId: 'p17', tipo: 'historico', titulo: 'Do Maracana a Arena MRV: a evolucao dos estadios brasileiros', resumo: 'Linha do tempo da arquitetura esportiva no Brasil', porqueFunciona: 'Historia visual com forte apelo nostalgico', formatos: ['carrossel', 'materia'], plataformas: ['instagram', 'site'], favorito: false, aprovado: true, descartado: false },
  // Pauta 18 angulos (p18)
  { id: 'ang-037', pautaId: 'p18', tipo: 'provocador', titulo: 'O Fluminense so funciona na Libertadores?', resumo: 'Analise das discrepancias de desempenho entre competicoes', porqueFunciona: 'Provocacao fundamentada gera debate de qualidade', formatos: ['post', 'video'], plataformas: ['x', 'youtube'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-038', pautaId: 'p18', tipo: 'tatico', titulo: 'O Dinizismo sobrevive sem Diniz?', resumo: 'Analise da heranca tatica do ex-treinador no Fluminense', porqueFunciona: 'Debate tatico com nome polemico gera cliques', formatos: ['video', 'thread'], plataformas: ['youtube', 'x'], favorito: false, aprovado: true, descartado: false },
  // Pauta 19 angulos (p19)
  { id: 'ang-039', pautaId: 'p19', tipo: 'emocional', titulo: 'A despedida de um idolo: homenagem merecida', resumo: 'Tributo emocional a carreira de um grande jogador que se aposenta', porqueFunciona: 'Despedidas emocionam e engajam torcida', formatos: ['video', 'materia'], plataformas: ['youtube', 'site'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-040', pautaId: 'p19', tipo: 'dados', titulo: 'Numeros de uma carreira historica', resumo: 'Todos os gols, assistencias, titulos e recordes em numeros', porqueFunciona: 'Dados em contexto emocional amplificam impacto', formatos: ['infografico', 'carrossel'], plataformas: ['instagram', 'x'], favorito: false, aprovado: true, descartado: false },
  // Pauta 20 angulos (p20)
  { id: 'ang-041', pautaId: 'p20', tipo: 'jornalistico', titulo: 'Bahia e o projeto de se tornar potencia nacional', resumo: 'Bastidores do planejamento estrategico do Bahia para os proximos anos', porqueFunciona: 'Projeto ambicioso de clube nordestino gera curiosidade', formatos: ['materia', 'video'], plataformas: ['site', 'youtube'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-042', pautaId: 'p20', tipo: 'contraponto', titulo: 'Dinheiro resolve tudo? O caso Bahia', resumo: 'Debate sobre os limites do investimento financeiro no futebol', porqueFunciona: 'Contraponto ao otimismo gera reflexao e debate', formatos: ['post', 'materia'], plataformas: ['x', 'site'], favorito: false, aprovado: true, descartado: false },
  // Pauta 21 angulos (p21)
  { id: 'ang-043', pautaId: 'p21', tipo: 'analitico', titulo: 'Inter e a melhor defesa do Brasileirao', resumo: 'Analise detalhada do sistema defensivo colorado', porqueFunciona: 'Destaque positivo de time grande atrai audiencia', formatos: ['video', 'materia'], plataformas: ['youtube', 'site'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-044', pautaId: 'p21', tipo: 'humor', titulo: 'Ninguem passa: os melhores memes da muralha colorada', resumo: 'Compilado humoristico sobre a solidez defensiva do Inter', porqueFunciona: 'Humor celebratorio engaja torcida', formatos: ['carrossel', 'reels'], plataformas: ['instagram', 'tiktok'], favorito: false, aprovado: true, descartado: false },
  // Pauta 22 angulos (p22)
  { id: 'ang-045', pautaId: 'p22', tipo: 'pergunta', titulo: 'A Premier League perdeu graca ou o futebol evoluiu?', resumo: 'Reflexao sobre a dominancia do City e o futuro do campeonato ingles', porqueFunciona: 'Debate sobre liga mais assistida do mundo no Brasil', formatos: ['video', 'thread'], plataformas: ['youtube', 'x'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-046', pautaId: 'p22', tipo: 'comparacao', titulo: 'Premier League vs Brasileirao: onde o futebol e melhor?', resumo: 'Comparacao provocativa entre as duas ligas', porqueFunciona: 'Brasil vs exterior sempre polariza', formatos: ['enquete', 'carrossel'], plataformas: ['x', 'instagram'], favorito: false, aprovado: false, descartado: false },
  // Pauta 23 angulos (p23)
  { id: 'ang-047', pautaId: 'p23', tipo: 'tatico', titulo: 'As categorias de base que mais revelam no Brasil', resumo: 'Ranking e analise das canteiras mais produtivas do futebol brasileiro', porqueFunciona: 'Formacao e tema com apelo nacional', formatos: ['materia', 'infografico'], plataformas: ['site', 'instagram'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-048', pautaId: 'p23', tipo: 'personagem', titulo: 'O olheiro: quem descobre as joias do futebol brasileiro', resumo: 'Perfil de profissionais que garimam talentos pelo interior do Brasil', porqueFunciona: 'Profissao invisivel com historias fascinantes', formatos: ['video', 'materia'], plataformas: ['youtube', 'site'], favorito: true, aprovado: true, descartado: false },
  // Pauta 24 angulos (p24)
  { id: 'ang-049', pautaId: 'p24', tipo: 'emocional', titulo: 'Classico Grenal: mais que um jogo, uma guerra', resumo: 'O significado cultural e emocional do maior classico do sul', porqueFunciona: 'Classicos mobilizam paixoes imensas', formatos: ['video', 'materia'], plataformas: ['youtube', 'site'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-050', pautaId: 'p24', tipo: 'historico', titulo: 'Os 10 Grenais que marcaram a historia', resumo: 'Selecao dos classicos mais memoraveis entre Gremio e Inter', porqueFunciona: 'Ranking historico de classico e sucesso garantido', formatos: ['carrossel', 'thread'], plataformas: ['instagram', 'x'], favorito: false, aprovado: true, descartado: false },
  // Pauta 25 angulos (p25)
  { id: 'ang-051', pautaId: 'p25', tipo: 'dados', titulo: 'O impacto economico do futebol nas cidades-sede', resumo: 'Numeros sobre quanto o futebol movimenta na economia local', porqueFunciona: 'Abordagem economica diferencia do conteudo comum', formatos: ['materia', 'infografico'], plataformas: ['site', 'instagram'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-052', pautaId: 'p25', tipo: 'storytelling', titulo: 'O vendedor de churrasquinho que vive do futebol', resumo: 'Historia de personagem que depende dos jogos para sobreviver', porqueFunciona: 'Micro-historia dentro da macro-historia', formatos: ['reels', 'materia'], plataformas: ['instagram', 'site'], favorito: true, aprovado: true, descartado: false },
  // Pauta 26 angulos (p26)
  { id: 'ang-053', pautaId: 'p26', tipo: 'provocador', titulo: 'O futebol feminino brasileiro e tratado como deveria?', resumo: 'Critica a falta de investimento e visibilidade do futebol feminino', porqueFunciona: 'Tema social relevante com forte debate', formatos: ['video', 'materia'], plataformas: ['youtube', 'site'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-054', pautaId: 'p26', tipo: 'personagem', titulo: 'As craques que o Brasil nao conhece', resumo: 'Perfis de jogadoras talentosas que nao tem visibilidade', porqueFunciona: 'Descoberta de talentos desconhecidos surpreende', formatos: ['carrossel', 'reels'], plataformas: ['instagram', 'tiktok'], favorito: false, aprovado: true, descartado: false },
  // Pauta 27 angulos (p27)
  { id: 'ang-055', pautaId: 'p27', tipo: 'analitico', titulo: 'xG, pressao e posse: as metricas que mudaram o futebol', resumo: 'Explicacao acessivel das metricas avancadas usadas no futebol moderno', porqueFunciona: 'Educar a audiencia cria fidelizacao', formatos: ['video', 'carrossel'], plataformas: ['youtube', 'instagram'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-056', pautaId: 'p27', tipo: 'humor', titulo: 'xG pra que? Quando a estatistica nao explica o futebol', resumo: 'Momentos absurdos que nenhuma metrica consegue prever', porqueFunciona: 'Contraponto humoristico ao tema serio funciona', formatos: ['reels', 'thread'], plataformas: ['instagram', 'x'], favorito: false, aprovado: true, descartado: false },
  // Pauta 28 angulos (p28)
  { id: 'ang-057', pautaId: 'p28', tipo: 'jornalistico', titulo: 'As apostas esportivas e a corrupcao no futebol brasileiro', resumo: 'Investigacao sobre o impacto das bets na integridade dos jogos', porqueFunciona: 'Tema de relevancia publica extrema', formatos: ['materia', 'video'], plataformas: ['site', 'youtube'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-058', pautaId: 'p28', tipo: 'contraponto', titulo: 'Bets: vilao ou fonte de receita para os clubes?', resumo: 'Debate equilibrado sobre os dois lados da questao', porqueFunciona: 'Tema polemico com argumentos validos dos dois lados', formatos: ['video', 'enquete'], plataformas: ['youtube', 'x'], favorito: false, aprovado: true, descartado: false },
  // Pauta 29 angulos (p29)
  { id: 'ang-059', pautaId: 'p29', tipo: 'curiosidade', titulo: 'O que os jogadores fazem nos dias de folga', resumo: 'Bastidores da vida pessoal dos jogadores fora dos gramados', porqueFunciona: 'Curiosidade sobre a vida privada de famosos engaja', formatos: ['reels', 'carrossel'], plataformas: ['instagram', 'tiktok'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-060', pautaId: 'p29', tipo: 'personagem', titulo: 'O preparador fisico: o heroi invisivel do futebol', resumo: 'Perfil dos profissionais que mantem os jogadores em campo', porqueFunciona: 'Mostrar quem esta por tras amplia a compreensao', formatos: ['video', 'materia'], plataformas: ['youtube', 'site'], favorito: false, aprovado: true, descartado: false },
  // Pauta 30 angulos (p30)
  { id: 'ang-061', pautaId: 'p30', tipo: 'tatico', titulo: 'A linha de 3 no Brasil: tendencia ou moda?', resumo: 'Analise da adocao crescente de esquemas com tres zagueiros', porqueFunciona: 'Tendencia tatica relevante para varios times', formatos: ['video', 'materia'], plataformas: ['youtube', 'site'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-062', pautaId: 'p30', tipo: 'dados', titulo: 'Numeros dos times que jogam com 3 zagueiros em 2026', resumo: 'Estatisticas comparativas de desempenho por formacao', porqueFunciona: 'Dados concretos para debate tatico', formatos: ['infografico', 'carrossel'], plataformas: ['instagram', 'x'], favorito: false, aprovado: true, descartado: false },
  // Extra angulos for variety
  { id: 'ang-063', pautaId: 'p1', tipo: 'humor', titulo: 'Palmeiras sem Estevao: memes e reacoes da torcida', resumo: 'Compilado das reacoes mais engracadas da torcida alviverde', porqueFunciona: 'Humor alivia tensao de noticia impactante', formatos: ['carrossel', 'reels'], plataformas: ['instagram', 'tiktok'], favorito: false, aprovado: false, descartado: false },
  { id: 'ang-064', pautaId: 'p3', tipo: 'torcedor', titulo: 'Torcedores na Libertadores: as melhores festas', resumo: 'Compilado das melhores recepcoes e festas de torcidas na Libertadores', porqueFunciona: 'Torcida na Libertadores e espetaculo a parte', formatos: ['reels', 'carrossel'], plataformas: ['instagram', 'tiktok'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-065', pautaId: 'p5', tipo: 'pergunta', titulo: 'Quem sera campeao brasileiro em 2026?', resumo: 'Enquete e analise dos principais candidatos ao titulo', porqueFunciona: 'Previsao de campeao engaja todas as torcidas', formatos: ['enquete', 'video'], plataformas: ['x', 'youtube'], favorito: false, aprovado: true, descartado: false },
  { id: 'ang-066', pautaId: 'p8', tipo: 'storytelling', titulo: 'De Sao Goncalo ao Bernabeu: a jornada de Vini Jr', resumo: 'Narrativa completa da trajetoria de Vinicius Junior', porqueFunciona: 'Historia de superacao e inspiracao', formatos: ['video', 'materia'], plataformas: ['youtube', 'site'], favorito: true, aprovado: true, descartado: false },
  { id: 'ang-067', pautaId: 'p12', tipo: 'provocador', titulo: 'Clubes brasileiros estao jogando dinheiro fora?', resumo: 'Analise critica das contratacoes mais questionaveis do mercado', porqueFunciona: 'Critica fundamentada gera debate e defesas apaixonadas', formatos: ['video', 'thread'], plataformas: ['youtube', 'x'], favorito: false, aprovado: true, descartado: false },
  { id: 'ang-068', pautaId: 'p13', tipo: 'emocional', titulo: 'O Brasil de volta ao topo: a emocao de torcer pela Selecao', resumo: 'Reflexao sobre o significado de torcer pelo Brasil nas Eliminatorias', porqueFunciona: 'Selecao Brasileira conecta com sentimento nacional', formatos: ['video', 'materia'], plataformas: ['youtube', 'site'], favorito: false, aprovado: true, descartado: false },
  { id: 'ang-069', pautaId: 'p16', tipo: 'torcedor', titulo: 'Cruzeirenses e a esperanca renovada', resumo: 'Depoimentos de torcedores sobre a nova fase do clube', porqueFunciona: 'Vozes da torcida criam conexao emocional', formatos: ['reels', 'materia'], plataformas: ['instagram', 'site'], favorito: false, aprovado: true, descartado: false },
  { id: 'ang-070', pautaId: 'p20', tipo: 'dados', titulo: 'Bahia em numeros: a evolucao desde a chegada do City Group', resumo: 'Estatisticas de crescimento do Bahia em todas as areas', porqueFunciona: 'Numeros mostram dimensao real do projeto', formatos: ['infografico', 'materia'], plataformas: ['instagram', 'site'], favorito: false, aprovado: true, descartado: false },
];

// --- Conteudos Derivados (30+) ---

const conteudos: ConteudoDerivado[] = [
  { id: 'c-001', pautaId: 'p1', anguloId: 'ang-001', nome: 'Materia: Bastidores Estevao-City', formato: 'materia', destino: 'site', status: 'publicado', prioridade: 'alta', observacoes: 'Materia principal do dia', conteudo: 'Estevao no Manchester City: como a negociacao bilionaria foi fechada nos bastidores...', criadoEm: '2026-08-09T08:00:00Z' },
  { id: 'c-002', pautaId: 'p1', anguloId: 'ang-002', nome: 'Video: Palmeiras sem Estevao', formato: 'video', destino: 'youtube', status: 'pronto', prioridade: 'alta', observacoes: 'Roteiro aprovado, gravar hoje', criadoEm: '2026-08-09T09:00:00Z' },
  { id: 'c-003', pautaId: 'p1', anguloId: 'ang-003', nome: 'Carrossel: Estevao vs Neymar', formato: 'carrossel', destino: 'instagram', status: 'criando', prioridade: 'media', observacoes: 'Design em andamento', criadoEm: '2026-08-09T10:00:00Z' },
  { id: 'c-004', pautaId: 'p2', anguloId: 'ang-004', nome: 'Video: Tatica Fla com Gabigol', formato: 'video', destino: 'youtube', status: 'desenvolvimento', prioridade: 'alta', observacoes: 'Precisar definir clips do jogo', criadoEm: '2026-08-08T14:00:00Z' },
  { id: 'c-005', pautaId: 'p2', anguloId: 'ang-006', nome: 'Enquete: Gabigol titular?', formato: 'enquete', destino: 'x', status: 'publicado', prioridade: 'media', observacoes: 'Engajamento altissimo, 45k votos', criadoEm: '2026-08-07T18:00:00Z' },
  { id: 'c-006', pautaId: 'p3', anguloId: 'ang-007', nome: 'Carrossel: Viradas historicas Libertadores', formato: 'carrossel', destino: 'instagram', status: 'publicado', prioridade: 'alta', observacoes: '12 slides, 85k alcance', criadoEm: '2026-08-06T10:00:00Z' },
  { id: 'c-007', pautaId: 'p3', anguloId: 'ang-008', nome: 'Infografico: Semis Libertadores', formato: 'infografico', destino: 'instagram', status: 'pronto', prioridade: 'alta', observacoes: 'Publicar na vespera dos jogos', criadoEm: '2026-08-06T11:00:00Z' },
  { id: 'c-008', pautaId: 'p4', anguloId: 'ang-009', nome: 'Materia: Perfil Bremer', formato: 'materia', destino: 'site', status: 'revisao', prioridade: 'media', observacoes: 'Aguardando revisao do editor', criadoEm: '2026-08-05T09:00:00Z' },
  { id: 'c-009', pautaId: 'p5', anguloId: 'ang-011', nome: 'Materia: Brasileirao equilibrado', formato: 'materia', destino: 'site', status: 'publicado', prioridade: 'alta', observacoes: 'Materia repercutiu bem nas redes', criadoEm: '2026-08-04T08:00:00Z' },
  { id: 'c-010', pautaId: 'p5', anguloId: 'ang-012', nome: 'Carrossel: Memes da rodada', formato: 'carrossel', destino: 'instagram', status: 'publicado', prioridade: 'baixa', observacoes: 'Post com maior engajamento da semana', criadoEm: '2026-08-04T20:00:00Z' },
  { id: 'c-011', pautaId: 'p6', anguloId: 'ang-013', nome: 'Thread: Bastidores demissao SPFC', formato: 'thread', destino: 'x', status: 'publicado', prioridade: 'alta', observacoes: '230 RTs, trending por 2h', criadoEm: '2026-08-03T22:00:00Z' },
  { id: 'c-012', pautaId: 'p6', anguloId: 'ang-014', nome: 'Enquete: Proximo tecnico SPFC', formato: 'enquete', destino: 'x', status: 'publicado', prioridade: 'media', observacoes: '38k votos em 12h', criadoEm: '2026-08-03T23:00:00Z' },
  { id: 'c-013', pautaId: 'p7', anguloId: 'ang-015', nome: 'Video: Santos da B ao sonho', formato: 'video', destino: 'youtube', status: 'criando', prioridade: 'alta', observacoes: 'Edicao em andamento, previsao 3 dias', criadoEm: '2026-08-02T10:00:00Z' },
  { id: 'c-014', pautaId: 'p8', anguloId: 'ang-017', nome: 'Video: Evolucao Vini Jr', formato: 'video', destino: 'youtube', status: 'planejado', prioridade: 'alta', observacoes: 'Gravar apos proximo jogo do Real', criadoEm: '2026-08-01T08:00:00Z' },
  { id: 'c-015', pautaId: 'p8', anguloId: 'ang-018', nome: 'Carrossel: 10 curiosidades Vini', formato: 'carrossel', destino: 'instagram', status: 'pronto-criar', prioridade: 'media', observacoes: 'Briefing pronto, aguardando designer', criadoEm: '2026-08-01T09:00:00Z' },
  { id: 'c-016', pautaId: 'p9', anguloId: 'ang-019', nome: 'Video: Debate VAR', formato: 'video', destino: 'youtube', status: 'publicado', prioridade: 'alta', observacoes: '120k views em 48h', criadoEm: '2026-07-30T14:00:00Z' },
  { id: 'c-017', pautaId: 'p10', anguloId: 'ang-021', nome: 'Post: Botafogo novo grande?', formato: 'post', destino: 'x', status: 'publicado', prioridade: 'media', observacoes: 'Alto engajamento, 500+ replies', criadoEm: '2026-07-29T16:00:00Z' },
  { id: 'c-018', pautaId: 'p12', anguloId: 'ang-025', nome: 'Materia: Ranking investimentos', formato: 'materia', destino: 'site', status: 'desenvolvimento', prioridade: 'alta', observacoes: 'Aguardando dados finais da janela', criadoEm: '2026-08-10T08:00:00Z' },
  { id: 'c-019', pautaId: 'p13', anguloId: 'ang-027', nome: 'Video: Tatica Dorival', formato: 'video', destino: 'youtube', status: 'ideia', prioridade: 'alta', observacoes: 'Produzir apos convocacao', criadoEm: '2026-08-10T09:00:00Z' },
  { id: 'c-020', pautaId: 'p13', anguloId: 'ang-028', nome: 'Carrossel: Selecao 2002 vs 2026', formato: 'carrossel', destino: 'instagram', status: 'pronto-criar', prioridade: 'media', observacoes: 'Fotos ja selecionadas', criadoEm: '2026-08-10T10:00:00Z' },
  { id: 'c-021', pautaId: 'p14', anguloId: 'ang-029', nome: 'Video: Historia Endrick', formato: 'video', destino: 'youtube', status: 'revisao', prioridade: 'alta', observacoes: 'Primeira versao pronta', criadoEm: '2026-07-28T08:00:00Z' },
  { id: 'c-022', pautaId: 'p16', anguloId: 'ang-033', nome: 'Video: Renascimento Cruzeiro', formato: 'video', destino: 'youtube', status: 'criando', prioridade: 'media', observacoes: 'Gravacao de entrevistas agendada', criadoEm: '2026-08-07T10:00:00Z' },
  { id: 'c-023', pautaId: 'p20', anguloId: 'ang-041', nome: 'Materia: Projeto Bahia', formato: 'materia', destino: 'site', status: 'desenvolvimento', prioridade: 'media', observacoes: 'Entrevista com diretor agendada', criadoEm: '2026-08-08T08:00:00Z' },
  { id: 'c-024', pautaId: 'p21', anguloId: 'ang-043', nome: 'Video: Defesa do Inter', formato: 'video', destino: 'youtube', status: 'pronto-criar', prioridade: 'media', observacoes: 'Clips selecionados, montar roteiro', criadoEm: '2026-08-06T08:00:00Z' },
  { id: 'c-025', pautaId: 'p24', anguloId: 'ang-049', nome: 'Video: Especial Grenal', formato: 'video', destino: 'youtube', status: 'planejado', prioridade: 'alta', observacoes: 'Produzir na semana do classico', criadoEm: '2026-08-05T08:00:00Z' },
  { id: 'c-026', pautaId: 'p26', anguloId: 'ang-053', nome: 'Video: Futebol feminino merece mais', formato: 'video', destino: 'youtube', status: 'ideia', prioridade: 'alta', observacoes: 'Tema importante, priorizar', criadoEm: '2026-08-09T08:00:00Z' },
  { id: 'c-027', pautaId: 'p27', anguloId: 'ang-055', nome: 'Video: Guia de metricas', formato: 'video', destino: 'youtube', status: 'desenvolvimento', prioridade: 'media', observacoes: 'Roteiro em construcao', criadoEm: '2026-08-04T08:00:00Z' },
  { id: 'c-028', pautaId: 'p28', anguloId: 'ang-057', nome: 'Materia: Bets e corrupcao', formato: 'materia', destino: 'site', status: 'revisao', prioridade: 'alta', observacoes: 'Revisao juridica necessaria', criadoEm: '2026-08-02T08:00:00Z' },
  { id: 'c-029', pautaId: 'p11', anguloId: 'ang-023', nome: 'Video: O peso da camisa do Vasco', formato: 'video', destino: 'youtube', status: 'pronto', prioridade: 'media', observacoes: 'Edicao finalizada, agendar publicacao', criadoEm: '2026-08-03T08:00:00Z' },
  { id: 'c-030', pautaId: 'p15', anguloId: 'ang-031', nome: 'Materia: Crise financeira Gremio', formato: 'materia', destino: 'site', status: 'publicado', prioridade: 'alta', observacoes: 'Grande repercussao entre gremistas', criadoEm: '2026-07-31T08:00:00Z' },
  { id: 'c-031', pautaId: 'p17', anguloId: 'ang-035', nome: 'Carrossel: Estadios mais bonitos', formato: 'carrossel', destino: 'instagram', status: 'publicado', prioridade: 'baixa', observacoes: 'Post com 95k alcance', criadoEm: '2026-07-25T10:00:00Z' },
  { id: 'c-032', pautaId: 'p22', anguloId: 'ang-045', nome: 'Video: Premier League debate', formato: 'video', destino: 'youtube', status: 'pronto-criar', prioridade: 'baixa', observacoes: 'Pautar para proxima semana', criadoEm: '2026-08-08T08:00:00Z' },
];

// --- Pautas (30) ---

function makePauta(
  id: string,
  titulo: string,
  descricao: string,
  origem: string,
  fonteUrl: string | undefined,
  tags: string[],
  clube: string | undefined,
  jogador: string | undefined,
  competicao: string | undefined,
  status: PautaStatus,
  vidaUtil: VidaUtil,
  semaforo: Semaforo,
  atributos: PautaAttributes,
  favorita: boolean,
  criadaEm: string,
  atualizadaEm: string,
  notas: string,
): Pauta {
  const overall = computeOverall(atributos);
  const pautaAngulos = angulos.filter((a) => a.pautaId === id);
  const pautaConteudos = conteudos.filter((c) => c.pautaId === id);
  return {
    id,
    titulo,
    descricao,
    origem,
    fonteUrl,
    tags,
    clube,
    jogador,
    competicao,
    status,
    vidaUtil,
    semaforo,
    atributos,
    overall,
    favorita,
    criadaEm,
    atualizadaEm,
    notas,
    angulos: pautaAngulos,
    conteudos: pautaConteudos,
  };
}

const pautas: Pauta[] = [
  // p1 - BOLA DE OURO level
  makePauta(
    'p1',
    'Estevao confirmado no Manchester City por 61,5 milhoes de euros',
    'Palmeiras oficializa a venda de Estevao ao Manchester City. Maior venda da historia do futebol brasileiro. Jogador se apresenta em janeiro.',
    'noticia',
    'https://ge.globo.com/futebol/times/palmeiras/',
    ['transferencia', 'palmeiras', 'premier-league', 'mercado'],
    'Palmeiras',
    'Estevao',
    'Premier League',
    'titular',
    'dias',
    'verde',
    { atualidade: 100, debate: 95, originalidade: 85, emocao: 98, versatilidade: 95, vidaUtil: 80, potencialVisual: 90, profundidade: 85 },
    true,
    '2026-08-09T06:00:00Z',
    '2026-08-11T10:00:00Z',
    'Pauta principal da semana. Cobrir todos os angulos possiveis.',
  ),
  // p2 - PAUTA TITULAR level
  makePauta(
    'p2',
    'Gabigol negocia retorno ao Flamengo',
    'Atacante esta livre no mercado apos rescindir com o Al-Hilal e negocia volta ao Flamengo. Torcida faz campanha nas redes.',
    'noticia',
    'https://ge.globo.com/futebol/times/flamengo/',
    ['transferencia', 'flamengo', 'gabigol', 'mercado'],
    'Flamengo',
    'Gabigol',
    'Brasileirao',
    'titular',
    'dias',
    'amarelo',
    { atualidade: 95, debate: 98, originalidade: 70, emocao: 95, versatilidade: 90, vidaUtil: 75, potencialVisual: 85, profundidade: 75 },
    true,
    '2026-08-07T14:00:00Z',
    '2026-08-11T08:00:00Z',
    'Negociacao em andamento. Monitorar diariamente.',
  ),
  // p3 - PAUTA TITULAR level
  makePauta(
    'p3',
    'Semifinais da Libertadores 2026: chaves definidas',
    'Sorteio definiu os confrontos das semifinais. Flamengo x Atletico-MG e Palmeiras x Boca Juniors prometem jogos epicos.',
    'noticia',
    'https://www.conmebol.com/libertadores/',
    ['libertadores', 'semifinal', 'flamengo', 'palmeiras', 'boca-juniors'],
    undefined,
    undefined,
    'Libertadores',
    'titular',
    'dias',
    'verde',
    { atualidade: 98, debate: 92, originalidade: 65, emocao: 95, versatilidade: 90, vidaUtil: 85, potencialVisual: 92, profundidade: 80 },
    true,
    '2026-08-06T02:00:00Z',
    '2026-08-10T15:00:00Z',
    'Cobertura completa das semifinais. Prioridade maxima.',
  ),
  // p4 - OTIMA OPCAO level
  makePauta(
    'p4',
    'Bremer volta ao Brasil e assina com o Corinthians',
    'Zagueiro da Juventus aceita proposta do Corinthians e volta ao futebol brasileiro apos 6 anos na Europa.',
    'noticia',
    undefined,
    ['transferencia', 'corinthians', 'serie-a', 'mercado'],
    'Corinthians',
    'Bremer',
    'Brasileirao',
    'vestiario',
    'dias',
    'verde',
    { atualidade: 90, debate: 80, originalidade: 75, emocao: 82, versatilidade: 78, vidaUtil: 70, potencialVisual: 75, profundidade: 80 },
    false,
    '2026-08-05T10:00:00Z',
    '2026-08-10T12:00:00Z',
    'Confirmar detalhes contratuais com fontes.',
  ),
  // p5 - OTIMA OPCAO level
  makePauta(
    'p5',
    'Brasileirao 2026: o campeonato mais equilibrado em 20 anos',
    'Apenas 8 pontos separam o lider do 10o colocado na 20a rodada. Analise aprofundada do equilibrio inedito.',
    'analise',
    undefined,
    ['brasileirao', 'analise', 'estatisticas', 'equilibrio'],
    undefined,
    undefined,
    'Brasileirao',
    'titular',
    'longo',
    'verde',
    { atualidade: 85, debate: 88, originalidade: 80, emocao: 70, versatilidade: 85, vidaUtil: 90, potencialVisual: 78, profundidade: 88 },
    true,
    '2026-08-04T08:00:00Z',
    '2026-08-11T06:00:00Z',
    'Atualizar dados a cada rodada. Pauta recorrente.',
  ),
  // p6 - PAUTA TITULAR level
  makePauta(
    'p6',
    'Sao Paulo demite tecnico apos sequencia de 5 derrotas',
    'Tricolor anuncia saida do treinador e busca substituto no mercado. Nomes de Cuca, Mano Menezes e tecnico estrangeiro sao cotados.',
    'noticia',
    'https://ge.globo.com/futebol/times/sao-paulo/',
    ['sao-paulo', 'demissao', 'tecnico', 'crise'],
    'Sao Paulo',
    undefined,
    'Brasileirao',
    'titular',
    'horas',
    'vermelho',
    { atualidade: 100, debate: 95, originalidade: 60, emocao: 88, versatilidade: 85, vidaUtil: 55, potencialVisual: 72, profundidade: 78 },
    false,
    '2026-08-03T21:00:00Z',
    '2026-08-11T09:00:00Z',
    'Quente. Apuracao continua sobre substituto.',
  ),
  // p7 - BOA PAUTA level
  makePauta(
    'p7',
    'Santos consolida campanha e sonha com G4',
    'Peixe vive melhor momento desde o retorno a Serie A e se aproxima da zona de classificacao para a Libertadores.',
    'analise',
    undefined,
    ['santos', 'brasileirao', 'serie-a', 'recuperacao'],
    'Santos',
    undefined,
    'Brasileirao',
    'banco',
    'dias',
    'verde',
    { atualidade: 75, debate: 68, originalidade: 65, emocao: 78, versatilidade: 70, vidaUtil: 72, potencialVisual: 65, profundidade: 70 },
    false,
    '2026-08-02T10:00:00Z',
    '2026-08-09T14:00:00Z',
    'Acompanhar evolucao a cada rodada.',
  ),
  // p8 - BOLA DE OURO level
  makePauta(
    'p8',
    'Vinicius Jr eleito melhor jogador do mundo pela FIFA',
    'Brasileiro recebe o premio FIFA The Best pela segunda vez consecutiva. Cerimonia acontece em Zurique.',
    'noticia',
    'https://www.fifa.com/the-best/',
    ['vinicius-jr', 'real-madrid', 'the-best', 'selecao', 'premio'],
    'Real Madrid',
    'Vinicius Jr',
    'La Liga',
    'titular',
    'dias',
    'azul',
    { atualidade: 100, debate: 90, originalidade: 80, emocao: 100, versatilidade: 95, vidaUtil: 85, potencialVisual: 98, profundidade: 82 },
    true,
    '2026-08-01T18:00:00Z',
    '2026-08-10T20:00:00Z',
    'Celebracao completa. Usar todas as plataformas.',
  ),
  // p9 - OTIMA OPCAO level
  makePauta(
    'p9',
    'Polemica do VAR: erros em 3 jogos da mesma rodada reacendem debate',
    'Arbitragem brasileira novamente no centro da polemica apos erros graves em jogos decisivos do Brasileirao.',
    'noticia',
    undefined,
    ['var', 'arbitragem', 'polemica', 'brasileirao'],
    undefined,
    undefined,
    'Brasileirao',
    'titular',
    'hoje',
    'vermelho',
    { atualidade: 95, debate: 100, originalidade: 55, emocao: 85, versatilidade: 80, vidaUtil: 50, potencialVisual: 70, profundidade: 75 },
    false,
    '2026-07-30T22:00:00Z',
    '2026-08-01T10:00:00Z',
    'Tema recorrente. Usar dados para sustentar analise.',
  ),
  // p10 - BOA PAUTA level
  makePauta(
    'p10',
    'Botafogo mantem lideranca e consolida projeto vencedor',
    'Glorioso lidera Brasileirao com folga e confirma que o titulo de 2024 nao foi acaso. SAF John Textor apresenta resultados.',
    'analise',
    undefined,
    ['botafogo', 'brasileirao', 'saf', 'lideranca'],
    'Botafogo',
    undefined,
    'Brasileirao',
    'vestiario',
    'longo',
    'verde',
    { atualidade: 80, debate: 78, originalidade: 70, emocao: 72, versatilidade: 68, vidaUtil: 80, potencialVisual: 65, profundidade: 78 },
    false,
    '2026-07-29T10:00:00Z',
    '2026-08-08T14:00:00Z',
    'Acompanhar desempenho do Botafogo.',
  ),
  // p11 - BOA PAUTA level
  makePauta(
    'p11',
    'Vasco e a montanha-russa: entre a ilusao e a realidade',
    'Cruzmaltino alterna bons e maus resultados e vive fase de indefinicao no Brasileirao. Torcida cobra consistencia.',
    'analise',
    undefined,
    ['vasco', 'brasileirao', 'crise', 'torcida'],
    'Vasco',
    undefined,
    'Brasileirao',
    'banco',
    'dias',
    'amarelo',
    { atualidade: 72, debate: 75, originalidade: 62, emocao: 80, versatilidade: 65, vidaUtil: 68, potencialVisual: 60, profundidade: 65 },
    false,
    '2026-08-03T08:00:00Z',
    '2026-08-09T12:00:00Z',
    'Momento de instabilidade do Vasco pode render boas analises.',
  ),
  // p12 - OTIMA OPCAO level
  makePauta(
    'p12',
    'Janela de transferencias 2026: balanco geral do mercado brasileiro',
    'Clubes brasileiros bateram recorde de gastos na janela do meio do ano. Analise das principais contratacoes e vendas.',
    'analise',
    undefined,
    ['mercado', 'transferencias', 'janela', 'balanco', 'brasileirao'],
    undefined,
    undefined,
    'Brasileirao',
    'vestiario',
    'longo',
    'verde',
    { atualidade: 88, debate: 82, originalidade: 78, emocao: 60, versatilidade: 85, vidaUtil: 90, potencialVisual: 75, profundidade: 85 },
    true,
    '2026-08-10T06:00:00Z',
    '2026-08-11T12:00:00Z',
    'Materia de referencia. Manter atualizada ate o fechamento da janela.',
  ),
  // p13 - PAUTA TITULAR level
  makePauta(
    'p13',
    'Selecao Brasileira: Dorival convoca para Eliminatorias',
    'Tecnico da Selecao anuncia lista de convocados para as proximas rodadas das Eliminatorias para a Copa 2030.',
    'noticia',
    'https://www.cbf.com.br/',
    ['selecao', 'eliminatorias', 'convocacao', 'dorival'],
    'Selecao Brasileira',
    undefined,
    'Eliminatorias',
    'titular',
    'dias',
    'verde',
    { atualidade: 98, debate: 92, originalidade: 55, emocao: 90, versatilidade: 88, vidaUtil: 70, potencialVisual: 85, profundidade: 75 },
    true,
    '2026-08-10T14:00:00Z',
    '2026-08-11T10:00:00Z',
    'Convocacao sempre gera muito debate. Cobrir amplamente.',
  ),
  // p14 - BOA PAUTA level
  makePauta(
    'p14',
    'Endrick titular no Real Madrid: a adaptacao do brasileiro',
    'Atacante brasileiro ganha espaco com Ancelotti e se firma como opcao no ataque merengue.',
    'analise',
    undefined,
    ['endrick', 'real-madrid', 'la-liga', 'brasileiros-na-europa'],
    'Real Madrid',
    'Endrick',
    'La Liga',
    'banco',
    'longo',
    'verde',
    { atualidade: 78, debate: 72, originalidade: 68, emocao: 75, versatilidade: 70, vidaUtil: 78, potencialVisual: 72, profundidade: 72 },
    false,
    '2026-07-28T08:00:00Z',
    '2026-08-08T10:00:00Z',
    'Atualizar apos cada jogo do Endrick.',
  ),
  // p15 - BANCO level
  makePauta(
    'p15',
    'Gremio: crise financeira e desempenho abaixo do esperado',
    'Tricolor gaucho enfrenta dificuldades financeiras e luta para nao cair na tabela do Brasileirao.',
    'analise',
    undefined,
    ['gremio', 'crise', 'financas', 'brasileirao'],
    'Gremio',
    undefined,
    'Brasileirao',
    'banco',
    'longo',
    'amarelo',
    { atualidade: 70, debate: 65, originalidade: 55, emocao: 68, versatilidade: 58, vidaUtil: 72, potencialVisual: 50, profundidade: 68 },
    false,
    '2026-07-31T08:00:00Z',
    '2026-08-08T08:00:00Z',
    'Tema delicado. Usar dados financeiros publicos.',
  ),
  // p16 - BOA PAUTA level
  makePauta(
    'p16',
    'Cruzeiro e a consolidacao da SAF: resultados apos 3 anos',
    'Raposa mostra evolucao consistente sob gestao da SAF e mira vaga na Libertadores.',
    'analise',
    undefined,
    ['cruzeiro', 'saf', 'gestao', 'brasileirao'],
    'Cruzeiro',
    undefined,
    'Brasileirao',
    'banco',
    'evergreen',
    'verde',
    { atualidade: 68, debate: 70, originalidade: 72, emocao: 65, versatilidade: 70, vidaUtil: 85, potencialVisual: 62, profundidade: 78 },
    false,
    '2026-08-07T10:00:00Z',
    '2026-08-10T08:00:00Z',
    'Materia de referencia sobre modelo SAF.',
  ),
  // p17 - BANCO level
  makePauta(
    'p17',
    'Os estadios do futebol brasileiro: reformas e novos projetos',
    'Panorama das arenas brasileiras em 2026, incluindo reformas no Maracana e novos projetos pelo pais.',
    'pauta-fria',
    undefined,
    ['estadios', 'infraestrutura', 'arenas', 'futebol-brasileiro'],
    undefined,
    undefined,
    undefined,
    'base',
    'evergreen',
    'azul',
    { atualidade: 45, debate: 50, originalidade: 68, emocao: 60, versatilidade: 65, vidaUtil: 95, potencialVisual: 85, profundidade: 70 },
    false,
    '2026-07-25T10:00:00Z',
    '2026-08-05T08:00:00Z',
    'Pauta fria. Usar quando houver janela na programacao.',
  ),
  // p18 - BANCO level
  makePauta(
    'p18',
    'Fluminense busca regularidade no Brasileirao',
    'Tricolor carioca alterna entre bons momentos na Libertadores e tropecos no campeonato nacional.',
    'analise',
    undefined,
    ['fluminense', 'brasileirao', 'libertadores', 'regularidade'],
    'Fluminense',
    undefined,
    'Brasileirao',
    'banco',
    'dias',
    'amarelo',
    { atualidade: 65, debate: 60, originalidade: 55, emocao: 62, versatilidade: 58, vidaUtil: 60, potencialVisual: 55, profundidade: 60 },
    false,
    '2026-08-01T08:00:00Z',
    '2026-08-07T10:00:00Z',
    'Acompanhar desempenho nas duas competicoes.',
  ),
  // p19 - BOA PAUTA level
  makePauta(
    'p19',
    'Hulk anuncia aposentadoria: fim de uma era no Atletico-MG',
    'Atacante de 40 anos confirma que 2026 sera sua ultima temporada. Atletico planeja homenagem no Mineirao.',
    'noticia',
    undefined,
    ['hulk', 'atletico-mg', 'aposentadoria', 'homenagem'],
    'Atletico-MG',
    'Hulk',
    'Brasileirao',
    'vestiario',
    'dias',
    'azul',
    { atualidade: 82, debate: 68, originalidade: 65, emocao: 92, versatilidade: 72, vidaUtil: 65, potencialVisual: 78, profundidade: 68 },
    true,
    '2026-08-09T12:00:00Z',
    '2026-08-11T08:00:00Z',
    'Pauta emocional forte. Priorizar conteudo visual.',
  ),
  // p20 - BANCO level
  makePauta(
    'p20',
    'Bahia e o projeto City Group: onde o clube quer chegar',
    'Analise aprofundada do planejamento estrategico do Bahia sob gestao do grupo dono do Manchester City.',
    'analise',
    undefined,
    ['bahia', 'city-group', 'saf', 'gestao', 'planejamento'],
    'Bahia',
    undefined,
    'Brasileirao',
    'banco',
    'evergreen',
    'verde',
    { atualidade: 60, debate: 62, originalidade: 70, emocao: 55, versatilidade: 65, vidaUtil: 85, potencialVisual: 55, profundidade: 80 },
    false,
    '2026-08-08T08:00:00Z',
    '2026-08-10T10:00:00Z',
    'Materia de referencia. Pode ser publicada a qualquer momento.',
  ),
  // p21 - BOA PAUTA level
  makePauta(
    'p21',
    'Internacional surpreende com a melhor defesa do Brasileirao',
    'Colorado tem a defesa menos vazada do campeonato e sistema defensivo vira referencia.',
    'analise',
    undefined,
    ['internacional', 'defesa', 'brasileirao', 'tatica'],
    'Internacional',
    undefined,
    'Brasileirao',
    'banco',
    'dias',
    'verde',
    { atualidade: 72, debate: 68, originalidade: 72, emocao: 65, versatilidade: 68, vidaUtil: 70, potencialVisual: 65, profundidade: 75 },
    false,
    '2026-08-06T08:00:00Z',
    '2026-08-09T10:00:00Z',
    'Atualizar dados a cada rodada.',
  ),
  // p22 - BANCO level
  makePauta(
    'p22',
    'Premier League 2026-27: o que esperar da nova temporada',
    'Preview completo da nova temporada do campeonato ingles com foco nos brasileiros.',
    'analise',
    undefined,
    ['premier-league', 'inglaterra', 'brasileiros-na-europa', 'preview'],
    undefined,
    undefined,
    'Premier League',
    'base',
    'longo',
    'azul',
    { atualidade: 60, debate: 58, originalidade: 62, emocao: 50, versatilidade: 65, vidaUtil: 72, potencialVisual: 60, profundidade: 68 },
    false,
    '2026-08-08T08:00:00Z',
    '2026-08-10T08:00:00Z',
    'Publicar na semana de abertura da Premier League.',
  ),
  // p23 - BOA PAUTA level
  makePauta(
    'p23',
    'Categorias de base: a fabrica de talentos do futebol brasileiro',
    'Mapeamento das categorias de base que mais revelam jogadores para o futebol profissional.',
    'pauta-fria',
    undefined,
    ['base', 'formacao', 'jovens', 'talentos', 'futebol-brasileiro'],
    undefined,
    undefined,
    undefined,
    'banco',
    'evergreen',
    'azul',
    { atualidade: 55, debate: 62, originalidade: 78, emocao: 65, versatilidade: 72, vidaUtil: 95, potencialVisual: 68, profundidade: 82 },
    false,
    '2026-07-20T08:00:00Z',
    '2026-08-05T10:00:00Z',
    'Pauta evergreen. Atualizar semestralmente.',
  ),
  // p24 - OTIMA OPCAO level
  makePauta(
    'p24',
    'Grenal decisivo pela Copa do Brasil',
    'Gremio e Internacional se enfrentam nas quartas da Copa do Brasil. Classico gaucho em fase eliminatoria e raro e intenso.',
    'noticia',
    undefined,
    ['grenal', 'gremio', 'internacional', 'copa-do-brasil', 'classico'],
    undefined,
    undefined,
    'Copa do Brasil',
    'titular',
    'dias',
    'verde',
    { atualidade: 95, debate: 90, originalidade: 65, emocao: 95, versatilidade: 82, vidaUtil: 60, potencialVisual: 88, profundidade: 72 },
    true,
    '2026-08-05T08:00:00Z',
    '2026-08-11T10:00:00Z',
    'Classico em mata-mata. Cobertura especial obrigatoria.',
  ),
  // p25 - BASE level
  makePauta(
    'p25',
    'O impacto economico do futebol brasileiro nas cidades',
    'Estudo sobre como os jogos e clubes impactam a economia local das cidades-sede.',
    'pauta-fria',
    undefined,
    ['economia', 'impacto-social', 'cidades', 'futebol-brasileiro'],
    undefined,
    undefined,
    undefined,
    'base',
    'evergreen',
    'azul',
    { atualidade: 35, debate: 45, originalidade: 80, emocao: 40, versatilidade: 55, vidaUtil: 95, potencialVisual: 50, profundidade: 90 },
    false,
    '2026-07-15T08:00:00Z',
    '2026-08-01T10:00:00Z',
    'Pauta de profundidade. Requer pesquisa extensa.',
  ),
  // p26 - BOA PAUTA level
  makePauta(
    'p26',
    'Futebol feminino brasileiro: avancos e desafios em 2026',
    'Panorama do futebol feminino no Brasil, incluindo investimentos crescentes e barreiras persistentes.',
    'pauta-fria',
    undefined,
    ['futebol-feminino', 'igualdade', 'investimento', 'visibilidade'],
    undefined,
    undefined,
    undefined,
    'banco',
    'evergreen',
    'azul',
    { atualidade: 65, debate: 78, originalidade: 75, emocao: 72, versatilidade: 68, vidaUtil: 88, potencialVisual: 62, profundidade: 78 },
    true,
    '2026-08-09T08:00:00Z',
    '2026-08-11T06:00:00Z',
    'Tema importante e pouco explorado. Priorizar.',
  ),
  // p27 - BANCO level
  makePauta(
    'p27',
    'Metricas avancadas: o que xG, PPDA e pressing index dizem sobre seu time',
    'Guia educativo sobre as metricas avancadas do futebol moderno e como interpreta-las.',
    'pauta-fria',
    undefined,
    ['metricas', 'xg', 'dados', 'analise', 'educativo'],
    undefined,
    undefined,
    undefined,
    'base',
    'evergreen',
    'azul',
    { atualidade: 45, debate: 55, originalidade: 72, emocao: 35, versatilidade: 68, vidaUtil: 95, potencialVisual: 65, profundidade: 90 },
    false,
    '2026-08-04T08:00:00Z',
    '2026-08-08T08:00:00Z',
    'Conteudo educativo. Pode virar serie.',
  ),
  // p28 - OTIMA OPCAO level
  makePauta(
    'p28',
    'Apostas esportivas e o risco de manipulacao no futebol brasileiro',
    'Investigacao sobre o crescimento das bets e os riscos de corrupcao no esporte.',
    'investigacao',
    undefined,
    ['bets', 'apostas', 'corrupcao', 'investigacao', 'etica'],
    undefined,
    undefined,
    'Brasileirao',
    'vestiario',
    'longo',
    'vermelho',
    { atualidade: 85, debate: 90, originalidade: 82, emocao: 70, versatilidade: 75, vidaUtil: 85, potencialVisual: 60, profundidade: 92 },
    true,
    '2026-08-02T08:00:00Z',
    '2026-08-10T14:00:00Z',
    'Materia investigativa. Revisar com assessoria juridica.',
  ),
  // p29 - BASE level
  makePauta(
    'p29',
    'Bastidores do futebol: a vida dos profissionais nos bastidores',
    'Serie sobre as profissoes que sustentam o futebol alem dos jogadores: olheiros, preparadores, roupeiros.',
    'pauta-fria',
    undefined,
    ['bastidores', 'profissoes', 'serie', 'humanizacao'],
    undefined,
    undefined,
    undefined,
    'base',
    'evergreen',
    'azul',
    { atualidade: 30, debate: 40, originalidade: 82, emocao: 70, versatilidade: 65, vidaUtil: 95, potencialVisual: 60, profundidade: 78 },
    false,
    '2026-07-22T08:00:00Z',
    '2026-08-03T10:00:00Z',
    'Serie evergreen. Produzir um episodio por mes.',
  ),
  // p30 - BANCO level
  makePauta(
    'p30',
    'Tendencia tatica: a linha de 3 zagueiros no futebol brasileiro',
    'Analise sobre a adocao crescente de formacoes com tres zagueiros no Brasileirao 2026.',
    'analise',
    undefined,
    ['tatica', 'formacao', '3-zagueiros', 'tendencia', 'brasileirao'],
    undefined,
    undefined,
    'Brasileirao',
    'banco',
    'longo',
    'azul',
    { atualidade: 60, debate: 65, originalidade: 70, emocao: 40, versatilidade: 62, vidaUtil: 78, potencialVisual: 55, profundidade: 82 },
    false,
    '2026-08-01T08:00:00Z',
    '2026-08-07T08:00:00Z',
    'Atualizar com exemplos de cada rodada.',
  ),
];

// --- Ideias (50) ---

const ideias: Ideia[] = [
  { id: 'i-001', texto: 'Flamengo pode montar o melhor ataque da historia do Brasileirao?', titulo: 'Ataque historico do Flamengo', tags: ['flamengo', 'ataque', 'brasileirao'], clube: 'Flamengo', competicao: 'Brasileirao', criadaEm: '2026-08-11T06:00:00Z', favorita: true, promovida: false },
  { id: 'i-002', texto: 'O que acontece com os jogadores que saem do Brasil e fracassam na Europa? Historias de retorno.', titulo: 'Fracassos na Europa', tags: ['europa', 'retorno', 'carreira'], criadaEm: '2026-08-10T22:00:00Z', favorita: false, promovida: false },
  { id: 'i-003', texto: 'Comparativo de salarios: quanto ganha um jogador de Serie A vs Serie B vs Serie C', titulo: 'Disparidade salarial', tags: ['salarios', 'comparativo', 'serie-a', 'serie-b'], criadaEm: '2026-08-10T20:00:00Z', favorita: true, promovida: false },
  { id: 'i-004', texto: 'Thread com todos os gols de bicicleta do Brasileirao 2026', titulo: 'Gols de bicicleta 2026', tags: ['gols', 'bicicleta', 'brasileirao'], criadaEm: '2026-08-10T18:00:00Z', favorita: false, promovida: false },
  { id: 'i-005', texto: 'Abel Ferreira e o tecnico mais vitorioso da historia do Palmeiras? Comparar com Luxemburgo e Felipao.', titulo: 'Abel vs lendas do Palmeiras', tags: ['palmeiras', 'abel-ferreira', 'historia'], clube: 'Palmeiras', criadaEm: '2026-08-10T16:00:00Z', favorita: true, promovida: false },
  { id: 'i-006', texto: 'Serie sobre os classicos mais violentos da historia do futebol brasileiro', titulo: 'Classicos violentos', tags: ['classicos', 'historia', 'violencia'], criadaEm: '2026-08-10T14:00:00Z', favorita: false, promovida: false },
  { id: 'i-007', texto: 'Corinthians pode ter a maior torcida do mundo? Pesquisa de dados globais.', titulo: 'Maior torcida do mundo', tags: ['corinthians', 'torcida', 'dados'], clube: 'Corinthians', criadaEm: '2026-08-10T12:00:00Z', favorita: false, promovida: false },
  { id: 'i-008', texto: 'Fazer um mapa interativo com todos os jogadores brasileiros espalhados pelo mundo', titulo: 'Mapa de brasileiros no exterior', tags: ['brasileiros', 'exterior', 'mapa', 'interativo'], criadaEm: '2026-08-10T10:00:00Z', favorita: true, promovida: false },
  { id: 'i-009', texto: 'Quanto custa ir ao estadio em 2026? Ingresso, transporte, alimentacao por cidade.', titulo: 'Custo de ir ao estadio', tags: ['estadio', 'custo', 'torcedor', 'economia'], criadaEm: '2026-08-10T08:00:00Z', favorita: true, promovida: false },
  { id: 'i-010', texto: 'Os 10 gols mais bonitos de cada decada do futebol brasileiro', titulo: 'Gols por decada', tags: ['gols', 'historia', 'ranking'], criadaEm: '2026-08-09T22:00:00Z', favorita: false, promovida: false },
  { id: 'i-011', texto: 'Jogadores que brilharam na Copinha e sumiram: onde estao agora?', titulo: 'Promessas da Copinha', tags: ['copinha', 'base', 'onde-estao'], criadaEm: '2026-08-09T20:00:00Z', favorita: false, promovida: false },
  { id: 'i-012', texto: 'Como a altitude afeta os jogos da Libertadores: ciencia e tatica', titulo: 'Altitude na Libertadores', tags: ['libertadores', 'altitude', 'ciencia', 'tatica'], competicao: 'Libertadores', criadaEm: '2026-08-09T18:00:00Z', favorita: true, promovida: false },
  { id: 'i-013', texto: 'O papel das redes sociais na carreira dos jogadores: marketing pessoal vs foco no campo', titulo: 'Jogadores e redes sociais', tags: ['redes-sociais', 'marketing', 'comportamento'], criadaEm: '2026-08-09T16:00:00Z', favorita: false, promovida: false },
  { id: 'i-014', texto: 'Ranking dos melhores narradores da historia da TV brasileira', titulo: 'Melhores narradores', tags: ['narradores', 'tv', 'ranking', 'historia'], criadaEm: '2026-08-09T14:00:00Z', favorita: true, promovida: false },
  { id: 'i-015', texto: 'Fluminense e a tradicao de revelar meias: de Rivellino a Ganso a Martinelli', titulo: 'Meias do Fluminense', tags: ['fluminense', 'meias', 'historia', 'formacao'], clube: 'Fluminense', criadaEm: '2026-08-09T12:00:00Z', favorita: false, promovida: false },
  { id: 'i-016', texto: 'Os uniformes mais bonitos do futebol brasileiro em 2026', titulo: 'Uniformes 2026', tags: ['uniformes', 'design', 'moda', 'ranking'], criadaEm: '2026-08-09T10:00:00Z', favorita: false, promovida: false },
  { id: 'i-017', texto: 'Como funciona o fair play financeiro na Europa e por que o Brasil nao tem algo similar', titulo: 'Fair play financeiro', tags: ['financas', 'fair-play', 'europa', 'regulacao'], criadaEm: '2026-08-09T08:00:00Z', favorita: true, promovida: false },
  { id: 'i-018', texto: 'Atletico-MG pos-Hulk: como o Galo se reinventa sem seu maior idolo recente', titulo: 'Atletico pos-Hulk', tags: ['atletico-mg', 'hulk', 'reconstrucao'], clube: 'Atletico-MG', jogador: 'Hulk', criadaEm: '2026-08-08T22:00:00Z', favorita: false, promovida: true, pautaId: 'p19' },
  { id: 'i-019', texto: 'Os tecnicos estrangeiros que deram certo e os que fracassaram no Brasil', titulo: 'Tecnicos estrangeiros', tags: ['tecnicos', 'estrangeiros', 'historia', 'analise'], criadaEm: '2026-08-08T20:00:00Z', favorita: true, promovida: false },
  { id: 'i-020', texto: 'Serie: O dia a dia de um arbitro de futebol no Brasil', titulo: 'Rotina do arbitro', tags: ['arbitragem', 'bastidores', 'serie'], criadaEm: '2026-08-08T18:00:00Z', favorita: false, promovida: false },
  { id: 'i-021', texto: 'As torcidas organizadas mais poderosas do Brasil: influencia politica e social', titulo: 'Torcidas organizadas', tags: ['torcidas', 'organizadas', 'politica', 'social'], criadaEm: '2026-08-08T16:00:00Z', favorita: false, promovida: false },
  { id: 'i-022', texto: 'Palmeiras pode ser o primeiro clube brasileiro a valer 1 bilhao de dolares?', titulo: 'Palmeiras bilionario', tags: ['palmeiras', 'valor', 'financas', 'negocios'], clube: 'Palmeiras', criadaEm: '2026-08-08T14:00:00Z', favorita: true, promovida: false },
  { id: 'i-023', texto: 'O futebol de varzea esta morrendo? Reportagem sobre campos que estao desaparecendo', titulo: 'Futebol de varzea', tags: ['varzea', 'amador', 'cultura', 'urbanismo'], criadaEm: '2026-08-08T12:00:00Z', favorita: true, promovida: false },
  { id: 'i-024', texto: 'Como o Botafogo montou o elenco mais caro do futebol brasileiro', titulo: 'Elenco do Botafogo', tags: ['botafogo', 'elenco', 'investimento', 'saf'], clube: 'Botafogo', criadaEm: '2026-08-08T10:00:00Z', favorita: false, promovida: true, pautaId: 'p10' },
  { id: 'i-025', texto: 'Os jogadores mais subestimados do Brasileirao 2026', titulo: 'Jogadores subestimados', tags: ['brasileirao', 'jogadores', 'subestimados', 'ranking'], competicao: 'Brasileirao', criadaEm: '2026-08-08T08:00:00Z', favorita: false, promovida: false },
  { id: 'i-026', texto: 'Qual o impacto das enchentes do RS no futebol gaucho? Gremio e Inter ainda sentem?', titulo: 'Enchentes e futebol gaucho', tags: ['rio-grande-do-sul', 'enchentes', 'gremio', 'internacional'], criadaEm: '2026-08-07T22:00:00Z', favorita: true, promovida: false },
  { id: 'i-027', texto: 'Serie sobre comidas tipicas dos estadios brasileiros: do churrasquinho ao acaraje', titulo: 'Gastronomia nos estadios', tags: ['gastronomia', 'estadios', 'cultura', 'serie'], criadaEm: '2026-08-07T20:00:00Z', favorita: false, promovida: false },
  { id: 'i-028', texto: 'O que os dados dizem sobre penaltis: chutar forte ou colocar? Lado esquerdo ou direito?', titulo: 'Ciencia dos penaltis', tags: ['penaltis', 'dados', 'ciencia', 'estatistica'], criadaEm: '2026-08-07T18:00:00Z', favorita: true, promovida: false },
  { id: 'i-029', texto: 'Santos pode voltar a ser protagonista nacional? Analise do projeto esportivo', titulo: 'Projeto Santos', tags: ['santos', 'projeto', 'reconstrucao'], clube: 'Santos', criadaEm: '2026-08-07T16:00:00Z', favorita: false, promovida: true, pautaId: 'p7' },
  { id: 'i-030', texto: 'Os laterais mais ofensivos do Brasileirao: quem corre mais e quem da mais assistencias', titulo: 'Laterais ofensivos', tags: ['laterais', 'estatistica', 'brasileirao', 'tatica'], competicao: 'Brasileirao', criadaEm: '2026-08-07T14:00:00Z', favorita: false, promovida: false },
  { id: 'i-031', texto: 'Brasileiros na Champions League 2026-27: quem sao e o que esperar', titulo: 'Brasileiros na Champions', tags: ['champions-league', 'brasileiros', 'europa'], competicao: 'Champions League', criadaEm: '2026-08-07T12:00:00Z', favorita: true, promovida: false },
  { id: 'i-032', texto: 'O que a inteligencia artificial esta mudando no futebol: do scouting a preparacao fisica', titulo: 'IA no futebol', tags: ['tecnologia', 'ia', 'inovacao', 'scouting'], criadaEm: '2026-08-07T10:00:00Z', favorita: false, promovida: false },
  { id: 'i-033', texto: 'Dez jogadores que poderiam estar na Europa mas preferiram ficar no Brasil', titulo: 'Ficaram no Brasil', tags: ['jogadores', 'mercado', 'escolha', 'brasil'], criadaEm: '2026-08-07T08:00:00Z', favorita: false, promovida: false },
  { id: 'i-034', texto: 'Copa do Nordeste: o campeonato que mais cresce no Brasil', titulo: 'Copa do Nordeste cresce', tags: ['copa-do-nordeste', 'nordeste', 'crescimento'], competicao: 'Copa do Nordeste', criadaEm: '2026-08-06T22:00:00Z', favorita: false, promovida: false },
  { id: 'i-035', texto: 'Ranking dos melhores goleiros do Brasileirao 2026 por estatisticas avancadas', titulo: 'Melhores goleiros 2026', tags: ['goleiros', 'ranking', 'estatistica', 'brasileirao'], competicao: 'Brasileirao', criadaEm: '2026-08-06T20:00:00Z', favorita: true, promovida: false },
  { id: 'i-036', texto: 'A influencia do futebol argentino na tatica dos times brasileiros', titulo: 'Influencia argentina', tags: ['argentina', 'tatica', 'influencia', 'tendencia'], criadaEm: '2026-08-06T18:00:00Z', favorita: false, promovida: false },
  { id: 'i-037', texto: 'Por que o Corinthians sempre lota a Arena mesmo em ma fase?', titulo: 'Fiel e a Arena', tags: ['corinthians', 'torcida', 'arena', 'fidelidade'], clube: 'Corinthians', criadaEm: '2026-08-06T16:00:00Z', favorita: true, promovida: false },
  { id: 'i-038', texto: 'Os filhos de jogadores famosos que estao surgindo no futebol brasileiro', titulo: 'Filhos de craques', tags: ['filhos', 'heranca', 'base', 'curiosidade'], criadaEm: '2026-08-06T14:00:00Z', favorita: false, promovida: false },
  { id: 'i-039', texto: 'Especial: Os 100 maiores gols da historia do futebol brasileiro', titulo: '100 maiores gols', tags: ['gols', 'historia', 'ranking', 'especial'], criadaEm: '2026-08-06T12:00:00Z', favorita: true, promovida: false },
  { id: 'i-040', texto: 'Existe racismo no futebol brasileiro? Dados e depoimentos de jogadores', titulo: 'Racismo no futebol', tags: ['racismo', 'preconceito', 'social', 'depoimentos'], criadaEm: '2026-08-06T10:00:00Z', favorita: true, promovida: false },
  { id: 'i-041', texto: 'Os melhores duelos individuais do Brasileirao 2026: quem vence quem', titulo: 'Duelos individuais', tags: ['duelos', 'brasileirao', 'jogadores', 'confronto'], competicao: 'Brasileirao', criadaEm: '2026-08-06T08:00:00Z', favorita: false, promovida: false },
  { id: 'i-042', texto: 'Calendario impossivel: como os times brasileiros lidam com tantos jogos', titulo: 'Calendario cheio', tags: ['calendario', 'desgaste', 'gestao', 'elenco'], criadaEm: '2026-08-05T22:00:00Z', favorita: false, promovida: false },
  { id: 'i-043', texto: 'O crescimento do futsal brasileiro e sua relacao com o futebol de campo', titulo: 'Futsal e futebol', tags: ['futsal', 'formacao', 'relacao', 'cultura'], criadaEm: '2026-08-05T20:00:00Z', favorita: false, promovida: false },
  { id: 'i-044', texto: 'Musicas e cantos de torcida: a trilha sonora dos estadios brasileiros', titulo: 'Cantos de torcida', tags: ['torcida', 'musica', 'cultura', 'estadio'], criadaEm: '2026-08-05T18:00:00Z', favorita: true, promovida: false },
  { id: 'i-045', texto: 'Vasco e a maior torcida do Nordeste? Fenomeno da expansao vascaina', titulo: 'Vasco no Nordeste', tags: ['vasco', 'torcida', 'nordeste', 'expansao'], clube: 'Vasco', criadaEm: '2026-08-05T16:00:00Z', favorita: false, promovida: false },
  { id: 'i-046', texto: 'O que mudou no futebol brasileiro desde a lei da SAF: 3 anos depois', titulo: 'SAF: 3 anos depois', tags: ['saf', 'lei', 'gestao', 'mudanca'], criadaEm: '2026-08-05T14:00:00Z', favorita: true, promovida: true, pautaId: 'p16' },
  { id: 'i-047', texto: 'Os recordes que podem ser quebrados no Brasileirao 2026', titulo: 'Recordes em jogo', tags: ['recordes', 'brasileirao', 'historia', 'estatistica'], competicao: 'Brasileirao', criadaEm: '2026-08-05T12:00:00Z', favorita: false, promovida: false },
  { id: 'i-048', texto: 'Debate: O Brasileirao deveria ter menos times? Analise de formatos', titulo: 'Formato do Brasileirao', tags: ['formato', 'brasileirao', 'debate', 'proposta'], criadaEm: '2026-08-05T10:00:00Z', favorita: false, promovida: false },
  { id: 'i-049', texto: 'Os jogadores mais caros da historia de cada clube brasileiro da Serie A', titulo: 'Contratacoes recordes', tags: ['contratacoes', 'recordes', 'historia', 'serie-a'], criadaEm: '2026-08-05T08:00:00Z', favorita: true, promovida: false },
  { id: 'i-050', texto: 'Como a Copa do Mundo de 2026 nos EUA vai impactar o futebol brasileiro', titulo: 'Copa 2026 e impacto no Brasil', tags: ['copa-do-mundo', '2026', 'eua', 'impacto'], competicao: 'Copa do Mundo', criadaEm: '2026-08-04T22:00:00Z', favorita: true, promovida: false },
];

// --- Radar Items ---

const radarItems: RadarItem[] = [
  { id: 'r-001', assunto: 'Estevao no Manchester City', categoria: 'explodindo', tags: ['estevao', 'palmeiras', 'city', 'transferencia'], criadoEm: '2026-08-11T06:00:00Z' },
  { id: 'r-002', assunto: 'Gabigol e o retorno ao Flamengo', categoria: 'explodindo', tags: ['gabigol', 'flamengo', 'retorno'], criadoEm: '2026-08-10T18:00:00Z' },
  { id: 'r-003', assunto: 'Convocacao da Selecao para Eliminatorias', categoria: 'explodindo', tags: ['selecao', 'convocacao', 'eliminatorias'], criadoEm: '2026-08-10T14:00:00Z' },
  { id: 'r-004', assunto: 'Semifinais da Libertadores', categoria: 'crescendo', tags: ['libertadores', 'semifinal'], criadoEm: '2026-08-09T10:00:00Z' },
  { id: 'r-005', assunto: 'Crise no Sao Paulo', categoria: 'crescendo', tags: ['sao-paulo', 'crise', 'tecnico'], criadoEm: '2026-08-08T22:00:00Z' },
  { id: 'r-006', assunto: 'Grenal pela Copa do Brasil', categoria: 'crescendo', tags: ['grenal', 'copa-do-brasil', 'classico'], criadoEm: '2026-08-08T08:00:00Z' },
  { id: 'r-007', assunto: 'Aposentadoria do Hulk', categoria: 'crescendo', tags: ['hulk', 'atletico-mg', 'aposentadoria'], criadoEm: '2026-08-09T12:00:00Z' },
  { id: 'r-008', assunto: 'Vinicius Jr The Best', categoria: 'estavel', tags: ['vinicius-jr', 'the-best', 'premio'], criadoEm: '2026-08-01T18:00:00Z' },
  { id: 'r-009', assunto: 'Polemica do VAR na rodada', categoria: 'esfriando', tags: ['var', 'arbitragem', 'polemica'], criadoEm: '2026-07-30T22:00:00Z' },
  { id: 'r-010', assunto: 'Botafogo na lideranca do Brasileirao', categoria: 'estavel', tags: ['botafogo', 'brasileirao', 'lideranca'], criadoEm: '2026-07-29T10:00:00Z' },
  { id: 'r-011', assunto: 'Apostas esportivas e corrupcao', categoria: 'monitorar', tags: ['bets', 'corrupcao', 'investigacao'], criadoEm: '2026-08-02T08:00:00Z' },
  { id: 'r-012', assunto: 'Fechamento da janela de transferencias', categoria: 'crescendo', tags: ['janela', 'transferencias', 'mercado'], criadoEm: '2026-08-10T06:00:00Z' },
  { id: 'r-013', assunto: 'Endrick no Real Madrid', categoria: 'monitorar', tags: ['endrick', 'real-madrid'], criadoEm: '2026-07-28T08:00:00Z' },
  { id: 'r-014', assunto: 'Futebol feminino: Brasileirao Feminino', categoria: 'monitorar', tags: ['futebol-feminino', 'brasileirao-feminino'], criadoEm: '2026-08-09T08:00:00Z' },
  { id: 'r-015', assunto: 'Premier League nova temporada', categoria: 'estavel', tags: ['premier-league', 'abertura'], criadoEm: '2026-08-08T08:00:00Z' },
];

// --- Vozes Editoriais (Mesa Redonda) ---

const vozesEditoriais: VozEditorial[] = [
  { id: 've-001', nome: 'O Treinador', icone: 'clipboard', descricao: 'Visao tatica e estrategica. Analisa formacoes, movimentacoes e decisoes tecnicas com profundidade.', cor: '#3B82F6' },
  { id: 've-002', nome: 'O Torcedor', icone: 'heart', descricao: 'Fala com a paixao e emocao da arquibancada. Representa o sentimento popular.', cor: '#EF4444' },
  { id: 've-003', nome: 'O Analista', icone: 'bar-chart', descricao: 'Opiniao baseada em dados e estatisticas. Usa metricas avancadas para fundamentar argumentos.', cor: '#22C55E' },
  { id: 've-004', nome: 'O Provocador', icone: 'zap', descricao: 'Opinioes polemicas e provocativas para gerar debate. Advogado do diabo.', cor: '#F59E0B' },
  { id: 've-005', nome: 'O Historiador', icone: 'book-open', descricao: 'Contextualiza fatos atuais com precedentes historicos. Traz a memoria do futebol.', cor: '#8B5CF6' },
  { id: 've-006', nome: 'O Repórter', icone: 'mic', descricao: 'Foco em informacao e bastidores. Traz fatos exclusivos e apuracao rigorosa.', cor: '#06B6D4' },
];

// --- Navegacao ---

const navItems: NavItem[] = [
  { id: 'nav-dashboard', label: 'Dashboard', icon: 'layout-dashboard', href: '/' },
  { id: 'nav-pautas', label: 'Pautas', icon: 'newspaper', href: '/pautas', badge: String(pautas.length) },
  { id: 'nav-ideias', label: 'Ideias', icon: 'lightbulb', href: '/ideias', badge: String(ideias.length) },
  { id: 'nav-radar', label: 'Radar', icon: 'radar', href: '/radar' },
  { id: 'nav-calendario', label: 'Calendario', icon: 'calendar', href: '/calendario' },
  { id: 'nav-mesa-redonda', label: 'Mesa Redonda', icon: 'users', href: '/mesa-redonda' },
  { id: 'nav-conteudos', label: 'Conteudos', icon: 'file-text', href: '/conteudos' },
  { id: 'nav-configuracoes', label: 'Configuracoes', icon: 'settings', href: '/configuracoes' },
];

// --- Aliased exports for store compatibility ---
export { pautas as demoPautas, ideias as demoIdeias, radarItems as demoRadarItems, vozesEditoriais, navItems };

// --- Export Functions ---

export function getAllPautas(): Pauta[] {
  return pautas;
}

export function getAllIdeias(): Ideia[] {
  return ideias;
}

export function getRadarItems(): RadarItem[] {
  return radarItems;
}

export function getVozesEditoriais(): VozEditorial[] {
  return vozesEditoriais;
}

export function getNavItems(): NavItem[] {
  return navItems;
}

// --- Additional utility exports ---

export function getPautaById(id: string): Pauta | undefined {
  return pautas.find((p) => p.id === id);
}

export function getIdeiaById(id: string): Ideia | undefined {
  return ideias.find((i) => i.id === id);
}

export function getPautasByStatus(status: PautaStatus): Pauta[] {
  return pautas.filter((p) => p.status === status);
}

export function getPautasByClube(clube: string): Pauta[] {
  return pautas.filter((p) => p.clube === clube);
}

export function getPautasFavoritas(): Pauta[] {
  return pautas.filter((p) => p.favorita);
}

export function getIdeiasFavoritas(): Ideia[] {
  return ideias.filter((i) => i.favorita);
}

export function getIdeiasPromovidas(): Ideia[] {
  return ideias.filter((i) => i.promovida);
}
