const volumePattern = /^\s*(\d+(?:[.,]\d+)?)\s*(ml|l)\s*$/i;

function volumeInMilliliters(value: string) {
  const match = value.match(volumePattern);
  if (!match) return null;

  const amount = Number.parseFloat(match[1].replace(",", "."));
  if (!Number.isFinite(amount)) return null;

  return match[2].toLowerCase() === "l" ? amount * 1000 : amount;
}

export function uniqueSortedProductSizes(values: string[]) {
  return [...new Set(values)].sort((left, right) => {
    const leftVolume = volumeInMilliliters(left);
    const rightVolume = volumeInMilliliters(right);

    if (leftVolume !== null && rightVolume !== null) return leftVolume - rightVolume;
    if (leftVolume !== null) return -1;
    if (rightVolume !== null) return 1;
    return left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" });
  });
}
