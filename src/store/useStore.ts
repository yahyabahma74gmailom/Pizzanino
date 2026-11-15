import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { Profile, Server, Channel } from '../lib/types'
type S = { profile: Profile | null; servers: Server[]; channels: Channel[]; server: Server | null; channel: Channel | null; settings: boolean
  loadProfile: (id: string) => Promise<void>; loadServers: () => Promise<void>; pickServer: (s: Server) => Promise<void>
  setChannel: (c: Channel) => void; addServer: (name: string) => Promise<void>; updateProfile: (p: Partial<Profile>) => Promise<void>; openSettings: (v: boolean) => void; reset: () => void }
export const useStore = create<S>((set, get) => ({
  profile: null, servers: [], channels: [], server: null, channel: null, settings: false,
  loadProfile: async id => { const { data } = await supabase.from('profiles').select('*').eq('id', id).single()
    if (data) { set({ profile: data }); document.documentElement.dataset.theme = data.theme } },
  loadServers: async () => { const { data } = await supabase.from('servers').select('*').order('created_at'); set({ servers: data ?? [] }) },
  pickServer: async s => { const { data } = await supabase.from('channels').select('*').eq('server_id', s.id).order('created_at')
    set({ server: s, channels: data ?? [], channel: (data ?? []).find(c => c.kind === 'text') ?? null }) },
  setChannel: channel => set({ channel }),
  addServer: async name => { const p = get().profile!
    const { data } = await supabase.from('servers').insert({ name, owner: p.id }).select().single()
    if (!data) return
    await supabase.from('members').insert({ server_id: data.id, user_id: p.id })
    await supabase.from('channels').insert([{ server_id: data.id, name: 'général', kind: 'text' }, { server_id: data.id, name: 'vocal-1', kind: 'voice' }])
    await get().loadServers(); await get().pickServer(data) },
  updateProfile: async p => { const id = get().profile!.id; await supabase.from('profiles').update(p).eq('id', id)
    if (p.theme) document.documentElement.dataset.theme = p.theme
    set(s => ({ profile: { ...s.profile!, ...p } })) },
  openSettings: settings => set({ settings }),
  reset: () => set({ profile: null, servers: [], channels: [], server: null, channel: null, settings: false }) }))
