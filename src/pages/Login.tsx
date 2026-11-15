import { Capacitor } from '@capacitor/core'
import { Browser } from '@capacitor/browser'
import { supabase, LOGO, APP_NAME } from '../lib/supabase'
export default function Login() {
  const go = async () => {
    if (Capacitor.isNativePlatform()) {
      const { data } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: 'pizzasocia://auth', skipBrowserRedirect: true } })
      if (data?.url) await Browser.open({ url: data.url })
    } else supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })
  }
  return (
    <div className="h-full grid place-items-center bg-gradient-to-br from-orange-600 via-red-600 to-yellow-500 p-4">
      <div className="bg-b2 rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl">
        <div className="text-7xl">{LOGO}</div>
        <h1 className="text-3xl font-bold mt-2">{APP_NAME} {LOGO}</h1>
        <p className="text-mu mt-1 mb-6">مرحبا بيك! دخل باش تبدا الهضرة</p>
        <button onClick={go} className="w-full bg-brand hover:opacity-90 text-white font-semibold py-3 rounded-lg mb-3">✨ إنشاء حساب جديد بـ Gmail</button>
        <button onClick={go} className="w-full bg-b3 hover:bg-b1 py-3 rounded-lg border border-mu/30">🔑 تسجيل الدخول بـ Gmail</button>
      </div>
    </div>)
}
