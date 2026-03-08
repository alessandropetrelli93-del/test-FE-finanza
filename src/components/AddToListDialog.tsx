import { useMemo, useState } from 'react'
import { ListsState } from '../services/listStore'

export default function AddToListDialog({
  open,
  onClose,
  listsState,
  onAdd,
  isin,
}: {
  open: boolean
  onClose: () => void
  listsState: ListsState
  onAdd: (listName: string) => void
  isin: string
}) {
  const names = useMemo(() => Object.keys(listsState.lists).sort((a, b) => a.localeCompare(b)), [listsState])
  const [selected, setSelected] = useState(listsState.active)
  const [newName, setNewName] = useState('')

  if (!open) return null

  function submit() {
    const name = newName.trim() ? newName.trim() : selected
    if (!name.trim()) return
    onAdd(name)
    setNewName('')
    onClose()
  }

  return (
    <div className="dialog-backdrop" onMouseDown={onClose}>
      <div className="dialog" onMouseDown={(e) => e.stopPropagation()}>
        <h3>Aggiungi {isin} a una lista</h3>
        <div className="row">
          <div>
            <label>Lista esistente</label>
            <select value={selected} onChange={(e) => setSelected(e.target.value)}>
              {names.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Oppure nuova lista</label>
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Es. Cliente Rossi" />
          </div>
        </div>
        <div className="row" style={{ marginTop: 12, justifyContent: 'flex-end' }}>
          <div style={{ flex: '0 0 auto' }}>
            <button className="secondary" onClick={onClose}>Annulla</button>
          </div>
          <div style={{ flex: '0 0 auto' }}>
            <button onClick={submit}>Aggiungi</button>
          </div>
        </div>
      </div>
    </div>
  )
}
