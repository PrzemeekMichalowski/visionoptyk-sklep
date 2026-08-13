<template>
  <div class="flex min-h-dvh flex-col">
    <header class="sticky top-0 z-50 border-b border-hairline bg-white/95 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <NuxtLink to="/" aria-label="Sklep VisionOptyk — strona główna">
          <img
            src="/logo-visionoptyk.png"
            alt="VisionOptyk"
            width="809"
            height="156"
            class="h-8 w-auto sm:h-9"
          >
        </NuxtLink>

        <a
          href="https://visionoptyk.pl/"
          class="text-sm font-medium text-muted-ink underline underline-offset-4 transition-colors hover:text-brand-navy"
        >
          visionoptyk.pl
        </a>
      </div>
    </header>

    <main class="flex-1">
      <NuxtPage />
    </main>

    <footer class="mt-20 border-t border-hairline bg-tint">
      <div
        class="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-muted-ink sm:flex-row sm:items-center sm:justify-between"
      >
        <p>© {{ new Date().getFullYear() }} VisionOptyk — Bliżej Ciebie</p>
        <p>Karty realizujesz w salonach VisionOptyk.</p>
      </div>
    </footer>
  </div>
</template>
