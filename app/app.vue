<template>
  <div class="min-h-dvh flex flex-col">
    <header class="border-b border-hairline">
      <div class="mx-auto max-w-5xl px-5 py-4 flex items-center justify-between">
        <span class="text-lg font-bold tracking-tight text-brand-navy">VisionOptyk</span>
        <a
          href="https://visionoptyk.pl/"
          class="text-sm text-muted-ink hover:text-brand-navy underline underline-offset-4"
        >
          Wróć na visionoptyk.pl
        </a>
      </div>
    </header>

    <main class="flex-1">
      <NuxtPage />
    </main>

    <footer class="border-t border-hairline mt-16">
      <div class="mx-auto max-w-5xl px-5 py-6 text-sm text-muted-ink">
        © {{ new Date().getFullYear() }} VisionOptyk
      </div>
    </footer>
  </div>
</template>
