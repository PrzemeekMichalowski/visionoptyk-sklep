<script setup lang="ts">
import {
  storefront,
  ZAPYTANIE_KARTA,
  MUTACJA_KOSZYK,
  type Karta,
  type Nominal,
} from '~/shared/api/shopify'

const HANDLE = 'karta-podarunkowa-visionoptyk'

const { data } = await useAsyncData('karta', () =>
  storefront<{ product: Karta | null }>(ZAPYTANIE_KARTA, { handle: HANDLE }),
)

const karta = computed(() => data.value?.product ?? null)

// Pusty wynik to 404, nigdy pusta strona — ta sama zasada co na visionoptyk.pl.
if (!karta.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Nie znaleziono karty podarunkowej',
    fatal: true,
  })
}

const nominaly = computed<Nominal[]>(() => karta.value?.variants.nodes ?? [])
const wybrany = ref<string | null>(nominaly.value.find((n) => n.availableForSale)?.id ?? null)

const trwa = ref(false)
const blad = ref<string | null>(null)

function zloty(nominal: Nominal) {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: nominal.price.currencyCode,
    maximumFractionDigits: 0,
  }).format(Number(nominal.price.amount))
}

type WynikKoszyka = {
  cartCreate: {
    cart: { checkoutUrl: string } | null
    userErrors: { message: string }[]
  }
}

async function kup() {
  if (!wybrany.value || trwa.value) return
  trwa.value = true
  blad.value = null

  try {
    const wynik = await storefront<WynikKoszyka>(MUTACJA_KOSZYK, {
      variantId: wybrany.value,
    })
    const url = wynik.cartCreate.cart?.checkoutUrl
    if (!url) {
      throw new Error(wynik.cartCreate.userErrors[0]?.message ?? 'Nie udało się utworzyć koszyka')
    }
    // Checkout zostaje po stronie Shopify — poniżej planu Plus nie da się go przejąć.
    window.location.href = url
  } catch (e) {
    blad.value = e instanceof Error ? e.message : 'Coś poszło nie tak. Spróbuj ponownie.'
    trwa.value = false
  }
}

useHead({
  title: 'Karta podarunkowa — VisionOptyk',
  meta: [
    {
      name: 'description',
      content:
        'Karta podarunkowa do realizacji w salonach VisionOptyk. Kod otrzymasz e-mailem od razu po zakupie.',
    },
  ],
})
</script>

<template>
  <div v-if="karta" class="mx-auto max-w-5xl px-5 py-12 sm:py-16">
    <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-brand-navy">
      {{ karta.title }}
    </h1>

    <div class="prose prose-sm mt-4 max-w-prose text-muted-ink" v-html="karta.descriptionHtml" />

    <fieldset class="mt-10">
      <legend class="text-sm font-semibold text-ink">Wybierz nominał</legend>

      <div class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <label
          v-for="nominal in nominaly"
          :key="nominal.id"
          class="relative flex cursor-pointer items-center justify-center rounded-media border px-4 py-6 text-lg font-semibold transition-colors"
          :class="[
            wybrany === nominal.id
              ? 'border-brand-navy bg-tint text-brand-navy'
              : 'border-hairline text-ink hover:border-brand-blue',
            !nominal.availableForSale && 'opacity-40 cursor-not-allowed',
          ]"
        >
          <input
            v-model="wybrany"
            type="radio"
            name="nominal"
            :value="nominal.id"
            :disabled="!nominal.availableForSale"
            class="sr-only"
          >
          {{ zloty(nominal) }}
        </label>
      </div>
    </fieldset>

    <button
      type="button"
      class="mt-8 w-full sm:w-auto rounded-full bg-brand-red px-8 py-4 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      :disabled="!wybrany || trwa"
      @click="kup"
    >
      {{ trwa ? 'Przekierowuję do płatności…' : 'Kup kartę' }}
    </button>

    <p v-if="blad" role="alert" class="mt-4 text-sm text-brand-red">
      {{ blad }}
    </p>
  </div>
</template>
