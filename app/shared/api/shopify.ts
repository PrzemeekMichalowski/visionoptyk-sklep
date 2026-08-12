/**
 * Minimalny klient Storefront API. Bez modułu i bez codegenu — przy dwóch
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
   * w GROQ-owym odpowiedniku wyglądają jak "produkt nie istnieje" i kończą się
   * cichym 404 zamiast krzykiem na etapie developmentu.
   */
  if (odpowiedz.errors?.length) {
    throw new Error(`Storefront API: ${odpowiedz.errors.map((e) => e.message).join('; ')}`)
  }
  if (!odpowiedz.data) {
    throw new Error('Storefront API: pusta odpowiedź')
  }

  return odpowiedz.data
}

export type Nominal = {
  id: string
  title: string
  availableForSale: boolean
  price: { amount: string; currencyCode: string }
}

export type Karta = {
  title: string
  descriptionHtml: string
  variants: { nodes: Nominal[] }
}

export const ZAPYTANIE_KARTA = `
  query Karta($handle: String!) {
    product(handle: $handle) {
      title
      descriptionHtml
      variants(first: 20) {
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
