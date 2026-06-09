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

## Deploy na Vercel

O app fica em um subdiretório do monorepo. **Sem as duas configurações abaixo, a Vercel retorna 404.**

1. **Production Branch** (Settings → Git → Production Branch):  
   `submission/jean-felipe` **ou** `main` (após merge da submissão no fork)  
   > A branch `main` do fork **não** contém o app até o merge — deploy em `main` sem código = 404.
2. **Root Directory** (Settings → General):  
   `submissions/jean-felipe/solution/rotadesk`
3. **Environment Variables** (Settings → Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`
4. **Build Command:** `npm run build` (padrão)
5. Redeploy após salvar branch, root directory e variáveis.

### Build OK mas 404 na URL?

O erro `404 NOT_FOUND` com ID `gru1::...` é da **plataforma Vercel** (não do Next.js). Se o build passou:

1. **Deployments** → abra o deploy com ✓ Ready → clique **Visit** (use essa URL, não um domínio antigo).
2. Se só o preview abre: **⋯ → Promote to Production**.
3. **Settings → General → Root Directory** deve ser exatamente `submissions/jean-felipe/solution/rotadesk` (sem `/` no final).
4. Desative **Include files outside the root directory** (não é necessário para este app).

> **Limitação:** o classificador sklearn roda via Python local (`ml/classify.py`). Na Vercel serverless o triagem sklearn **não funciona** — ack, dashboard, kanban e chat com LLM sim. Para demo completa, use `npm run dev` local.

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
