import { useStore } from '../store/useStore'
import { t } from '../lib/i18n'
export default function ChannelList() {
  const { server, channels, channel, setChannel, profile, openSettings } = useStore()
  return (
    <aside className="w-60 bg-b2 flex flex-col">
      <div className="h-12 px-4 flex items-center font-bold border-b border-black/20">{server ? server.name : 'Pizza Socia 🍕'}</div>
      <div className="flex-1 p-2 overflow-y-auto">
        {channels.map(c => (
          <button key={c.id} onClick={() => setChannel(c)} className={`w-full text-left px-2 py-1.5 rounded mb-0.5 ${channel?.id === c.id ? 'bg-b3' : 'text-mu hover:bg-b3/60'}`}>
            {c.kind === 'text' ? '#' : '🔊'} {c.name}</button>))}
      </div>
      <div className="h-14 bg-b1 flex items-center px-2 gap-2">
        {profile?.avatar_url ? <img src={profile.avatar_url} className="w-9 h-9 rounded-full" /> : <div className="w-9 h-9 rounded-full bg-brand grid place-items-center">🍕</div>}
        <span className="flex-1 truncate text-sm font-semibold">{profile?.username}</span>
        <button title={t(profile?.lang ?? 'ar', 'settings')} onClick={() => openSettings(true)} className="text-xl hover:text-brand">⚙️</button>
      </div>
    </aside>)
}
