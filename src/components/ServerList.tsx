import { useStore } from '../store/useStore'
import { LOGO } from '../lib/supabase'
export default function ServerList() {
  const { servers, server, pickServer, addServer } = useStore()
  return (
    <nav className="w-[72px] bg-b1 flex flex-col items-center py-3 gap-2 overflow-y-auto">
      <div className="text-3xl mb-1">{LOGO}</div>
      {servers.map(s => (
        <button key={s.id} title={s.name} onClick={() => pickServer(s)}
          className={`w-12 h-12 grid place-items-center font-bold transition-all ${server?.id === s.id ? 'bg-brand rounded-xl text-white' : 'bg-b3 rounded-full hover:rounded-xl hover:bg-brand'}`}>
          {s.is_default ? LOGO : s.name.slice(0, 2).toUpperCase()}</button>))}
      <button onClick={() => { const n = prompt('اسم السيرفر الجديد؟'); if (n?.trim()) addServer(n.trim()) }}
        className="w-12 h-12 rounded-full bg-b3 text-green-500 text-3xl hover:bg-green-600 hover:text-white">+</button>
    </nav>)
}
