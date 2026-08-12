/**
 * Minimalny klient Storefront API. Bez modułu i bez codegenu — przy kilku
 * zapytaniach narzut konfiguracji przekraczał zysk z typowania.
 */

type OdpowiedzGraphQL<T> = {
  data?: T
  errors?: { message: string }[]
}

export async function storefront<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const { shopifyDomain, shopifyToken, shopifyApiVersion } = useRuntimeConfig().public

  const odpowiedz = await $fetch<OdpowiedzGraphQL<T>>(
    `https://${shopifyDomain}/api/${shopifyApiVersion}/graphql.json`,
    {
      method: 'POST',
      headers: { 'X-Shopify-Storefront-Access-Token': shopifyToken },
      body: { query, variables },
    },
  )

  /*
   * Storefront API zwraca HTTP 200 nawet dla błędów zapytania — $fetch nie
   * rzuci, a `data` będzie puste. Bez tej kontroli błąd uprawnień albo literówka
   * w zapytaniu wyglądają jak "produkt nie istnieje" i kończą się cichym 404
   * zamiast krzykiem na etapie developmentu.
   */
  if (odpowiedz.errors?.length) {
    throw new Error(`Storefront API: ${odpowiedz.errors.map((e) => e.message).join('; ')}`)
  }
  if (!odpowiedz.data) {
    throw new Error('Storefront API: pusta odpowiedź')
  }

  return odpowiedz.data
}

export type Kwota = { amount: string; currencyCode: string }

export type Obraz = { url: string; altText: string | null; width: number; height: number }

export type Wariant = {
  id: string
  title: string
  availableForSale: boolean
  price: Kwota
}

/** Kafelek na listingu — bez wariantów, żeby nie ciągnąć ich dla całej siatki. */
export type ProduktNaLiscie = {
  id: string
  title: string
  handle: string
  description: string
  featuredImage: Obraz | null
  priceRange: { minVariantPrice: Kwota; maxVariantPrice: Kwota }
}

export type Produkt = ProduktNaLiscie & {
  descriptionHtml: string
  variants: { nodes: Wariant[] }
}

const FRAGMENT_KAFELEK = `
  fragment Kafelek on Product {
    id
    title
    handle
    description
    featuredImage { url altText width height }
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
  }
`

export const ZAPYTANIE_PRODUKTY = `
  ${FRAGMENT_KAFELEK}
  query Produkty {
    products(first: 50, sortKey: TITLE) {
      nodes { ...Kafelek }
    }
  }
`

export const ZAPYTANIE_PRODUKT = `
  ${FRAGMENT_KAFELEK}
  query Produkt($handle: String!) {
    product(handle: $handle) {
      ...Kafelek
      descriptionHtml
      variants(first: 50) {
        nodes {
          id
          title
          availableForSale
          price { amount currencyCode }
        }
      }
    }
  }
`

export const MUTACJA_KOSZYK = `
  mutation UtworzKoszyk($variantId: ID!) {
    cartCreate(input: { lines: [{ merchandiseId: $variantId, quantity: 1 }] }) {
      cart { checkoutUrl }
      userErrors { message }
    }
  }
`

export type WynikKoszyka = {
  cartCreate: {
    cart: { checkoutUrl: string } | null
    userErrors: { message: string }[]
  }
}

/** Tworzy koszyk z jednym wariantem i zwraca URL kasy Shopify. */
export async function doKasy(variantId: string) {
  const wynik = await storefront<WynikKoszyka>(MUTACJA_KOSZYK, { variantId })
  const url = wynik.cartCreate.cart?.checkoutUrl
  if (!url) {
    throw new Error(wynik.cartCreate.userErrors[0]?.message ?? 'Nie udało się utworzyć koszyka')
  }
  return url
}
