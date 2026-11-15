export type Profile = { id: string; username: string; avatar_url: string | null; email: string; bio: string; theme: string; lang: string }
export type Server = { id: string; name: string; is_default: boolean }
export type Channel = { id: string; server_id: string; name: string; kind: 'text' | 'voice' }
export type Message = { id: string; channel_id: string; user_id: string; content: string; created_at: string; profiles?: { username: string; avatar_url: string | null } }
