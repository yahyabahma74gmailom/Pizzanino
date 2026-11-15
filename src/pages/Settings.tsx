import { useState } from 'react'
import { supabase, LOGO } from '../lib/supabase'
import { useStore } from '../store/useStore'
import { t } from '../lib/i18n'
export default function Settings() {
  const { profile: p, updateProfile, openSettings } = useStore(); const [tab, setTab] = useState('account')
  const [name, setName] = useState(p!.username); const [bio, setBio] = useState(p!.bio ?? ''); const l = p!.lang
  const tabs = [['account', t(l, 'account')], ['appearance', t(l, 'appearance')], ['language', t(l, 'language')]]
  return (
    <div className="fixed inset-0 z-50 bg-b3 flex flex-col md:flex-row">
      <aside className="md:w-64 bg-b2 p-4 flex md:flex-col gap-1 overflow-x-auto">
        <div className="font-bold mb-2 hidden md:block">{LOGO} Pizza Socia {LOGO}</div>
        {tabs.map(([k, v]) => <button key={k} onClick={() => setTab(k)} className={`text-left px-3 py-2 rounded ${tab === k ? 'bg-b3' : 'text-mu'}`}>{v}</button>)}
        <button onClick={() => supabase.auth.signOut()} className="text-left px-3 py-2 rounded text-red-500 hover:bg-red-600/20">🚪 {t(l, 'logout')}</button>
      </aside>
      <section className="flex-1 p-6 overflow-y-auto max-w-xl">
        <button onClick={() => openSettings(false)} className="float-right text-2xl">✕</button>
        {tab === 'account' && <div className="space-y-3">
          <label className="block text-sm text-mu">Username<input value={name} onChange={e => setName(e.target.value)} className="block w-full bg-b1 rounded p-2 text-tx" /></label>
          <label className="block text-sm text-mu">Email<input value={p!.email} disabled className="block w-full bg-b1 rounded p-2 text-mu" /></label>
          <label className="block text-sm text-mu">Bio<textarea value={bio} onChange={e => setBio(e.target.value)} className="block w-full bg-b1 rounded p-2 text-tx" /></label>
          <button onClick={() => updateProfile({ username: name, bio })} className="bg-brand text-white px-4 py-2 rounded">Save</button></div>}
        {tab === 'appearance' && <div className="flex gap-2">{[['dark', 'Dark'], ['light', 'Light'], ['amoled', 'AMOLED']].map(([k, v]) =>
          <button key={k} onClick={() => updateProfile({ theme: k })} className={`px-4 py-2 rounded ${p!.theme === k ? 'bg-brand text-white' : 'bg-b1'}`}>{v}</button>)}</div>}
        {tab === 'language' && <div className="flex gap-2">{[['ar', 'العربية'], ['fr', 'Français'], ['en', 'English']].map(([k, v]) =>
          <button key={k} onClick={() => updateProfile({ lang: k })} className={`px-4 py-2 rounded ${l === k ? 'bg-brand text-white' : 'bg-b1'}`}>{v}</button>)}</div>}
      </section>
    </div>)
}
