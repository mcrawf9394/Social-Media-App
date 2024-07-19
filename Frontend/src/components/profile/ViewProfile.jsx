import info from "../../info"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { v4 } from "uuid"
function ViewProfile () {
    const navigate = useNavigate()
    const params = useParams()
    const [profile, setProfile]= useState({username: '', bio: '', followed: [] ,following: []})
    const [errors, setErrors] = useState([{msg: ''}])
    const [follow, setFollow] = useState('Follow')
    useEffect(() => {
        const getInfo = async () => {
            try {
                const request = await fetch(info + `/api/users/${params.userId}`, {
                    mode: 'cors',
                    method: 'GET',
                    headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
                })
                if (request.status != 200) {
                    navigate('/')
                } else {
                    const response = await request.json()
                    if (response.errors) {
                        setErrors(response.errors)
                    } else {
                        setProfile({username: response.username, bio: response.bio, followed: response.followed ,following: response.following})
                        if (response.isFollowed === true) {
                            setFollow('Unfollow')
                        }
                    }
                }
            } catch {
                setErrors([{msg: 'There was an issue reaching the server'}])
            }
        }
        getInfo()
    }, [])
    return <div className="grid grid-cols-1 grid-rows-7 justify-items-center">
        <h1 className="text-center text-gray-200 text-xl">{profile.username}</h1>
        <p className="text-center text-gray-200 text-lg">{profile.bio}</p>
        <button className="text-gray-200 bg-gray-800 w-3/12 h-10 hover:text-black hover:bg-gray-200" onClick={async click => {
            click.preventDefault()
            if (follow === 'Follow') {
                try {
                    const request = await fetch (info + `/api/users/follow/${params.userId}`, {
                        mode: 'cors',
                        method: 'PUT',
                        headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
                    })
                    if (request.status != 200) {
                        if (request.status === 404) {
                            setErrors([{msg: 'Could not find the user in the database'}])
                        } else {
                            setErrors([{msg: 'There was an issue reaching the database'}])
                        }
                    } else {
                        const response = await request.json()

                        setFollow('Unfollow')
                    }   
                } catch {
                    setErrors([{msg: 'There was an error reaching the server'}])
                }
            } else {
                try {
                    const request = await fetch (info + `/api/users/unfollow/${params.userId}`, {
                        mode: 'cors',
                        method: 'PUT',
                        headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
                    })
                    if (request.status != 200) {
                        if (request.status === 404) {
                            setErrors([{msg: 'Could not find the user in the database'}])
                        } else {
                            setErrors([{msg: 'There was an issue reaching the database'}])
                        }
                    } else {
                        setFollow('Follow')
                    }   
                } catch {
                    setErrors([{msg: 'There was an error reaching the server'}])
                }
            }
        }}>{follow}</button>
        <div className="grid grid-cols-2">
            <div className="grid grid-cols-1">
                {profile.followed.map(user => {

                })}
            </div>
            <div className="grid grid-cols-1">
                {profile.following.map(user => {

                })}
            </div>
        </div>
        <ul>
            {errors.map(error => {
                return <li className="" key={v4()}>{error.msg}</li>
            })}
        </ul>
    </div>
}
export default ViewProfile