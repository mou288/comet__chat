import { useState } from 'react'
import {
  CometChatConversations,
  CometChatMessageHeader,
  CometChatMessageList,
  CometChatMessageComposer,
  CometChatUsers,
} from '@cometchat/chat-uikit-react'
import { CometChat } from '@cometchat/chat-sdk-javascript'
import { useCometChat } from '../providers/CometChatProvider'

function ActiveChat({ selectedUser, selectedGroup }) {
  if (!selectedUser && !selectedGroup) {
    return (
      <div className="chat-empty">
        <p>Select a conversation or pick a user to start chatting.</p>
        <p className="chat-hint">
          To test with two people: open this app in two windows, sign in as
          different users, then message each other from the Users tab.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="chat-header-slot">
        {selectedUser && <CometChatMessageHeader user={selectedUser} />}
        {selectedGroup && <CometChatMessageHeader group={selectedGroup} />}
      </div>
      <div className="chat-list-slot">
        {selectedUser && (
          <CometChatMessageList user={selectedUser} hideReplyInThreadOption />
        )}
        {selectedGroup && (
          <CometChatMessageList group={selectedGroup} hideReplyInThreadOption />
        )}
      </div>
      <div className="chat-composer-slot">
        {selectedUser && <CometChatMessageComposer user={selectedUser} />}
        {selectedGroup && <CometChatMessageComposer group={selectedGroup} />}
      </div>
    </>
  )
}

export default function ChatPage() {
  const { activeUserId } = useCometChat()
  const [sidebarTab, setSidebarTab] = useState('chats')
  const [selectedUser, setSelectedUser] = useState()
  const [selectedGroup, setSelectedGroup] = useState()

  function selectUser(user) {
    setSelectedUser(user)
    setSelectedGroup(undefined)
  }

  function selectGroup(group) {
    setSelectedUser(undefined)
    setSelectedGroup(group)
  }

  function handleConversationClick(conversation) {
    const entity = conversation.getConversationWith()
    if (entity instanceof CometChat.User) {
      selectUser(entity)
    } else if (entity instanceof CometChat.Group) {
      selectGroup(entity)
    }
  }

  return (
    <div className="chat-shell">
      <aside className="chat-sidebar">
        <div className="chat-sidebar-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={sidebarTab === 'chats'}
            className={sidebarTab === 'chats' ? 'active' : ''}
            onClick={() => setSidebarTab('chats')}
          >
            Chats
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={sidebarTab === 'users'}
            className={sidebarTab === 'users' ? 'active' : ''}
            onClick={() => setSidebarTab('users')}
          >
            Users
          </button>
        </div>
        <div className="chat-sidebar-panel">
          {sidebarTab === 'chats' && (
            <CometChatConversations onItemClick={handleConversationClick} />
          )}
          {sidebarTab === 'users' && (
            <CometChatUsers
              onItemClick={(user) => {
                if (user.getUid() !== activeUserId) {
                  selectUser(user)
                }
              }}
            />
          )}
        </div>
      </aside>

      <section className="chat-main">
        <ActiveChat selectedUser={selectedUser} selectedGroup={selectedGroup} />
      </section>
    </div>
  )
}
