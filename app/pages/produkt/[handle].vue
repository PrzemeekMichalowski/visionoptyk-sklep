<script setup lang="ts">
import {
  storefront,
  doKasy,
  ZAPYTANIE_PRODUKT,
  type Produkt,
  type Wariant,
} from '~/shared/api/shopify'
import { zloty } from '~/shared/lib/format'

const handle = useRoute().params.handle as string

const { data } = await useAsyncData(`produkt-${handle}`, () =>
  storefront<{ product: Produkt | null }>(ZAPYTANIE_PRODUKT, { handle }),
)

const produkt = computed(() => data.value?.product ?? null)

// Pusty wynik to 404, nigdy pusta strona — ta sama zasada co na visionoptyk.pl.
if (!produkt.value) {
  throw createError({ statusCode: 404, statusMessage: 'Nie znaleziono produktu', fatal: true })
}

const warianty = computed<Wariant[]>(() => produkt.value?.variants.nodes ?? [])
const wybrany = ref<string | null>(warianty.value.find((w) => w.availableForSale)?.id ?? null)

const trwa = ref(false)
const blad = ref<string | null>(null)

async function kup() {
  if (!wybrany.value || trwa.value) return
  trwa.value = true
  blad.value = null

  try {
    // Checkout zostaje po stronie Shopify — poniżej planu Plus nie da się go przejąć.
    window.location.href = await doKasy(wybrany.value)
  } catch (e) {
    blad.value = e instanceof Error ? e.message : 'Coś poszło nie tak. Spróbuj ponownie.'
    trwa.value = false
  }
}

useHead(() => ({
  title: `${produkt.value?.title ?? 'Produkt'} — VisionOptyk`,
  meta: [{ name: 'description', content: produkt.value?.description ?? '' }],
}))
</script>

<template>
  <div v-if="produkt" class="mx-auto max-w-6xl px-5 py-8 sm:py-12">
    <NuxtLink
      to="/"
      class="text-sm font-medium text-muted-ink underline underline-offset-4 hover:text-brand-navy"
    >
      ← Wszystkie produkty
    </NuxtLink>

    <div class="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
      <!-- object-contain: packshot w pionie, kadrowanie ucięłoby blister z logo. -->
      <div
        class="flex aspect-4/5 items-center justify-center overflow-hidden rounded-card bg-tint p-8"
      >
        <img
          v-if="produkt.featuredImage"
          :src="produkt.featuredImage.url"
          :alt="produkt.featuredImage.altText ?? produkt.title"
          :width="produkt.featuredImage.width"
          :height="produkt.featuredImage.height"
          class="h-full w-auto object-contain"
        >
        <span v-else class="text-center text-2xl font-black tracking-tight text-brand-navy">
          {{ produkt.title }}
        </span>
      </div>

      <div class="lg:py-4">
        <h1 class="text-3xl font-black tracking-tight text-ink sm:text-4xl">
          {{ produkt.title }}
        </h1>

        <div
          class="prose prose-sm mt-4 max-w-prose text-muted-ink"
          v-html="produkt.descriptionHtml"
        />

        <fieldset class="mt-8">
          <legend class="text-sm font-bold text-ink">Wybierz nominał</legend>

          <div class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <label
              v-for="wariant in warianty"
              :key="wariant.id"
              class="flex cursor-pointer items-center justify-center rounded-media border-2 px-4 py-5 text-lg font-bold transition-colors"
              :class="[
                wybrany === wariant.id
                  ? 'border-brand-navy bg-tint text-brand-navy'
                  : 'border-hairline text-ink hover:border-brand-blue',
                !wariant.availableForSale && 'cursor-not-allowed opacity-40',
              ]"
            >
              <input
                v-model="wybrany"
                type="radio"
                name="wariant"
                :value="wariant.id"
                :disabled="!wariant.availableForSale"
                class="sr-only"
              >
              {{ zloty(wariant.price.amount, wariant.price.currencyCode) }}
            </label>
          </div>
        </fieldset>

        <button
          type="button"
          class="mt-8 w-full rounded-full bg-brand-red px-8 py-4 text-base font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto"
          :disabled="!wybrany || trwa"
          @click="kup"
        >
          {{ trwa ? 'Przekierowuję do płatności…' : 'Kup teraz' }}
        </button>

        <p v-if="blad" role="alert" class="mt-4 text-sm font-medium text-brand-red">{{ blad }}</p>

        <dl class="mt-10 grid gap-4 border-t border-hairline pt-6 text-sm sm:grid-cols-2">
          <div>
            <dt class="font-bold text-ink">Dostawa</dt>
            <dd class="mt-1 text-muted-ink">Kod e-mailem od razu po opłaceniu.</dd>
          </div>
          <div>
            <dt class="font-bold text-ink">Realizacja</dt>
            <dd class="mt-1 text-muted-ink">W salonach VisionOptyk, jednorazowo.</dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>
