<script setup lang="ts">
import type { ProduktNaLiscie } from '~/shared/api/shopify'
import { zakresCen } from '~/shared/lib/format'

defineProps<{ produkt: ProduktNaLiscie }>()
</script>

<template>
  <NuxtLink
    :to="`/produkt/${produkt.handle}/`"
    class="group flex flex-col overflow-hidden rounded-card border border-hairline bg-white transition-all hover:-translate-y-0.5 hover:border-brand-blue/40 hover:shadow-xl"
  >
    <!--
      object-contain, nie cover: zdjęcie karty to packshot w pionie (1122×1402),
      a kadrowanie ucina blister z logo — czyli dokładnie to, co ma sprzedawać.
    -->
    <div class="flex aspect-4/5 items-center justify-center overflow-hidden bg-tint p-6">
      <img
        v-if="produkt.featuredImage"
        :src="produkt.featuredImage.url"
        :alt="produkt.featuredImage.altText ?? produkt.title"
        :width="produkt.featuredImage.width"
        :height="produkt.featuredImage.height"
        loading="lazy"
        class="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
      >
      <span v-else class="text-center text-xl font-black tracking-tight text-brand-navy">
        {{ produkt.title }}
      </span>
    </div>

    <div class="flex flex-1 flex-col p-5">
      <h2 class="text-lg font-black tracking-tight text-ink">{{ produkt.title }}</h2>
      <p v-if="produkt.description" class="mt-2 line-clamp-2 text-sm text-muted-ink">
        {{ produkt.description }}
      </p>

      <div class="mt-4 flex items-center justify-between">
        <span class="text-base font-bold text-ink">
          {{ zakresCen(produkt.priceRange.minVariantPrice, produkt.priceRange.maxVariantPrice) }}
        </span>
        <span class="text-sm font-bold text-brand-navy group-hover:underline">Zobacz →</span>
      </div>
    </div>
  </NuxtLink>
</template>
