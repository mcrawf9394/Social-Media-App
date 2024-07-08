import { Link, Routes, Route } from 'react-router-dom'
import DisplayPost from './DisplayPosts'
function App() {
  return <>
    <nav className='grid grid-cols-4 sticky top-0'>
      <h1 className='text-center text-lg text-gray-400 md:text-xl'>Space's for faces</h1>
      <Link></Link>
      <Link></Link>
      <Link></Link>
    </nav>
    <Routes>
      <Route path='home' element={<DisplayPost />}/>
      <Route />
      <Route />
      <Route />
      <Route />
      <Route />
      <Route />
    </Routes>
    <footer className='absolute bottom-0 text-gray-400 w-full text-center'>Made by Sam Crawford - <a target="_blank" href="https://icons8.com/icon/122808/people-working-together">Talking</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a></footer>
    </>
}

export default App
