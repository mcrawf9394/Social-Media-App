import { useState, useEffect } from 'react'
import { useNavigate, Form } from 'react-router-dom'
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
    }, [])
    socket.on('Recieve Posts', (Posts) => {
        setPosts(Posts)        
    })
    if (localStorage.getItem('token')) {
        return <>
            <Form className='grid grid-rows-3 w-10/12 justify-center align-center h-40 mx-auto'>
                <input className='h-8' type="text" value={content} onChange={e => setContent(e.target.value)} required/>
                <input className='' type="file" onChange={e => {
                    const reader = new FileReader()
                    reader.readAsDataURL(e.target.files[0])
                    reader.onloadend = () => {
                       setPic([{name: reader.result}])
                    }
                }}/>
                <button className='text-gray-200' onClick={ click => {
                    click.preventDefault()
                    const callback = (error) => {
                        console.error(error)
                    }
                    if (pic != '') {
                        socket.emit('Post',localStorage.getItem('token'), content, callback)
                    }
                    socket.emit('Post',localStorage.getItem('token'), content, callback, pic)
                }}>Create Post</button>
            </Form>
            {posts.map((post) => {
                return <button>
                    <p>{post.content}</p>
                </button>
            })}
        </>
    } else {
        return <>
            {posts.map((post) => {
                  return <button>
                    
                  </button>
            })}
        </>
    }
}
export default DisplayPosts