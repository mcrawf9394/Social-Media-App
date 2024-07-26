import { useState, useEffect } from 'react'
import { useNavigate, Form } from 'react-router-dom'
import { v4 } from 'uuid'
import info from '../../info'
import io from 'socket.io-client'
function DisplayPosts () {
    const navigate = useNavigate()
    const socket = io(info)
    const [posts, setPosts] = useState([])
    const [pic, setPic] = useState('')
    const [content, setContent] = useState('')
    useEffect(() => {
        socket.emit('Join-Posts')
        const getInfo = async () => {
            try {
                const getPosts = await fetch(info + '/api/posts', {
                    mode: 'cors',
                    method: 'GET'
                })
                const posts = await getPosts.json()
                setPosts(posts.posts)
            } catch (err) { 
                console.log(err)
            }
        }
        getInfo()
    }, [])
    socket.on('Recieve-Posts', (Posts) => {
        setPosts(Posts)        
    })
    if (localStorage.getItem('token')) {
        return <>
            <Form className='grid grid-rows-3 w-10/12 justify-center align-center h-40 mx-auto bg-gray-700 rounded-xl my-5'>
                <input className='h-8 self-center w-10/12 mx-auto' type="text" value={content} onChange={e => setContent(e.target.value)} required/>
                <input className='self-center w-10/12 mx-auto' type="file" onChange={e => {
                    const reader = new FileReader()
                    reader.readAsDataURL(e.target.files[0])
                    reader.onloadend = () => {
                       setPic([{name: reader.result}])
                    }
                }}/>
                <button className='text-gray-200' onClick={click => {
                    click.preventDefault()
                    if (pic != '') {
                        socket.emit('Post',localStorage.getItem('token'), content)
                    } else {
                        socket.emit('Post',localStorage.getItem('token'), content)
                    }
                    let getNewPost = async () => {
                        try {
                            const getPosts = await fetch(info +'/api/posts', {
                                mode: 'cors',
                                method: 'GET'
                            })
                            const allPosts = await getPosts.json()
                            setPosts(allPosts.posts)
                        } catch {
                            console.log('There was an issue reaching the server')
                        }
                    }
                    getNewPost()
                }}>Create Post</button>
            </Form>
            <div className='grid grid-cols-1 w-10/12 mx-auto'>
                {posts.map((post) => {
                    if (post.photo) {
                        <div className='grid grid-cols-1 w-10/12 mx-auto'>
                        {posts.map((post) => {
                            return <button className='min-h-20 grid grid-rows-7 my-2 bg-gray-400' key={v4()} onClick={click => {
                                click.preventDefault()
                                socket.disconnect()
                                navigate(`/post/${post._id}`)
                            }}>
                                <div className='row-span-2 grid grid-cols-4'>
                                    <img className='h-20 w-20 rounded-full place-self-center'  id='user-profile-picture' src={post.userPhoto} alt={`${post.user}'s profile picture`} />
                                    <label className='self-center justify-self-start' htmlFor="user-profile-picture">{post.user}</label>
                                </div>
                                <img src={post.photo} alt="Photo in post" />
                                <p className='row-span-3' key={v4()}>{post.content}</p>
                            </button>
                        })}
                    </div>
                    } else {
                        return <button className='min-h-20 grid grid-rows-5 my-2 bg-gray-400' key={v4()} onClick={click => {
                            click.preventDefault()
                            socket.disconnect()
                            navigate(`/post/${post._id}`)
                        }}>
                            <div className='row-span-2 grid grid-cols-4'>
                                <img className='h-20 w-20 rounded-full place-self-center'  id='user-profile-picture' src={post.userPhoto} alt={`${post.user}'s profile picture`} />
                                <label className='self-center justify-self-start' htmlFor="user-profile-picture">{post.user}</label>
                            </div>
                            <p className='row-span-3' key={v4()}>{post.content}</p>
                        </button>
                    }
                })}
            </div>
        </>
    } else {
        return <div className='grid grid-cols-1 w-10/12 mx-auto'>
        {posts.map((post) => {
                    if (post.photo) {
                        <div className='grid grid-cols-1 w-10/12 mx-auto'>
                        {posts.map((post) => {
                            return <button className='min-h-20 grid grid-rows-7 my-2 bg-gray-400' key={v4()} onClick={click => {
                                click.preventDefault()
                                socket.disconnect()
                                navigate(`/login`)
                            }}>
                                <div className='row-span-2 grid grid-cols-4'>
                                    <img className='h-20 w-20 rounded-full place-self-center'  id='user-profile-picture' src={post.userPhoto} alt={`${post.user}'s profile picture`} />
                                    <label className='self-center justify-self-start' htmlFor="user-profile-picture">{post.user}</label>
                                </div>
                                <img src={post.photo} alt="Photo in post" />
                                <p className='row-span-3' key={v4()}>{post.content}</p>
                            </button>
                        })}
                    </div>
                    } else {
                        return <button className='min-h-20 grid grid-rows-5 my-2 bg-gray-400' key={v4()} onClick={click => {
                            click.preventDefault()
                            socket.disconnect()
                            navigate(`/login`)
                        }}>
                            <div className='row-span-2 grid grid-cols-4'>
                                <img className='h-20 w-20 rounded-full' id='user-profile-picture' src={post.userPhoto} alt={`${post.user}'s profile picture`} />
                                <label className='self-center' htmlFor="user-profile-picture">{post.user}</label>
                            </div>
                            <p className='row-span-3' key={v4()}>{post.content}</p>
                        </button>
                    }
                })}
    </div>
    }
}
export default DisplayPosts