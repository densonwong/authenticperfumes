export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  })
    .format(value)
    .replace(/\s+/g, "");
}

export function calculateSavings(retailPrice: number, authenticPrice: number) {
  return Math.max(retailPrice - authenticPrice, 0);
}
