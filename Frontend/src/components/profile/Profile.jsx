import { useState, useEffect } from "react"
import { useNavigate, Form, useParams } from "react-router-dom"
import { v4 as uuidV4 } from "uuid"
import info from '../../info'
import { createPortal } from 'react-dom';
import DeleteDialog from "./DeleteDialog";
function Profile () {
    const params = useParams()
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false)
    const [user, setUser] = useState('')
    const [bio, setBio] = useState('')
    const [following, setFollowing] = useState([{}])
    const [followed, setFollowed] = useState([{}])
    const [profilePic, setProfilePic] = useState('../../../blank-profile-picture-973460_640.png')
    const [errors, setErrors] = useState([{msg: ''}]) 
    useEffect(() => {
        const getInfo = async () => {
            try {
                const request = await fetch(info + `/api/users/${params.userId}`, {
                    mode: 'cors',
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'}
                })
                if (request.status === 404) {
                    navigate('/')
                } else {
                    const response = await request.json()
                    setUser(response.username)
                    setBio(response.bio)
                    setFollowing(response.following)
                    setFollowed(response.followed)
                }
            } catch {
                setErrors([{msg: 'There was an error reaching the server'}])
            }
        }
        getInfo()
    }, [])
    return <>
       {showModal && createPortal(
        <DeleteDialog onClose={() => setShowModal(false)} />,
        document.body
      )}
        <Form className="grid grid-rows-9 h-96 mt-10 w-10/12 mx-auto md:w-8/12">
            <img className="w-20 mx-auto" src={profilePic} alt="User's Profile Picture" />
            <label className="text-gray-400 self-end" htmlFor="user">Username</label>
            <input className="bg-white border-2 border-solid border-gray-400 h-10" id="user" value={user} onChange={e => setUser(e.target.value)} type="text" required/>
            <label className="text-gray-400 self-end" htmlFor="bio">Bio</label>
            <input className="bg-white border-2 border-solid border-gray-400 h-10" id="bio" value={bio} onChange={e => setBio(e.target.value)} type="text" required/>
            <label className="text-gray-400 self-end" htmlFor="picture">Upload Profile Picture</label>
            <input className="" onChange={e => setProfilePic(e.target.value)} id='picture' type='file' accept="image/jpeg"/>
            <button className="text-gray-400" onClick={async click => {
                click.preventDefault()
                try {
                    const request = await fetch(info + `/api/users/${params.userId}`,{
                        mode: 'cors',
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}`},
                        body: JSON.stringify({
                            username: user,
                            bio: bio
                        })
                    })
                    if (request.status === 404) {
                        localStorage.clear()
                        navigate('/login')
                    } else {
                        const response = await request.json()
                        if (response.errrors) {
                            setErrors(response.errors)
                        }
                    }
                    if (profilePic != '../../../blank-profile-picture-973460_640.png') {
                        const request2 = await fetch(info + `/api/users/${params.userId}/picture`, {
                            mode: 'cors',
                            method: 'PUT',
                            headers: {'Content-Type': 'image/jpeg', 'Authorization': `Bearer ${localStorage.getItem('token')}`},
                            body: profilePic
                        })
                        const response2 = await request2.json()
                        if (response2.errors) {
                            setErrors(response2.errors)
                        } else {
                            navigate('/')
                        }
                    } else {
                        navigate('/')
                    }
                } catch {
                    setErrors([{msg: 'There was an error reaching the server'}])
                }
            }}>Submit</button>
            <button className="text-gray-400" onClick={(click) => {
                click.preventDefault()
                setShowModal(true)
            }}>Delete</button>
        </Form>
        <ul>
            {errors.map(error => {
                if (error.path) {
                    return <li className="text-gray-400" key={uuidV4()}>{error.path} - {error.msg}</li>
                } else {
                    return <li className="text-gray-400" key={uuidV4()}>{error.msg}</li>
                }
            })}
        </ul>
    </>
}
export default Profile