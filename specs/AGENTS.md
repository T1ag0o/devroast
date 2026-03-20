# Specs - Formato de Especificações

## Estrutura

```
specs/
├── [feature-name].md
└── AGENTS.md
```

## Template para Novos Specs

```markdown
# [Feature Name] - Especificação

## Visão Geral
Descrição breve do que será implementado.

## Stack
- Biblioteca/framework utilizado
- Versões importantes

## Decisões de Implementação
| Decisão | Opção Escolhida | Justificativa |
|---------|------------------|---------------|

## Estrutura de Arquivos
```
src/
└── ...
```

## Arquitetura
### Diagrama/fluxo opcional
```tsx
// Exemplo de código relevante
```

## To-Dos
- [ ] Tarefa 1
- [ ] Tarefa 2

## Referências
- [Link 1](url)
```

## Regras

1. **Antes de implementar** → criar spec em `specs/[feature-name].md`
2. **Incluir To-Dos** → com checkboxes `[ ]` para rastrear progresso
3. **Decisões de design** → documentar justificativas
4. **Referenciar Pencil** → usar MCP para consultar design antes de specar
5. **Commits atômicos** → separar specs por feature/escopo
