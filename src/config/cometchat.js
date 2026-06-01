export const TEST_USERS = [
  { uid: 'cometchat-uid-1', label: 'User 1 (Alice)' },
  { uid: 'cometchat-uid-2', label: 'User 2 (Bob)' },
  { uid: 'cometchat-uid-3', label: 'User 3' },
]

export function getCometChatConfig() {
  const appId = import.meta.env.VITE_COMETCHAT_APP_ID
  const region = import.meta.env.VITE_COMETCHAT_REGION
  const authKey = import.meta.env.VITE_COMETCHAT_AUTH_KEY

  const missing = []
  if (!appId) missing.push('VITE_COMETCHAT_APP_ID')
  if (!region) missing.push('VITE_COMETCHAT_REGION')
  if (!authKey) missing.push('VITE_COMETCHAT_AUTH_KEY')

  return {
    appId,
    region,
    authKey,
    isConfigured: missing.length === 0,
    missing,
  }
}
