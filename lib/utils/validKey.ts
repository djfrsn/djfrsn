export default function validKey(key: string) {
  return key === process.env.ACCESS_KEY
}
