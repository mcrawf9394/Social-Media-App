import info from "../../info"
import {useState, useEffect} from 'react'
import {useNavigate, Form, useParams} from "react-router-dom"
import { v4 } from "uuid"
import { io } from "socket.io-client"
function SinglePost () {
    const navigate = useNavigate()
    const socket = io(info)
    const params = useParams()
    const [canEdit, setCanEdit] = useState(false)
    const [post, setPost] = useState({user: " ", content: "Loading", likes: ["1"]})
    const [isLiked, setIsLiked] = useState(false)
    const [numLikes, setNumLikes] = useState(0)
    const [thumbsUp, setThumbsUp] = useState('../../../icons8-facebook-like-25.png')
    const [comments, setComments] = useState([{userName: ' ', content: ' '}])
    const [errors, setErrors] = useState([{msg: ''}])
    useEffect(() => {
        socket.emit('Join-Post', params.postId)
        const getInfo = async () => {
        try {
            const request = await fetch(info + `/api/posts/${params.postId}`, {
                mode: 'cors',
                method: 'GET',
                headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
            })
            if (request.status != 200) {
                setErrors([{msg: 'There was an issue reaching the database'}])
            } else {
                const response = await request.json()
                setCanEdit(response.canEdit)
                setPost(response.post)
                setNumLikes(response.post.likes.length)
                setComments(response.comments)
                setIsLiked(response.isLiked)
                if (response.isLiked) {
                    setThumbsUp('../../../icons8-facebook-like-25-dark.png')
                }
            }
        } catch {
            setErrors([{msg: 'There was an error reaching the server'}])
        }
      } 
      getInfo() 
    }, [])
    socket.on('Recieve-Comments', (Comments) => {
        setComments(Comments)
    }) 
    if (canEdit === true) {
        return <>
            <div className="bg-gray-200">
                <h2 className="">{post.user}</h2>
                <p className="">{post.content}</p>
                <button className="" onClick={async click => {
                    click.preventDefault()
                    try {
                        const request = await fetch (info +`/api/posts/${params.postId}/like`, {
                            mode: 'cors',
                            method: 'PUT',
                            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
                        })
                        if (request.status != 200) {
                            if (request.status === 401) {
                                localStorage.clear()
                                navigate('/login')
                            } else {
                                setErrors([{msg: "There was an error reaching the database"}])
                            }
                        } else {
                            const response = await request.json()
                            setPost(response.post)
                            if (isLiked === false) {
                                setIsLiked(true)
                                setThumbsUp('../../../icons8-facebook-like-25-dark.png')
                                setNumLikes(numLikes + 1)
                            } else {
                                setIsLiked(false)
                                setNumLikes(numLikes - 1)
                                setThumbsUp('../../../icons8-facebook-like-25.png')
                            }
                        }
                    } catch {
                        setErrors([{msg: "There was an issue reaching the server"}])
                    }
                }}>
                    <h3 className="">{numLikes}</h3>
                    <img className="" src={thumbsUp} alt="Thumbs up icon" />
                </button>
                <button className="" onClick={async (click) => {
                    click.preventDefault()
                    try {
                        const request = await fetch(info + `/api/posts/${params.postId}`, {
                            mode: 'cors',
                            method: 'DELETE',
                            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
                        })
                        if (request.status != 200) {
                            if (request.status === 401) {
                                localStorage.clear()
                                navigate('/login')
                            } else {
                                setErrors([{msg: "There was an error reaching the database"}])
                            }
                        } else {
                            socket.disconnect()
                            navigate('/')
                        }
                    } catch {
                        setErrors([{msg: "There was an error reaching the server"}])
                    }
                }}>
                    <img src="../../../icons8-delete-64.png" alt="Trash Can Icon" />
                </button>
            </div>
            <Form className="">
                <input className="" type="text" required/>
                <button className="" onClick={async click => {
                    click.preventDefault()

                }}>Add Comment</button>
            </Form>
            <ul className="">
                {comments.map(comment => {
                    return <li key={v4()}>
                        <h4 className="" key={v4()}>{comment.userName}</h4>
                        <p className="" key={v4()}>{comment.content}</p>
                    </li>
                })}
            </ul>
            <ul>
                {errors.map(error => {
                    return <li key={v4()}>{error.msg}</li>
                })}
            </ul>
        </>
    }
    else {
        return <>
            <div className="bg-gray-200">
                <h2 className="">{post.user}</h2>
                <p className="">{post.content}</p>
                <button className="" onClick={async click => {
                    click.preventDefault()
                    try {
                        const request = await fetch (info +`/api/posts/${params.postId}/like`, {
                            mode: 'cors',
                            method: 'PUT',
                            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
                        })
                        if (request.status != 200) {
                            if (request.status === 401) {
                                localStorage.clear()
                                navigate('/login')
                            } else {
                                setErrors([{msg: "There was an error reaching the database"}])
                            }
                        } else {
                            const response = await request.json()
                            setPost(response.post)
                            if (isLiked === false) {
                                setIsLiked(true)
                                setThumbsUp('../../../icons8-facebook-like-25-dark.png')
                            } else {
                                setIsLiked(false)
                                setThumbsUp('../../../icons8-facebook-like-25.png')
                            }
                        }
                    } catch {
                        setErrors([{msg: "There was an issue reaching the server"}])
                    }
                }}>
                    <h3 className="">{post.likes.length}</h3>
                    <img className="" src={thumbsUp} alt="Thumbs up icon" />
                </button>
            </div>
            <Form className="">
                <input className="" type="text" required/>
                <button className="" onClick={async click => {
                    click.preventDefault()

                }}>Add Comment</button>
            </Form>
            <ul className="">
                {comments.map(comment => {
                    return <li key={v4()}>
                        <h4 className="" key={v4()}>{comment.userName}</h4>
                        <p className="" key={v4()}>{comment.content}</p>
                    </li>
                })}
            </ul>
            <ul>
                {errors.map(error => {
                    return <li key={v4()}>{error.msg}</li>
                })}
            </ul>
        </>
    }
}
export default SinglePost