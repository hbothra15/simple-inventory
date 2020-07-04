export function addEntry(state, payload) {
  state.entries.push(payload);
}
export function cleanup(state) {
  state.entries = [];
}
export function setCurrent(state, data) {
  state.current = data;
}

export function loading(state, data) {
  state.loading = data;
}

export function redirected(state, data) {
  state.redirected = data;
}
