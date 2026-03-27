# DevRoast 🔥

> Cole seu código. Tome um roast.
DevRoast é uma ferramenta de code review onde desenvolvedores submetem trechos de código e recebem avaliações sarcásticas e honestas, com notas de 0 a 10.
> 
## Screenshots

#### Homepage
<img width="1350" height="645" alt="image" src="https://github.com/user-attachments/assets/7f5141cc-86cf-46fb-bf00-5639dfc2f9a7" />

<br>

#### Results
<img width="1351" height="644" alt="image" src="https://github.com/user-attachments/assets/4c18da71-e4f6-4306-a5e2-b93a1fae40d7" />
<img width="1344" height="639" alt="image" src="https://github.com/user-attachments/assets/54cce7f9-0873-4f24-801a-9c8504bfd98c" />

<br>

#### Image for share
<img width="1327" height="640" alt="image" src="https://github.com/user-attachments/assets/91515ec4-82f1-468f-af57-0e509d04f3a5" />

<br>

#### Leaderboard
<img width="1347" height="643" alt="image" src="https://github.com/user-attachments/assets/7a4a6011-d1d6-42b2-9cca-1de152cb743b" />

## Funcionalidades
- **Análise por IA** - A API do Groq analisa seu código e entrega feedback honesto
- **Modos de Review** - Escolha entre "Brutal" (sarcasmo máximo) ou "Friendly" (crítica construtiva)
- **Shame Leaderboard** - Veja os piores códigos da internet, ranqueados por vergonha
- **Compartilhamento** - Gere imagens OpenGraph para compartilhar seu roast nas redes sociais
- **Suporte a Múltiplas Linguagens** - Detecção automática de JavaScript, Python, TypeScript, C, C++ e mais
## Demo
🔗 [https://devroast-beryl.vercel.app](https://devroast-beryl.vercel.app)
## Tecnologias
- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **IA:** Groq API (Llama 3.3 70B)
- **Banco de Dados:** PostgreSQL (Neon)
- **API:** tRPC, Drizzle ORM
## Como Executar
### Pré-requisitos
- Node.js 18+
- PostgreSQL (local ou Neon)
- Chave da API do Groq
### Variáveis de Ambiente
```env
DATABASE_URL=postgresql://...
GROQ_API_KEY=sua_chave_groq

Instalação:
npm install
npm run dev

Licença:
MIT
