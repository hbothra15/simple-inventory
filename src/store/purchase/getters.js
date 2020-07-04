export function getRecords(state) {
  return state.entries;
}

export function getCurrentRecord(state) {
  return state.current
}

export function loading(state) {
  return state.loading
}

export function redirected(state) {
  return state.redirected
}