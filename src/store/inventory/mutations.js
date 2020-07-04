export function addEntry(state, payload) {
  state.entries.push(payload);
}

export function cleanup(state) {
  state.entries = [];
}

export function loading(state, data) {
  state.loading = data;
}
