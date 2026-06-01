import { getCometChatConfig } from '../config/cometchat'

export default function SetupScreen() {
  const { missing } = getCometChatConfig()

  return (
    <main className="setup-screen">
      <h1>Set up CometChat</h1>
      <p>
        Add your CometChat credentials so two test users can message each other.
      </p>

      <section>
        <h2>Option A — CLI (recommended)</h2>
        <pre className="setup-code">
{`npx @cometchat/skills-cli auth signup
npx @cometchat/skills-cli provision setup \\
  --name comet-chat-app-chat --region us \\
  --industry saas_businesses --framework reactjs`}
        </pre>
        <p>
          This writes <code>.env</code> with <code>VITE_COMETCHAT_*</code> variables.
          Restart <code>npm run dev</code> after provisioning.
        </p>
      </section>

      <section>
        <h2>Option B — paste keys manually</h2>
        <ol>
          <li>
            Copy <code>.env.example</code> to <code>.env</code>
          </li>
          <li>
            Fill values from{' '}
            <a
              href="https://app.cometchat.com"
              target="_blank"
              rel="noreferrer"
            >
              app.cometchat.com
            </a>{' '}
            → Your App → API &amp; Auth Keys
          </li>
          <li>Restart the dev server</li>
        </ol>
        {missing.length > 0 && (
          <p className="setup-missing">
            Missing: {missing.join(', ')}
          </p>
        )}
      </section>

      <section>
        <h2>Test two users</h2>
        <p>
          Each new CometChat app includes test users <code>cometchat-uid-1</code>{' '}
          through <code>cometchat-uid-5</code>. Open two browser windows (or one
          normal + one private), sign in as different users, open the{' '}
          <strong>Users</strong> tab, and start a chat with the other user.
        </p>
      </section>
    </main>
  )
}
