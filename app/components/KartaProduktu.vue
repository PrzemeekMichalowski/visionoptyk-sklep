<script setup lang="ts">
import type { ProduktNaLiscie } from '~/shared/api/shopify'
import { zakresCen } from '~/shared/lib/format'

defineProps<{ produkt: ProduktNaLiscie }>()
</script>

<template>
  <NuxtLink
    :to="`/produkt/${produkt.handle}/`"
    class="group flex flex-col overflow-hidden rounded-card border border-hairline transition-shadow hover:shadow-lg"
  >
    <div class="aspect-4/3 overflow-hidden bg-tint">
      <img
        v-if="produkt.featuredImage"
        :src="produkt.featuredImage.url"
        :alt="produkt.featuredImage.altText ?? produkt.title"
        :width="produkt.featuredImage.width"
        :height="produkt.featuredImage.height"
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      >
      <!--
        Produkt bez zdjęcia dostaje kafelek w barwach marki zamiast pustego
        prostokąta — karta podarunkowa i tak nie ma sensownej fotografii.
      -->
      <div
        v-else
        class="flex h-full w-full items-center justify-center bg-linear-to-br from-brand-navy to-brand-blue p-6"
      >
        <span class="text-center text-xl font-bold tracking-tight text-white">
          {{ produkt.title }}
        </span>
      </div>
    </div>

    <div class="flex flex-1 flex-col p-5">
      <h2 class="text-lg font-semibold text-brand-navy">{{ produkt.title }}</h2>
      <p v-if="produkt.description" class="mt-2 line-clamp-2 text-sm text-muted-ink">
        {{ produkt.description }}
      </p>
      <p class="mt-4 text-base font-semibold text-ink">
        {{ zakresCen(produkt.priceRange.minVariantPrice, produkt.priceRange.maxVariantPrice) }}
      </p>
    </div>
  </NuxtLink>
</template>
