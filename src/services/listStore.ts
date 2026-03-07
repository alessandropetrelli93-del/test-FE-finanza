export type ListsState = {
  active: string
  lists: Record<string, string[]> // listName -> isins
}

const KEY = 'isin_viewer_lists_v1'

export function loadLists(): ListsState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { active: 'Personale', lists: { Personale: [] } }
    const parsed = JSON.parse(raw)
    const active = typeof parsed.active === 'string' ? parsed.active : 'Personale'
    const lists = typeof parsed.lists === 'object' && parsed.lists ? parsed.lists : { Personale: [] }
    if (!lists['Personale']) lists['Personale'] = []
    if (!lists[active]) return { active: 'Personale', lists }
    return { active, lists }
  } catch {
    return { active: 'Personale', lists: { Personale: [] } }
  }
}

export function saveLists(state: ListsState) {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function ensureList(state: ListsState, name: string): ListsState {
  const n = name.trim()
  if (!n) return state
  if (state.lists[n]) return state
  return { ...state, lists: { ...state.lists, [n]: [] } }
}

export function addToList(state: ListsState, listName: string, isin: string): ListsState {
  const s = ensureList(state, listName)
  const key = listName.trim()
  const arr = s.lists[key] || []
  const up = isin.toUpperCase()
  if (!up) return s
  const next = arr.includes(up) ? arr : [up, ...arr]
  return { ...s, active: key, lists: { ...s.lists, [key]: next } }
}

export function removeFromList(state: ListsState, listName: string, isin: string): ListsState {
  const key = listName.trim()
  const up = isin.toUpperCase()
  const arr = state.lists[key] || []
  return { ...state, lists: { ...state.lists, [key]: arr.filter((x) => x !== up) } }
}

export function renameList(state: ListsState, from: string, to: string): ListsState {
  const f = from.trim()
  const t = to.trim()
  if (!f || !t || f === t) return state
  if (state.lists[t]) return state
  const { [f]: removed, ...rest } = state.lists
  const moved = removed || []
  const nextLists = { ...rest, [t]: moved }
  const active = state.active === f ? t : state.active
  return { active, lists: nextLists }
}

export function deleteList(state: ListsState, name: string): ListsState {
  const n = name.trim()
  if (n === 'Personale') return state
  const { [n]: removed, ...rest } = state.lists
  const active = state.active === n ? 'Personale' : state.active
  return { active, lists: rest }
}
