import React, { useEffect } from 'react'
import useChat from '../hook/useChat'
import { useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
const Dashboard = () => {
  const initializeSocketConnection = useChat();
  const { user } = useSelector(state => state.auth)
  console.log(user);
  const chat = useChat();
  useEffect(() => {
    chat.initializeSocketConnection()
  }, [])

  return (
    <main className='h-screen w-full bg-neutral-800 flex '>
      {/* sidebar */}
      <Sidebar />
      {/* main Content */}
      <div className='flex-1'>
        <ChatArea />
      </div>
    </main>
  )
}

export default Dashboard