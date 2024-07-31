import info from "../../info"
import {useState, useEffect} from 'react'
import {useNavigate, Form, useParams} from "react-router-dom"
import { v4 } from "uuid"
function PostImg ({post}) {
    if (post.photo) {
        return <img src={post.photo} alt="This is a photo that was included with the post"></img>
    } else {
        return <></>
    }
}
function SinglePost () {
    const navigate = useNavigate()
    const params = useParams()
    const [canEdit, setCanEdit] = useState(false)
    const [post, setPost] = useState({user: " ", content: "Loading", likes: ["1"]})
    const userImg = (post) => {
        if (post.userPhoto === '1') {
            return '../../../blank-profile-picture-973460_640.png'
        } else {
            return post.userPhoto
        }
    }
    const [isLiked, setIsLiked] = useState(false)
    const [numLikes, setNumLikes] = useState(0)
    const [thumbsUp, setThumbsUp] = useState('../../../icons8-facebook-like-25.png')
    const [comments, setComments] = useState([{userName: ' ', content: ' '}])
    const [content, setContent] = useState('')
    const [errors, setErrors] = useState([{msg: ''}])
    useEffect(() => {
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
    if (canEdit === true) {
        return <>
            <div className="bg-gray-200 my-5 grid grid-rows-3 grid-cols-2 gap-y-5 w-10/12 mx-auto">
                <div className="col-span-2 inline-flex">
                    <img className='h-20 w-20 rounded-full place-self-center' src={userImg(post)} alt={`${post.user}'s profile picture`} />
                    <h2 className="ml-5 self-center">{post.user}</h2>
                </div>
                <PostImg post={post}/>
                <p className="col-span-2 text-center w-10/12 mx-auto">{post.content}</p>
                <button className="inline-flex justify-self-end self-center" onClick={async click => {
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
                <button className="w-7 h-7 self-center" onClick={async (click) => {
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
                            navigate('/')
                        }
                    } catch {
                        setErrors([{msg: "There was an error reaching the server"}])
                    }
                }}>
                    <img src="../../../icons8-delete-64.png" alt="Trash Can Icon" />
                </button>
            </div>
            <Form className="w-10/12 mx-auto bg-gray-700 grid grid-cols-4">
                <input className="col-span-3" type="text" value={content} onChange={e => {setContent(e.target.value)}}  required/>
                <button className="" onClick={async click => {
                    click.preventDefault()
                    try {
                        const request = await fetch(info + '/api/comments', {
                            mode: 'cors',
                            method: 'POST',
                            headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`, "Content-Type": "application/json"},
                            body: JSON.stringify({
                                content: content,
                                post: params.postId
                            })
                        })
                        if (request.status != 200) {
                            if (request.status === 401) {
                                localStorage.clear()
                                navigate('/login')
                            } else {
                                console.log("There was an error reaching the server")
                            }
                        } else {
                            const response = await request.json()
                            if (response.errors) {
                                console.log(response.errors)
                            } else {
                                let arr = [...comments, response.comment]
                                setComments(arr)
                            }
                        }
                    } catch {
                        console.log("There was an error reaching the server")
                    }
                }}>Add Comment</button>
            </Form>
            <ul className="">
                {comments.map(comment => {
                    return <li key={v4()}>
                        <h4 className="text-white" key={v4()}>{comment.userName}</h4>
                        <p className="text-white" key={v4()}>{comment.content}</p>
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
            <div className="bg-gray-200 my-5 grid grid-rows-3 grid-cols-2 gap-y-5 w-10/12 mx-auto">
            <div className="col-span-2 inline-flex">
                    <img className='h-20 w-20 rounded-full place-self-center' src={userImg(post)} alt={`${post.user}'s profile picture`} />
                    <h2 className="ml-5 self-center">{post.user}</h2>
                </div>
                <PostImg post={post}/>
                <p className="col-span-2 text-center w-10/12 mx-auto">{post.content}</p>
                <button className="inline-flex justify-self-end self-center" onClick={async click => {
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
                </div>
            <Form className="w-10/12 mx-auto bg-gray-700 grid grid-cols-4">
                <input className="col-span-3" type="text" value={content} onChange={e => {setContent(e.target.value)}} required/>
                <button className="" onClick={async click => {
                    click.preventDefault()
                    if (!localStorage.getItem('token')) {
                        navigate('/login')
                    } else {
                        try {
                            const request = await fetch(info + '/api/comments', {
                                mode: 'cors',
                                method: 'POST',
                                headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`, "Content-Type": "application/json"},
                                body: JSON.stringify({
                                    content: content,
                                    post: params.postId
                                })
                            })
                            if (request.status != 200) {
                                if (request.status === 401) {
                                    localStorage.clear()
                                    navigate('/login')
                                } else {
                                    console.log("There was an error reaching the server")
                                }
                            } else {
                                const response = await request.json()
                                if (response.errors) {
                                    console.log(response.errors)
                                } else {
                                    let arr = [...comments, response.comment]
                                    setComments(arr)
                                }
                            }
                        } catch {
                            console.log("There was an error reaching the server")
                        }
                    }
                }}>Add Comment</button>
            </Form>
            <ul className="">
                {comments.map(comment => {
                    return <li key={v4()}>
                        <h4 className="text-white" key={v4()}>{comment.userName}</h4>
                        <p className="text-white" key={v4()}>{comment.content}</p>
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