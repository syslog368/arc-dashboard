@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", "Helvetica Neue", Arial, sans-serif;
  --font-mono: "JetBrains Mono", "Courier New", Courier, monospace;
  
  --color-bg: #09090b;
  --color-surface: #121215;
  --color-surface-light: #1c1c21;
  --color-border: #27272a;
  --color-text-primary: #f8fafc;
  --color-text-secondary: #94a3b8;
  --color-accent: #3b82f6;
  --color-success: #22c55e;
}

@layer base {
  body {
    @apply bg-bg text-text-primary font-sans antialiased selection:bg-accent/30;
  }
}

@layer utilities {
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-border rounded-full hover:bg-zinc-600 transition-colors;
  }

  .tech-grid {
    background-size: 40px 40px;
    background-image: 
      linear-gradient(to right, rgba(39, 39, 42, 0.2) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(39, 39, 42, 0.2) 1px, transparent 1px);
  }

  .glow-sm {
    box-shadow: 0 0 15px -5px var(--color-accent);
  }

  .skeleton {
    @apply relative overflow-hidden bg-zinc-800 rounded;
  }
  
  .skeleton::after {
    @apply absolute inset-0 content-[''];
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
}
