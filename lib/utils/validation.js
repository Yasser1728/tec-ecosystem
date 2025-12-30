export function isValidAmount(value) {
  return typeof value === "number" && value > 0;
}
