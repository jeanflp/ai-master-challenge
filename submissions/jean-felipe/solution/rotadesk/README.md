# RotaDesk — Protótipo Challenge 002

Suporte inteligente com **ack automático**, **triagem sklearn**, **LLM (gpt-4o-mini)** para baixa confiança, rascunhos e RAG.

Baseado em `../automacao/PROPOSTA.md` e `../automacao/fluxo.md`.

## Stack

- Next.js 16 + React 19 + Tailwind CSS v4
- Supabase (PostgreSQL)
- scikit-learn (TF-IDF + Logistic Regression, DS2)
- OpenAI gpt-4o-mini

## Setup

### 1. Dependências

```bash
npm install
pip install -r ml/requirements.txt
python ml/train_export.py
```

### 2. Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Rode a migration `supabase/migrations/001_initial.sql` no SQL Editor
3. Copie `.env.local.example` → `.env.local` e preencha as chaves

### 3. Executar

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000)

## Páginas

| Rota | Função |
|------|--------|
| `/` | Dashboard — métricas, gráficos, últimos tickets |
| `/simulador` | Criar tickets como cliente (fluxo completo) |
| `/chat` | Atendimento simulado + rascunho RAG + resolver com IA |
| `/kanban` | Acompanhar chamados por status |

## Fluxo de ticket

1. **Ack** imediato + `first_response_at`
2. **Classificação** sklearn (`ml/pipeline.joblib`)
3. Se confiança **&lt; 85%** → **gpt-4o-mini** reclassifica
4. **Regras DS1**: Refund, Cancellation, Critical → humano obrigatório
5. **Administrative rights** → revisão humana
6. Roteamento para fila Supabase

## Threshold

Confiança mínima para auto-roteamento: **85%** (`src/lib/constants.ts`).
