import { useNavigate, Routes, Route } from 'react-router-dom'
import DisplayPost from './posts/DisplayPosts'
import Login from './profile/Login'
import UserList from './profile/UserList'
import Profile from './profile/Profile'
import Friends from './profile/Friends'
import ViewProfile from './profile/ViewProfile'
import SignUp from './profile/Sign-up'
import SinglePost from './posts/SinglePost'
import DeleteOtherUsers from './Admin/DeleteOtherUsers'
import info from '../info'
function App() {
  const navigate = useNavigate()
  return <>
    <nav className='grid grid-cols-4 sticky top-0'>
      <button className='text-center text-lg text-gray-400 md:text-xl' onClick={click => {
        click.preventDefault()
        navigate('/')
      }}>Space's for faces</button>
      <button className='text-gray-400' onClick={async (click) => {
        click.preventDefault()
        if (localStorage.getItem('token')) {
          try {
            const request = await fetch(info + '/api/users/auth', {
              mode: 'cors',
              method: 'get',
              headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
            })
            if (request.status === 401) {
              localStorage.clear()
              navigate('/login')
            } else {
            const response = await request.json()
              navigate(`/currentuser/${response.id}}/following`)
            }
          }
          catch {
            console.log('error reaching the server')
          }
        } else {
          navigate('/login')
        }
      }}>Following</button>
      <button className='text-gray-400' onClick={(click) => {
        click.preventDefault()
        if (localStorage.getItem('token')) {
          navigate('/users')
        } else {
          navigate('/login')
        }
      }}>Find People</button>
      <button className='text-gray-400' onClick={async (click) => {
        click.preventDefault()
        if (localStorage.getItem('token')) {
          try {
            const request = await fetch(info + '/api/users/auth', {
              mode: 'cors',
              method: 'get',
              headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
            })
            if (request.status === 401) {
              localStorage.clear()
              navigate('/login')
            } else {
              const response = await request.json()
              navigate(`/currentuser/${response.id}`)
            }
          } catch {
            console.log('error reaching the server')
          }
        } else {
          navigate('/login')
        }
      }}>Profile</button>
    </nav>
    <Routes>
      <Route path='/' element={<DisplayPost />}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/users' element={<UserList />}/>
      <Route path='/currentuser/:userId' element={<Profile />}/>
      <Route path='/currentuser/:userId/following' element={<Friends />}/>
      <Route path='/profile/:userId' element={<ViewProfile />}/>
      <Route path='/signup' element={<SignUp />}/>
      <Route path='/post/:postId' element={<SinglePost />}/>
      <Route path='/admin/deleteusers' element={<DeleteOtherUsers />}/>
    </Routes>
    <footer className='absolute bottom-0 text-gray-400 w-full text-center'>Made by Sam Crawford - <a target="_blank" href="https://icons8.com/icon/122808/people-working-together">Talking</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a></footer>
    </>
}

export default App
