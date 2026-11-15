import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Message } from '../lib/types'
const SEL = '*, profiles(username, avatar_url)'
export function useMessages(channelId: string) {
  const [msgs, setMsgs] = useState<Message[]>([])
  useEffect(() => {
    supabase.from('messages').select(SEL).eq('channel_id', channelId).order('created_at').limit(100).then(({ data }) => setMsgs((data as any) ?? []))
    const ch = supabase.channel(`msgs:${channelId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `channel_id=eq.${channelId}` }, async p => {
        const { data } = await supabase.from('messages').select(SEL).eq('id', p.new.id).single()
        if (data) setMsgs(m => m.some(x => x.id === data.id) ? m : [...m, data as any]) })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, p => setMsgs(m => m.filter(x => x.id !== p.old.id)))
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [channelId])
  return msgs
}
