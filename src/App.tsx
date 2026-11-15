import { useEffect, useState } from 'react'
import { App as CapApp } from '@capacitor/app'
import { Browser } from '@capacitor/browser'
import { supabase } from './lib/supabase'
import { useStore } from './store/useStore'
import Login from './pages/Login'
import Home from './pages/Home'
export default function App() {
  const [ready, setReady] = useState(false); const [uid, setUid] = useState<string | null>(null)
  const { loadProfile, loadServers, reset } = useStore()
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_e, s) => { setUid(s?.user.id ?? null); setReady(true)
      if (s) setTimeout(async () => { await loadProfile(s.user.id); await loadServers() }, 0); else reset() })
    const h = CapApp.addListener('appUrlOpen', async ({ url }) => {
      if (!url.startsWith('pizzasocia://')) return
      const q = new URLSearchParams(url.split('#')[1] ?? ''); const a = q.get('access_token'), r = q.get('refresh_token')
      if (a && r) await supabase.auth.setSession({ access_token: a, refresh_token: r })
      Browser.close().catch(() => {}) })
    return () => { data.subscription.unsubscribe(); h.then(x => x.remove()) }
  }, [])
  if (!ready) return <div className="h-full grid place-items-center text-6xl animate-bounce">🍕</div>
  return uid ? <Home /> : <Login />
}
