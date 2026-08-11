// ============================================================
// RDT Central de Criacao - Type Definitions
// ============================================================

// --- Status e enums ---

export type PautaStatus =
  | 'ideia'
  | 'vestiario'
  | 'titular'
  | 'banco'
  | 'base'
  | 'observacao'
  | 'dispensada'
  | 'arquivada';

export type VidaUtil =
  | 'minutos'
  | 'horas'
  | 'hoje'
  | 'dias'
  | 'longo'
  | 'evergreen';

export type Semaforo = 'verde' | 'amarelo' | 'vermelho' | 'azul';

export type ContentStatus =
  | 'ideia'
  | 'desenvolvimento'
  | 'pronto-criar'
  | 'criando'
  | 'revisao'
  | 'pronto'
  | 'planejado'
  | 'publicado';

export type AnguloDeTipo =
  | 'jornalistico'
  | 'analitico'
  | 'tatico'
  | 'provocador'
  | 'emocional'
  | 'historico'
  | 'humor'
  | 'torcedor'
  | 'contraponto'
  | 'curiosidade'
  | 'personagem'
  | 'dados'
  | 'pergunta'
  | 'comparacao'
  | 'storytelling';

export type Prioridade = 'alta' | 'media' | 'baixa';

export type CategoriaRadar =
  | 'explodindo'
  | 'crescendo'
  | 'monitorar'
  | 'estavel'
  | 'esfriando';

// --- Atributos da Pauta ---

export interface PautaAttributes {
  atualidade: number;       // 0-100
  debate: number;           // 0-100
  originalidade: number;    // 0-100
  emocao: number;           // 0-100
  versatilidade: number;    // 0-100
  vidaUtil: number;         // 0-100
  potencialVisual: number;  // 0-100
  profundidade: number;     // 0-100
}

// --- Pauta (Pauta-Mae) ---

export interface Pauta {
  id: string;
  titulo: string;
  descricao: string;
  origem: string;
  fonteUrl?: string;
  tags: string[];
  clube?: string;
  jogador?: string;
  competicao?: string;
  status: PautaStatus;
  vidaUtil: VidaUtil;
  semaforo: Semaforo;
  atributos: PautaAttributes;
  overall: number;
  favorita: boolean;
  criadaEm: string;
  atualizadaEm: string;
  notas: string;
  angulos: Angulo[];
  conteudos: ConteudoDerivado[];
}

// --- Ideia ---

export interface Ideia {
  id: string;
  texto: string;
  titulo?: string;
  notas?: string;
  link?: string;
  fonte?: string;
  categoria?: string;
  tags: string[];
  clube?: string;
  jogador?: string;
  competicao?: string;
  criadaEm: string;
  favorita: boolean;
  promovida: boolean;
  pautaId?: string;
}

// --- Angulo ---

export interface Angulo {
  id: string;
  pautaId: string;
  tipo: AnguloDeTipo;
  titulo: string;
  resumo: string;
  porqueFunciona: string;
  formatos: string[];
  plataformas: string[];
  favorito: boolean;
  aprovado: boolean;
  descartado: boolean;
}

// --- Conteudo Derivado ---

export interface ConteudoDerivado {
  id: string;
  pautaId: string;
  anguloId?: string;
  nome: string;
  formato: string;
  destino: string;
  status: ContentStatus;
  prioridade: Prioridade;
  observacoes: string;
  conteudo?: string;
  criadoEm: string;
}

// --- Voz Editorial (Mesa Redonda) ---

export interface VozEditorial {
  id: string;
  nome: string;
  icone: string;
  descricao: string;
  cor: string;
}

// --- Radar Item ---

export interface RadarItem {
  id: string;
  assunto: string;
  categoria: CategoriaRadar;
  tags: string[];
  criadoEm: string;
}

// --- Navegacao ---

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: string;
}
