import { useState } from 'react'
import { useStore } from '../store/useStore'
import { LOGO, APP_NAME } from '../lib/supabase'
import { t } from '../lib/i18n'
import ServerList from '../components/ServerList'
import ChannelList from '../components/ChannelList'
import Chat from '../components/Chat'
import VoiceChannel from '../components/VoiceChannel'
import Settings from './Settings'
export default function Home() {
  const { server, channel, profile, settings } = useStore(); const [menu, setMenu] = useState(false)
  return (
    <div className="h-full flex flex-col">
      <header className="h-10 bg-b1 flex items-center px-3 gap-2 font-bold text-sm shrink-0">
        <button className="md:hidden" onClick={() => setMenu(!menu)}>☰</button><span>{LOGO} {APP_NAME} {LOGO}</span></header>
      <div className="flex-1 flex min-h-0 relative">
        <div className={`${menu ? 'flex' : 'hidden'} md:flex absolute md:static inset-y-0 z-20 h-full`}><ServerList /><ChannelList /></div>
        <main className="flex-1 min-w-0 flex flex-col">
          {!server ? <div className="m-auto text-center text-mu"><div className="text-7xl">{LOGO}</div><p className="mt-3 text-lg">{t(profile?.lang ?? 'ar', 'pick')}</p></div>
            : channel?.kind === 'voice' ? <VoiceChannel key={channel.id} /> : channel ? <Chat key={channel.id} /> : null}
        </main>
      </div>
      {settings && <Settings />}
    </div>)
}
