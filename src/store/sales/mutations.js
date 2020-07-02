export function addSales (state, payload) {
  state.entries.push(payload)
}
export function cleanup (state,) {
  state.entries = []
}