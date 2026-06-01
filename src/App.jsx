import { useState } from 'react'
import { getCometChatConfig, TEST_USERS } from './config/cometchat'
import { CometChatProvider } from './providers/CometChatProvider'
import SetupScreen from './components/SetupScreen'
import ChatPage from './pages/ChatPage'
import './App.css'

function App() {
  const config = getCometChatConfig()
  const [activeUserId, setActiveUserId] = useState(TEST_USERS[0].uid)

  if (!config.isConfigured) {
    return <SetupScreen />
  }

  return (
    <CometChatProvider userId={activeUserId}>
      <div className="app">
        <header className="app-header">
          <h1>CometChat</h1>
          <label className="user-switcher">
            <span>Signed in as</span>
            <select
              value={activeUserId}
              onChange={(e) => setActiveUserId(e.target.value)}
              aria-label="Switch test user"
            >
              {TEST_USERS.map(({ uid, label }) => (
                <option key={uid} value={uid}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </header>
        <ChatPage />
      </div>
    </CometChatProvider>
  )
}

export default App
