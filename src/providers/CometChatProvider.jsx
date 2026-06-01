import { createContext, useContext, useEffect, useState } from 'react'
import { CometChatUIKit, UIKitSettingsBuilder } from '@cometchat/chat-uikit-react'
import { getCometChatConfig } from '../config/cometchat'

const CometChatContext = createContext({
  isReady: false,
  error: null,
  activeUserId: null,
})

export function useCometChat() {
  return useContext(CometChatContext)
}

let initialized = false
let loginInFlight = null

async function ensureLoggedIn(uid) {
  const existing = await CometChatUIKit.getLoggedinUser()
  if (existing?.getUid() === uid) return

  if (existing) {
    await CometChatUIKit.logout()
  }

  if (loginInFlight) {
    await loginInFlight
    const after = await CometChatUIKit.getLoggedinUser()
    if (after?.getUid() === uid) return
  }

  loginInFlight = CometChatUIKit.login(uid)
  try {
    await loginInFlight
  } finally {
    loginInFlight = null
  }
}

export function CometChatProvider({ children, userId }) {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState(null)
  const config = getCometChatConfig()

  useEffect(() => {
    if (!config.isConfigured || !userId) {
      setIsReady(false)
      setError(null)
      return
    }

    let cancelled = false

    async function setup() {
      setIsReady(false)
      setError(null)

      try {
        if (!initialized) {
          initialized = true
          const settings = new UIKitSettingsBuilder()
            .setAppId(config.appId)
            .setRegion(config.region)
            .setAuthKey(config.authKey)
            .subscribePresenceForAllUsers()
            .build()

          await CometChatUIKit.init(settings)
        }

        await ensureLoggedIn(userId)

        if (!cancelled) {
          setIsReady(true)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e))
        }
      }
    }

    setup()

    return () => {
      cancelled = true
    }
  }, [userId, config.appId, config.region, config.authKey, config.isConfigured])

  if (!config.isConfigured) {
    return (
      <CometChatContext.Provider
        value={{ isReady: false, error: null, activeUserId: userId }}
      >
        {children}
      </CometChatContext.Provider>
    )
  }

  if (error) {
    return (
      <div className="cometchat-error" role="alert">
        <strong>CometChat error:</strong> {error}
      </div>
    )
  }

  if (!isReady) {
    return (
      <div className="cometchat-loading" aria-live="polite">
        Connecting to chat…
      </div>
    )
  }

  return (
    <CometChatContext.Provider
      value={{ isReady: true, error: null, activeUserId: userId }}
    >
      {children}
    </CometChatContext.Provider>
  )
}
