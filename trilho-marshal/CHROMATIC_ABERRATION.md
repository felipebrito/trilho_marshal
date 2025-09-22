# Aberração Cromática - Trilho Marshal

## 🌈 Visão Geral

A aberração cromática foi implementada no Trilho Marshal baseada no shader original que você compartilhou. O efeito simula a distorção de lente e separação de canais RGB que ocorre em lentes ópticas reais.

## 🎮 Controles

### Teclado
- **Tecla X**: Ativar/desativar aberração cromática
- **Tecla B**: Ativar/desativar blur (efeito existente)

### Interface
- Painel de calibração: Botão "Ativar/Desativar Chromatic"
- Status no HUD: Mostra se está ativo ou não

## 🔧 Componentes

### ChromaticAberration (Simples)
```typescript
<ChromaticAberration
  enabled={isChromaticEnabled}
  intensity={0.4}
  animationSpeed={1.2}
  className="absolute top-0 left-0"
>
  {children}
</ChromaticAberration>
```

**Propriedades:**
- `enabled`: boolean - Ativa/desativa o efeito
- `intensity`: number (0-1) - Intensidade do efeito
- `animationSpeed`: number - Velocidade da animação
- `className`: string - Classes CSS adicionais
- `style`: object - Estilos CSS adicionais

### ChromaticAberrationAdvanced (Avançado)
```typescript
<ChromaticAberrationAdvanced
  enabled={isChromaticEnabled}
  intensity={0.5}
  animationSpeed={1.0}
  distortionStrength={0.3}
  offsetStrength={0.1}
  zoomIntensity={0.2}
>
  {children}
</ChromaticAberrationAdvanced>
```

**Propriedades adicionais:**
- `distortionStrength`: number - Força da distorção de lente
- `offsetStrength`: number - Força do offset dos canais RGB
- `zoomIntensity`: number - Intensidade do zoom dinâmico

## 🎨 Como Funciona

### Baseado no Shader Original
O efeito é baseado no shader que você compartilhou, que implementa:

1. **Distorção de Lente**: Usando parâmetros `k` e `kcube`
2. **Aberração Cromática**: Separando canais RGB com offsets diferentes
3. **Zoom Dinâmico**: Com função theta complexa
4. **Transições Suaves**: Entre diferentes estados

### Implementação React
- **Canais RGB**: Cada canal é renderizado separadamente com filtros diferentes
- **Mix Blend Mode**: Usa `screen` para combinar os canais
- **Animações**: Baseadas em funções trigonométricas do shader original
- **Performance**: Otimizada para 60fps com `requestAnimationFrame`

## ⚙️ Configuração Atual

### Parâmetros Padrão
```typescript
intensity: 0.4          // Intensidade moderada
animationSpeed: 1.2     // Velocidade ligeiramente acelerada
distortionStrength: 0.3 // Distorção sutil
offsetStrength: 0.1     // Offset pequeno
zoomIntensity: 0.2      // Zoom sutil
```

### Salvamento/Carregamento
- O estado da aberração cromática é salvo automaticamente
- Persiste entre sessões
- Sincronizado com o sistema de configuração existente

## 🚀 Uso

### Ativação Rápida
1. Pressione **X** para ativar/desativar
2. Use o botão no painel de calibração
3. O estado é salvo automaticamente

### Personalização
Para ajustar os parâmetros, edite o componente `ChromaticAberration` no TVViewer:

```typescript
<ChromaticAberration
  enabled={isChromaticEnabled}
  intensity={0.6}        // Aumentar intensidade
  animationSpeed={0.8}   // Diminuir velocidade
  className="absolute top-0 left-0 w-auto h-auto max-w-none max-h-none"
>
```

## 🎯 Efeitos Visuais

### O que Você Verá
- **Bordas coloridas**: Canais RGB separados nas bordas
- **Distorção dinâmica**: Efeito de lente que muda com o tempo
- **Zoom sutil**: Zoom in/out baseado no shader original
- **Blur variável**: Blur que muda de intensidade

### Melhor Uso
- **Ativo durante apresentações**: Para efeito dramático
- **Desativado para calibração**: Para precisão
- **Combinado com blur**: Para efeito mais intenso

## 🔧 Troubleshooting

### Efeito Muito Intenso
- Diminua `intensity` para 0.2-0.3
- Ajuste `offsetStrength` para 0.05

### Efeito Muito Sutil
- Aumente `intensity` para 0.6-0.8
- Ajuste `distortionStrength` para 0.5

### Performance
- O efeito é otimizado para 60fps
- Se houver lag, diminua `animationSpeed`

## 📝 Próximos Passos

### Melhorias Possíveis
1. **Controles de intensidade**: Sliders no painel de calibração
2. **Presets**: Diferentes configurações pré-definidas
3. **Transições**: Fade in/out suave
4. **WebGL**: Implementação com shaders reais para melhor performance

### Integração Futura
- Pode ser aplicado a outros elementos além da imagem de fundo
- Possível integração com sistema de UDP para controle remoto
- Efeitos adicionais baseados no shader original

## 🎨 Inspiração

Baseado no shader original de:
- **Distorção de lente** com parâmetros `k` e `kcube`
- **Aberração cromática** com separação de canais RGB
- **Zoom dinâmico** com função theta complexa
- **Transições suaves** entre estados

O efeito recria a experiência visual de lentes ópticas reais, adicionando profundidade e realismo ao Trilho Marshal.
