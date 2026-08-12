<script setup lang="ts">
import { storefront, ZAPYTANIE_PRODUKTY, type ProduktNaLiscie } from '~/shared/api/shopify'

const { data } = await useAsyncData('produkty', () =>
  storefront<{ products: { nodes: ProduktNaLiscie[] } }>(ZAPYTANIE_PRODUKTY),
)

const produkty = computed<ProduktNaLiscie[]>(() => data.value?.products.nodes ?? [])

useHead({
  title: 'Sklep — VisionOptyk',
  meta: [
    {
      name: 'description',
      content:
        'Karty podarunkowe VisionOptyk do realizacji w salonach. Kod otrzymasz e-mailem od razu po zakupie.',
    },
  ],
})
</script>

<template>
  <div>
    <section class="border-b border-hairline bg-tint">
      <div class="mx-auto max-w-5xl px-5 py-14 sm:py-20">
        <h1 class="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-5xl">
          Podaruj lepsze widzenie
        </h1>
        <p class="mt-4 max-w-xl text-base text-muted-ink sm:text-lg">
          Karta podarunkowa VisionOptyk — do wykorzystania w naszych salonach. Kod trafia na e-mail
          od razu po zakupie.
        </p>
      </div>
    </section>

    <section class="mx-auto max-w-5xl px-5 py-12 sm:py-16">
      <h2 class="text-sm font-semibold tracking-wide text-muted-ink uppercase">Produkty</h2>

      <div v-if="produkty.length" class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <KartaProduktu v-for="produkt in produkty" :key="produkt.id" :produkt="produkt" />
      </div>

      <!--
        Pusty katalog to stan przejściowy sklepu, nie błąd — inaczej niż pojedynczy
        produkt, którego brak jest 404 na stronie produktu.
      -->
      <p v-else class="mt-6 text-muted-ink">
        Trwa przygotowywanie oferty. Zajrzyj do nas za chwilę.
      </p>
    </section>
  </div>
</template>
