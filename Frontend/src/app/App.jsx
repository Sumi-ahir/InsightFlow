import { RouterProvider } from 'react-router'
import { router } from './app.router'
import { useAuth } from '../features/auth/hook/useAuth'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setChats } from '../features/chat/chat.slice'
import { getChats } from '../features/chat/service/chat.api'

const App = () => {
  const dispatch = useDispatch()
  const auth = useAuth();
  const loading = useSelector((state) => state.auth.loading);

useEffect(() => {
  const init = async () => {
    try {
      // Google redirect પછી cookie settle થવા માટે થોડી રાહ
      await new Promise((res) => setTimeout(res, 500));

      await auth.handleGetMe();

      const res = await getChats();
      dispatch(setChats(res.chats || []));
    } catch (err) {
      console.log(err);
    }
  };

  init();
}, []);
  if (loading) {
    return (
      <div className="h-screen bg-[#171615] flex flex-col items-center justify-center">

        <div className="relative">
          <div className="w-15 h-15 border-4 border-zinc-800 rounded-full"></div>
          <div className="absolute inset-0 w-15 h-15 border-4 border-t-[#674188] rounded-full animate-spin"></div>
        </div>

        <h2 className="text-white text-xl font-semibold mt-6">
          InsightFlow
        </h2>';'

        <p className="text-zinc-400 mt-2">
          Thinking intelligently...
        </p>

      </div>
    );
  }
  return (
    <div className='bg-[#171615] h-screen'>
      <RouterProvider router={router} />
    </div>
  )
}

export default App