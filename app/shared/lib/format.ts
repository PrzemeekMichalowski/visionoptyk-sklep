/**
 * Kwoty przychodzą ze Storefront API jako string ("100.0") — Number() przed
 * formatowaniem jest obowiązkowe, inaczej Intl dostaje NaN i wypisuje "NaN zł".
 */
export function zloty(amount: string | number, currency = 'PLN') {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount))
}

/** "od 100 zł" dla produktu z kilkoma nominałami, sama cena dla jednego. */
export function zakresCen(
  min: { amount: string; currencyCode: string },
  max: { amount: string; currencyCode: string },
) {
  return Number(min.amount) === Number(max.amount)
    ? zloty(min.amount, min.currencyCode)
    : `od ${zloty(min.amount, min.currencyCode)}`
}
