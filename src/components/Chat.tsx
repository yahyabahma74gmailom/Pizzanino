import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'
import { useMessages } from '../hooks/useMessages'
import { t } from '../lib/i18n'
import type { Message } from '../lib/types'
const EMOJIS = ['❤️', '🔥', '😂', '🍕', '👍']
export default function Chat() {
  const { channel, profile } = useStore(); const msgs = useMessages(channel!.id)
  const [text, setText] = useState(''); const [menu, setMenu] = useState<{ m: Message; x: number; y: number } | null>(null)
  const end = useRef<HTMLDivElement>(null); const timer = useRef<any>()
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs.length])
  const send = async (content: string) => { if (content.trim()) await supabase.from('messages').insert({ channel_id: channel!.id, user_id: profile!.id, content }) }
  const submit = async () => { const c = text; setText(''); await send(c) }
  const image = async (f?: File) => { if (!f) return
    const path = `${profile!.id}/${Date.now()}-${f.name}`
    const { error } = await supabase.storage.from('uploads').upload(path, f)
    if (!error) await send(supabase.storage.from('uploads').getPublicUrl(path).data.publicUrl) }
  const open = (e: any, m: Message) => { e.preventDefault?.(); setMenu({ m, x: e.clientX ?? e.touches?.[0].clientX ?? 20, y: e.clientY ?? e.touches?.[0].clientY ?? 20 }) }
  const isImg = (s: string) => /\.(png|jpe?g|gif|webp)$/i.test(s)
  return (
    <>
      <div className="h-12 px-4 flex items-center font-bold border-b border-black/20"># {channel!.name}</div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3" onClick={() => setMenu(null)}>
        {msgs.map(m => (
          <div key={m.id} className="flex gap-3 select-none md:select-text" onContextMenu={e => open(e, m)}
            onTouchStart={e => { timer.current = setTimeout(() => open(e, m), 500) }} onTouchEnd={() => clearTimeout(timer.current)}>
            {m.profiles?.avatar_url ? <img src={m.profiles.avatar_url} className="w-10 h-10 rounded-full" /> : <div className="w-10 h-10 rounded-full bg-brand grid place-items-center">🍕</div>}
            <div className="min-w-0"><div><b>{m.profiles?.username}</b> <span className="text-xs text-mu">{new Date(m.created_at).toLocaleString()}</span></div>
              {isImg(m.content) ? <img src={m.content} className="max-w-xs rounded mt-1" /> : <p className="break-words whitespace-pre-wrap">{m.content}</p>}</div>
          </div>))}
        <div ref={end} />
      </div>
      {menu && (
        <div style={{ left: Math.min(menu.x, innerWidth - 180), top: Math.min(menu.y, innerHeight - 200) }} className="fixed z-50 bg-b1 rounded-lg shadow-xl p-1 w-44 text-sm">
          <button className="block w-full text-left px-3 py-1.5 hover:bg-brand rounded" onClick={() => { navigator.clipboard.writeText(menu.m.content); setMenu(null) }}>📋 Copy</button>
          <button className="block w-full text-left px-3 py-1.5 hover:bg-brand rounded" onClick={() => { setText(`> ${menu.m.profiles?.username}: ${menu.m.content.slice(0, 60)}\n`); setMenu(null) }}>↩️ Reply</button>
          <div className="flex justify-around py-1">{EMOJIS.map(e => <button key={e} onClick={() => { send(`${e} → ${menu.m.content.slice(0, 30)}`); setMenu(null) }}>{e}</button>)}</div>
          {menu.m.user_id === profile!.id && <button className="block w-full text-left px-3 py-1.5 hover:bg-red-600 rounded" onClick={() => { supabase.from('messages').delete().eq('id', menu.m.id); setMenu(null) }}>🗑️ Delete</button>}
        </div>)}
      <div className="p-3 flex gap-2 items-center">
        <label className="cursor-pointer text-2xl">🖼️<input type="file" accept="image/*" hidden onChange={e => image(e.target.files?.[0])} /></label>
        <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} placeholder={`# ${channel!.name} 😀`} className="flex-1 bg-b2 rounded-lg px-4 py-2.5 outline-none" />
        <button onClick={submit} className="bg-brand text-white px-4 py-2.5 rounded-lg">{t(profile!.lang, 'send')}</button>
      </div>
    </>)
}
