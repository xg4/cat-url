export function parseUrl(val: string) {
  if (val.startsWith('https') || val.startsWith('http')) {
    return new URL(val)
  }
  if (val.startsWith('//')) {
    return new URL(['https:', val].join(''))
  }
  return new URL(['https://', val].join(''))
}
