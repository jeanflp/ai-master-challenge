# RotaDesk — API do classificador (Render)

TF-IDF + regressão logística (DS2), exposta via **FastAPI** para o Next.js em produção (Vercel não roda Python).

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/health` | Status + se `pipeline.joblib` existe |
| POST | `/classify` | Body: `{"text": "..."}` → `topic_group`, `confidence`, `probabilities` |

## Modelo

```bash
pip install -r requirements.txt
python train_export.py   # gera pipeline.joblib (~5 MB) — precisa do CSV do DS2
```

O `pipeline.joblib` deve existir na pasta `ml/` antes do deploy (commitado ou gerado no build).

## Deploy no Render

1. [render.com](https://render.com) → **New** → **Blueprint** (ou Web Service)
2. Conecte o repo `jeanflp/ai-master-challenge`
3. **Root Directory:** `submissions/jean-felipe/solution/rotadesk/ml`
4. **Runtime:** Python 3.11
5. **Build:** `pip install -r requirements.txt`
6. **Start:** `uvicorn api:app --host 0.0.0.0 --port $PORT`
7. Confirme que `pipeline.joblib` está no repositório (ou adicione ao build se tiver dataset)

Ou use o `render.yaml` na raiz do repo (Render detecta automaticamente no push).

## Vercel (Next.js)

No `.env.local` / Environment Variables da Vercel:

```
CLASSIFIER_API_URL=https://rotadesk-classifier.onrender.com
```

Sem essa variável, o app usa Python local (`spawn classify.py`) — só funciona em `npm run dev`.

## Teste local da API

```bash
pip install -r requirements.txt
uvicorn api:app --reload --port 8000
curl -X POST http://localhost:8000/classify -H "Content-Type: application/json" -d "{\"text\": \"VPN not working\"}"
```
