import { useEffect, useState } from 'react'
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
    return () => data.subscription.unsubscribe()
  }, [])
  if (!ready) return <div className="h-full grid place-items-center text-6xl animate-bounce">🍕</div>
  return uid ? <Home /> : <Login />
}
