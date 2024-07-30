import { useState, useEffect } from 'react'
import { useNavigate, Form } from 'react-router-dom'
import { v4 } from 'uuid'
import info from '../../info'
function DisplayPosts () {
    const navigate = useNavigate()
    const [posts, setPosts] = useState([])
    const userImg = (post) => {
        if (post.userPhoto === '1') {
            return '../../../blank-profile-picture-973460_640.png'
        } else {
            return post.userPhoto
        }
    }
    const [file, setFile] = useState('')
    const [pic, setPic] = useState('')
    const [content, setContent] = useState('')
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
    useEffect(() => {
        getInfo()
    }, [])
    if (localStorage.getItem('token')) {
        return <>
            <Form className='grid grid-rows-3 w-10/12 justify-center align-center h-40 mx-auto bg-gray-700 rounded-xl my-5'>
                <input className='h-8 self-center w-10/12 mx-auto' type="text" value={content} onChange={e => setContent(e.target.value)} required/>
                <input className='self-center w-10/12 mx-auto' type="file" accept='image/*' onChange={e => {
                    const reader = new FileReader()
                    reader.readAsDataURL(e.target.files[0])
                    reader.onloadend = () => {
                       setPic([{name: reader.result}])
                    }
                    setFile(e.target.files[0])
                }}/>
                <button className='text-gray-200' onClick={async click => {
                    click.preventDefault()
                    try {
                        const request = await fetch(info + '/api/posts', {
                            mode: 'cors',
                            method: 'POST',
                            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json'},
                            body: JSON.stringify({content: content})
                        })
                        if (request.status === 401) {
                            localStorage.clear()
                            navigate('/login')
                        } else if (request.status === 500) {
                            console.log("There was an error reaching the server")
                        } else {
                            if (file != '') {
                                const response = await request.json()
                                const formData = new FormData()
                                formData.append('img', file)
                                const req = await fetch(info + `/api/posts/${response.post}/picture`, {
                                    mode: 'cors',
                                    method: 'PUT',
                                    headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`},
                                    body: formData
                                })
                                if (req.status === 500) {
                                    console.log("There was an error reaching the server")
                                } else {
                                    const res = await req.json()
                                    if (res.errors) {
                                        console.log(res.errors)
                                    }
                                }
                            }
                            getInfo()
                        }
                    } catch {

                    }
                }}>Create Post</button>
            </Form>
            <div className='grid grid-cols-1 w-10/12 mx-auto overflow-scroll h-96 md:h-128'>
                {posts.map((post) => {
                    if (post.photo) {
                            return <button className='min-h-30 grid grid-rows-7 my-2 bg-gray-400' key={v4()} onClick={click => {
                                click.preventDefault()
                                navigate(`/post/${post._id}`)
                            }}>
                                <div className='row-span-2 grid grid-cols-4'>
                                    <img className='h-15 w-15 md:h-20 md:w-20 rounded-full place-self-center'  id='user-profile-picture' src={userImg(post)} alt={`${post.user}'s profile picture`} />
                                    <label className='self-center justify-self-start' htmlFor="user-profile-picture">{post.user}</label>
                                </div>
                                <img src={post.photo} alt="Photo in post" />
                                <p className='row-span-3' key={v4()}>{post.content}</p>
                            </button>
                    } else {
                        return <button className='min-h-30 grid grid-rows-5 my-2 bg-gray-400' key={v4()} onClick={click => {
                            click.preventDefault()
                            navigate(`/post/${post._id}`)
                        }}>
                            <div className='row-span-2 grid grid-cols-4'>
                                <img className='h-15 md:h-20 w-15 md:w-20 rounded-full place-self-center'  id='user-profile-picture' src={userImg(post)} alt={`${post.user}'s profile picture`} />
                                <label className='self-center justify-self-start' htmlFor="user-profile-picture">{post.user}</label>
                            </div>
                            <p className='row-span-3' key={v4()}>{post.content}</p>
                        </button>
                    }
                })}
            </div>
        </>
    } else {
        return <div className='grid grid-cols-1 w-10/12 mx-auto overflow-scroll md:h-128'>
            {posts.map((post) => {
                    if (post.photo) {
                        <div className='grid grid-cols-1 w-10/12 mx-auto'>
                        {posts.map((post) => {
                            return <button className='min-h-30 grid grid-rows-7 my-2 bg-gray-400' key={v4()} onClick={click => {
                                click.preventDefault()
                                navigate(`/login`)
                            }}>
                                <div className='row-span-2 grid grid-cols-4'>
                                    <img className='h-15 w-15 md:h-20 md:w-20 rounded-full place-self-center'  id='user-profile-picture' src={userImg(post)} alt={`${post.user}'s profile picture`} />
                                    <label className='self-center justify-self-start' htmlFor="user-profile-picture">{post.user}</label>
                                </div>
                                <img src={post.photo} alt="Photo in post" />
                                <p className='row-span-3' key={v4()}>{post.content}</p>
                            </button>
                        })}
                    </div>
                    } else {
                        return <button className='min-h-30 grid grid-rows-5 my-2 bg-gray-400' key={v4()} onClick={click => {
                            click.preventDefault()
                            navigate(`/login`)
                        }}>
                            <div className='row-span-2 grid grid-cols-4'>
                                <img className='h-15 w-15 md:h-20 md:w-20 rounded-full' id='user-profile-picture' src={userImg(post)} alt={`${post.user}'s profile picture`} />
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