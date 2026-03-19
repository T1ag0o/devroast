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

## Decisões de Implementação
| Decisão | Opção Escolhida | Justificativa |
|---------|------------------|---------------|

## Arquitetura
### Componentes/Arquivos
| Arquivo | Ação | Descrição |
|---------|------|-----------|

## To-Dos
- [ ] Tarefa 1
- [ ] Tarefa 2
```

## Regras

1. **Antes de implementar** → criar spec em `specs/[feature-name].md`
2. **Incluir To-Dos** → com checkboxes `[ ]` para rastrear progresso
3. **Decisões de design** → documentar justificativas
4. **Referenciar Pencil** → usar MCP para consultar design antes de specar
