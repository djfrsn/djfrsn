export default function chunk(array: any[], size = 10) {
  if (size <= 0) throw new Error('chunk size must be greater than zero')
  let chunks = []

  for (let i = 0; i < array.length; i += size) {
    const chunk = array.slice(i, i + size)
    chunks.push(chunk)
  }

  return chunks
}
