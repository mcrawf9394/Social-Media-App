import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import App from './components/App.jsx'
import DisplayPosts from './components/posts/DisplayPosts.jsx'
import ErrorPage from './components/Error-Page.jsx'
import SignUp from './components/profile/Sign-up.jsx'
import Login from './components/profile/Login.jsx'
import Profile from './components/profile/Profile.jsx'
import ViewProfile from './components/profile/ViewProfile.jsx'
import Friends from './components/profile/Friends.jsx'
import SinglePost from './components/posts/SinglePost.jsx'
import UserList from './components/profile/UserList.jsx'
import './stylesheet/index.css'
import DeleteDialog from './components/profile/DeleteDialog.jsx'

const Router = createBrowserRouter([
  {
    path: '*',
    element: <App/>,
    errorElement: <ErrorPage />,
    children: [
      { path: '', element: <DisplayPosts /> },
      { path: 'signup', element: <SignUp /> },
      { path: 'login', element: <Login /> },
      { path: 'currentuser/:userId', element: <Profile />,children: [{element: <DeleteDialog />}]},
      { path: 'profile/:userId', element: <ViewProfile /> },
      { path: 'currentuser/:userId/following', element: <Friends /> },
      { path: 'post/:postId', element: <SinglePost />},
      { path: 'users', element: <UserList />}
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={Router} />
  </React.StrictMode>,
)
