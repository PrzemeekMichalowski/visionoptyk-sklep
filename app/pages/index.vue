<script setup lang="ts">
import { storefront, ZAPYTANIE_PRODUKTY, type ProduktNaLiscie } from '~/shared/api/shopify'
import { zloty } from '~/shared/lib/format'

const { data } = await useAsyncData('produkty', () =>
  storefront<{ products: { nodes: ProduktNaLiscie[] } }>(ZAPYTANIE_PRODUKTY),
)

const produkty = computed<ProduktNaLiscie[]>(() => data.value?.products.nodes ?? [])

/*
 * Najniższy nominał liczony z katalogu, nie wpisany w treść — dodanie karty za
 * 50 zł ma zmienić ten chip samo. Ta sama zasada co derived counts na
 * visionoptyk.pl.
 */
const odKwoty = computed(() => {
  const ceny = produkty.value.map((p) => Number(p.priceRange.minVariantPrice.amount))
  if (!ceny.length) return null
  const min = Math.min(...ceny)
  const waluta = produkty.value[0]?.priceRange.minVariantPrice.currencyCode ?? 'PLN'
  return zloty(min, waluta)
})

const atuty = computed(() =>
  [
    odKwoty.value ? `Nominały od ${odKwoty.value}` : null,
    'Kod e-mailem od razu po zakupie',
    'Realizacja w salonach VisionOptyk',
  ].filter((x): x is string => Boolean(x)),
)

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
      <div class="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <h1 class="max-w-3xl text-4xl font-black tracking-tight text-ink sm:text-5xl">
          Podaruj lepsze widzenie
        </h1>
        <p class="mt-5 max-w-xl text-base text-muted-ink sm:text-lg">
          Karta podarunkowa VisionOptyk — do wykorzystania w naszych salonach. Kod trafia na e-mail
          od razu po zakupie.
        </p>

        <ul class="mt-8 flex flex-wrap gap-2">
          <li
            v-for="atut in atuty"
            :key="atut"
            class="rounded-full bg-white px-4 py-2 text-sm font-medium text-ink"
          >
            {{ atut }}
          </li>
        </ul>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-5 py-14 sm:py-20">
      <h2 class="text-sm font-bold tracking-wide text-muted-ink uppercase">Produkty</h2>

      <div v-if="produkty.length" class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <KartaProduktu v-for="produkt in produkty" :key="produkt.id" :produkt="produkt" />
      </div>

      <!--
        Pusty katalog to stan przejściowy sklepu, nie błąd — inaczej niż brak
        produktu na stronie produktu, który jest 404.
      -->
      <p v-else class="mt-6 text-muted-ink">
        Trwa przygotowywanie oferty. Zajrzyj do nas za chwilę.
      </p>
    </section>
  </div>
</template>
