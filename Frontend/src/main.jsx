import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import App from './components/App.jsx'
import DisplayPosts from './components/DisplayPosts.jsx'
import ErrorPage from './components/Error-Page.jsx'
import SignUp from './components/profile/Sign-up.jsx'
import Login from './components/profile/Login.jsx'
import Profile from './components/profile/Profile.jsx'
import ViewProfile from './components/profile/ViewProfile.jsx'
import Friends from './components/profile/Friends.jsx'
import SinglePost from './components/SinglePost.jsx'
import './stylesheet/index.css'

const Router = createBrowserRouter([
  {
    path: '*',
    element: <App/>,
    errorElement: <ErrorPage />,
    children: [
      { path: 'home', element: <DisplayPosts /> },
      { path: 'signup', element: <SignUp /> },
      { path: 'login', element: <Login /> },
      { path: 'currentuser/:userId', element: <Profile /> },
      { path: 'profile/:userId', element: <ViewProfile /> },
      { path: 'currentuser/:userId/friends', element: <Friends /> },
      { path: 'post/:postId', element: <SinglePost />}
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={Router} />
  </React.StrictMode>,
)
