import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { addToList, deleteList, loadLists, removeFromList, renameList, saveLists } from '../services/listStore'

export default function Lists() {
  const nav = useNavigate()
  const [state, setState] = useState(loadLists())
  const [newList, setNewList] = useState('')
  const [renameFrom, setRenameFrom] = useState('')
  const [renameTo, setRenameTo] = useState('')

  useEffect(()=>{ saveLists(state) }, [state])

  const listNames = useMemo(() => Object.keys(state.lists).sort((a,b)=>a.localeCompare(b)), [state])

  function create(){
    const name = newList.trim()
    if(!name) return
    setState(s => ({...addToList(s, name, ''), lists: {...addToList(s, name, '').lists, [name]: s.lists[name] || [] }}))
    // above line is a safe ensure; we don't want to add empty ISIN
    setState(s => ({...s, active: name, lists: { ...s.lists, [name]: s.lists[name] || [] }}))
    setNewList('')
  }

  function doRename(){
    if(!renameFrom.trim() || !renameTo.trim()) return
    setState(s => renameList(s, renameFrom, renameTo))
    setRenameFrom('')
    setRenameTo('')
  }

  function del(name: string){ setState(s => deleteList(s, name)) }

  return (
    <section className="card">
      <div className="row" style={{justifyContent:'space-between'}}>
        <h2 style={{margin:0}}>Liste</h2>
        <button className="secondary" onClick={()=>nav('/')}>Torna</button>
      </div>
      <p className="muted">Liste con nomi liberi (es. cliente). In MVP sono locali.</p>

      <div className="row">
        <div>
          <label>Nuova lista</label>
          <input value={newList} onChange={(e)=>setNewList(e.target.value)} placeholder="Es. Cliente Rossi" />
        </div>
        <div style={{flex:'0 0 auto'}}>
          <label>&nbsp;</label>
          <button onClick={create}>Crea</button>
        </div>
      </div>

      <div className="row" style={{marginTop:6}}>
        <div>
          <label>Rinomina (da)</label>
          <select value={renameFrom} onChange={(e)=>setRenameFrom(e.target.value)}>
            <option value="">—</option>
            {listNames.filter(n=>n!=='Personale').map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label>a</label>
          <input value={renameTo} onChange={(e)=>setRenameTo(e.target.value)} placeholder="Nuovo nome" />
        </div>
        <div style={{flex:'0 0 auto'}}>
          <label>&nbsp;</label>
          <button className="secondary" onClick={doRename}>Rinomina</button>
        </div>
      </div>

      <div className="row" style={{marginTop:10}}>
        <div>
          <label>Lista attiva</label>
          <select value={state.active} onChange={(e)=>setState(s=>({...s, active: e.target.value}))}>
            {listNames.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <ul className="list">
        {listNames.map(n => (
          <li key={n}>
            <div>
              <div style={{fontWeight:900}}>{n}</div>
              <small>{(state.lists[n] || []).length} strumenti</small>
            </div>
            <div className="row" style={{flex:'0 0 auto'}}>
              <button className="ghost" onClick={()=>setState(s=>({...s, active: n}))}>Seleziona</button>
              {n !== 'Personale' && <button className="secondary" onClick={()=>del(n)}>Elimina</button>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
