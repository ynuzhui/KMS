<template>
  <footer class="app-footer">
    <div class="footer-content">
      <span class="footer-copyright">
        Copyright by
        <a href="https://yunzhui.top" target="_blank" rel="noopener noreferrer">云坠</a>
      </span>
      <span v-if="icp" class="footer-icp">
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
          {{ icp }}
        </a>
      </span>
    </div>
  </footer>
</template>

<script setup>
const icp = import.meta.env.VITE_ICP || ''
</script>

<style scoped>
.app-footer {
  background: var(--color-surface);
  backdrop-filter: blur(var(--blur-md));
  -webkit-backdrop-filter: blur(var(--blur-md));
  border-top: 1px solid var(--color-border);
  padding: var(--spacing-md) var(--spacing-lg);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.footer-copyright a,
.footer-icp a {
  color: var(--color-text-secondary);
  transition: color var(--transition-fast);
}

.footer-copyright a:hover,
.footer-icp a:hover {
  color: var(--color-accent);
}

@media (max-width: 480px) {
  .footer-content {
    flex-direction: column;
    gap: var(--spacing-xs);
  }
}
</style>
