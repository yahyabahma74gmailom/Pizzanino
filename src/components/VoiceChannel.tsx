import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'
type Peer = { id: string; username: string; avatar: string | null; muted: boolean; deafened: boolean }
export default function VoiceChannel() {
  const { channel, profile } = useStore(); const [peers, setPeers] = useState<Peer[]>([]); const [joined, setJoined] = useState(false)
  const [muted, setMuted] = useState(false); const [deaf, setDeaf] = useState(false)
  const room = useRef<any>(); const stream = useRef<MediaStream>()
  const me = (m: boolean, d: boolean): Peer => ({ id: profile!.id, username: profile!.username, avatar: profile!.avatar_url, muted: m, deafened: d })
  useEffect(() => {
    const r = supabase.channel(`voice:${channel!.id}`, { config: { presence: { key: profile!.id } } })
    r.on('presence', { event: 'sync' }, () => setPeers(Object.values(r.presenceState()).map((a: any) => a[0] as Peer))).subscribe()
    room.current = r; return () => { stream.current?.getTracks().forEach(t => t.stop()); supabase.removeChannel(r) }
  }, [])
  const join = async () => { try { stream.current = await navigator.mediaDevices.getUserMedia({ audio: { noiseSuppression: true, echoCancellation: true } }) } catch { alert('الميكرو ما مسموحش'); return }
    setJoined(true); room.current.track(me(false, false)) }
  const leave = () => { stream.current?.getTracks().forEach(t => t.stop()); setJoined(false); setMuted(false); setDeaf(false); room.current.untrack() }
  const toggleMute = () => { const v = !muted; setMuted(v); stream.current?.getAudioTracks().forEach(t => (t.enabled = !v)); room.current.track(me(v, deaf)) }
  const toggleDeaf = () => { const v = !deaf; setDeaf(v); const m = v ? true : muted; setMuted(m); stream.current?.getAudioTracks().forEach(t => (t.enabled = !m)); room.current.track(me(m, v)) }
  return (
    <div className="flex-1 flex flex-col items-center p-6">
      <h2 className="text-xl font-bold mb-4">🔊 {channel!.name}</h2>
      <div className="flex flex-wrap gap-4 justify-center flex-1">
        {peers.length === 0 && <p className="text-mu">ما كاين حتى واحد 🍕</p>}
        {peers.map(p => (<div key={p.id} className="text-center w-24">
          {p.avatar ? <img src={p.avatar} className="w-16 h-16 rounded-full mx-auto ring-2 ring-green-500" /> : <div className="w-16 h-16 rounded-full bg-brand mx-auto grid place-items-center text-2xl">🍕</div>}
          <p className="text-sm truncate">{p.username} {p.muted && '🔇'}{p.deafened && '🎧'}</p></div>))}
      </div>
      <div className="flex gap-3">
        {!joined ? <button onClick={join} className="bg-green-600 text-white px-6 py-3 rounded-full">🎙️ دخل</button> : <>
          <button onClick={toggleMute} className={`px-5 py-3 rounded-full ${muted ? 'bg-red-600 text-white' : 'bg-b2'}`}>{muted ? '🔇 Unmute' : '🎙️ Mute'}</button>
          <button onClick={toggleDeaf} className={`px-5 py-3 rounded-full ${deaf ? 'bg-red-600 text-white' : 'bg-b2'}`}>{deaf ? '🎧 Undeafen' : '🎧 Deafen'}</button>
          <button onClick={leave} className="bg-red-600 text-white px-5 py-3 rounded-full">📞 خرج</button></>}
      </div>
    </div>)
}
