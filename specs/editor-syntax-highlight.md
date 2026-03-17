# Editor com Syntax Highlight - Especificação

## Visão Geral

Implementar um editor de código na homepage do DevRoast com:
- Syntax highlight em tempo real usando shiki
- Detecção automática de linguagem usando highlight.js
- Seleção manual de linguagem via dropdown
- Interface similar ao Ray-So (textarea sobreposta ao código highlightado)

## Decisões de Implementação

| Decisão | Opção Escolhida | Justificativa |
|---------|------------------|---------------|
| Biblioteca de highlighting | shiki | Já instalado no projeto (v4.0.2) |
| Detecção automática | highlight.js | Mesma abordagem do Ray-So, ~30KB extra |
| Interface do editor | Texarea sobreposta | Mesma experiência do Ray-So |
| Linguagens | Todas que shiki suporta | ~100 linguagens |

## Stack Adicional

```json
{
  "highlight.js": "^11.x"
}
```

## Arquitetura

### Componentes a Criar/Modificar

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `src/components/ui/language-selector.tsx` | Criar | Dropdown para seleção de linguagem |
| `src/components/ui/code-editor.tsx` | Modificar | Adicionar syntax highlight + textarea sobreposta |
| `src/lib/detect-language.ts` | Criar | Função de detecção usando highlight.js |
| `src/lib/languages.ts` | Criar | Lista de linguagens suportadas (similar Ray-So) |
| `src/app/page.tsx` | Modificar | Integrar novo editor |

### Arquitetura do Editor (Ray-So Style)

```
┌─────────────────────────────────────────┐
│  [Mac Window Dots]        [filename?]   │  <- Window Header (existente)
├─────────────────────────────────────────┤
│  [Language Selector: ▼ JavaScript  ]   │  <- Header com selector
├─────────────────────────────────────────┤
│ 1 │ const foo = "bar";          │      │
│ 2 │ function hello() {          │      │  <- HighlightedCode (shiki)
│ 3 │   return foo;               │      │
│   │                             │      │
│   │  textarea transparente     │      │  <- Textarea (edição)
│   │  sobreposta ao código      │      │
│   │                             │      │
└─────────────────────────────────────────┘
```

### Fluxo de Dados

1. Usuário cola/edita código na textarea
2. `onChange` dispara detecção de linguagem (debounced)
3. highlight.js detecta a linguagem
4. shiki renderiza o código com syntax highlight
5. Código highlightado aparece atrás da textarea transparente

## Detalhes de Implementação

### 1. Highlight.js (Detecção)

```typescript
// src/lib/detect-language.ts
import hljs from 'highlight.js';

export function detectLanguage(code: string): string {
  const result = hljs.highlightAuto(code);
  return result.language || 'plaintext';
}
```

### 2. Shiki (Highlighting)

```typescript
// Usar createHighlighter com WASM para carregamento dinâmico
// Similar ao code.tsx do Ray-So
```

### 3. Editor Híbrido

- **HighlightedCode**: Componente que renderiza código com shiki (serve como background)
- **Textarea**: Posicionada absolutely sobre o código, com `background: transparent`, `color: transparent`, `caret-color: white`
- Ambos sincronizam scroll position

### 4. Language Selector

- Dropdown com ~100 linguagens (todas do shiki)
- Opção "Auto-Detect" como padrão
- Similar ao LanguageControl do Ray-So

## To-Dos

- [ ] Instalar highlight.js (`npm install highlight.js`)
- [ ] Criar `src/lib/detect-language.ts` - função de detecção
- [ ] Criar `src/lib/languages.ts` - lista de linguagens suportadas
- [ ] Criar `src/components/ui/language-selector.tsx` - dropdown de linguagens
- [ ] Modificar `src/components/ui/code-editor.tsx`:
  - [ ] Adicionar highlighter shiki (client-side)
  - [ ] Implementar camada de código highlightado
  - [ ] Implementar textarea sobreposta
  - [ ] Sincronizar scroll entre camadas
  - [ ] Adicionar language selector no header
- [ ] Modificar `src/app/page.tsx` para usar novo editor
- [ ] Testar detecção automática com código JS, Python, Rust, etc.
- [ ] Testar seleção manual de linguagem
- [ ] Executar `npm run check` e corrigir erros

## Questões em Aberto

1. **Performance**: Detecção automática em cada keystroke pode ser lenta. Considerar debounce de ~300ms.

2. **WASM Loading**: Shiki usa WASM para carregamento de linguagens. Decidir entre:
   - Carregar todas linguagens upfront (mais lento initially, rápido depois)
   - Carregar sob demanda (mais leve, delay ao trocar linguagem)

3. **Themes**: O shiki precisa de tema CSS. Verificar se o tema "vesper" usado no CodeBlock existente é adequado ou se precisamos de tema escuro (para o background #0A0A0A do DevRoast).

## Referências

- [Ray-So Editor.tsx](https://github.com/raycast/ray-so/blob/main/app/(navigation)/(code)/components/Editor.tsx)
- [Ray-So HighlightedCode.tsx](https://github.com/raycast/ray-so/blob/main/app/(navigation)/(code)/components/HighlightedCode.tsx)
- [Ray-So detectLanguage](https://github.com/raycast/ray-so/blob/main/app/(navigation)/(code)/store/code.ts)
- [Shiki Documentation](https://shiki.style)
- [highlight.js](https://highlightjs.org/)
