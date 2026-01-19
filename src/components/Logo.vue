<template>
  <div class="logo-mark" aria-label="Antigravity KMS 标志">
    <svg viewBox="0 0 64 64" role="img" aria-hidden="true">
      <!-- 背景分块（类似窗口） -->
      <rect x="6" y="6" width="24" height="24" rx="6" class="pane pane-a" />
      <rect x="34" y="6" width="24" height="24" rx="6" class="pane pane-b" />
      <rect x="6" y="34" width="24" height="24" rx="6" class="pane pane-c" />
      <rect x="34" y="34" width="24" height="24" rx="6" class="pane pane-d" />

      <!-- 抽象钥匙形状 -->
      <path
        class="key-shaft"
        d="M20 40c0-6.627 5.373-12 12-12s12 5.373 12 12c0 2.086-.53 4.05-1.467 5.76l6.134 4.24-2.8 3.9-6.3-4.36a11.94 11.94 0 0 1-7.567 2.46C25.373 52 20 46.627 20 40Z"
      />
      <circle class="key-eye" cx="32" cy="40" r="4.5" />
    </svg>
  </div>
</template>

<style scoped>
.logo-mark {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent);
}

svg {
  width: 100%;
  height: 100%;
}

.pane {
  fill: currentColor;
  opacity: 0.18;
}

.pane-b,
.pane-c {
  opacity: 0.22;
}

.pane-d {
  opacity: 0.26;
}

.key-shaft {
  fill: none;
  stroke: currentColor;
  stroke-width: 3.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.key-eye {
  fill: var(--color-surface);
  stroke: currentColor;
  stroke-width: 2.4;
}

[data-theme='dark'] .key-eye {
  fill: var(--color-surface);
}
</style>
