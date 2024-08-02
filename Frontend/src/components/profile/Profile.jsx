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
    const [cannotEdit, setCannotEdit] = useState(false)
    const [following, setFollowing] = useState([{}])
    const [followed, setFollowed] = useState([{}])
    const [file, setFile] = useState('')
    const [profilePic, setProfilePic] = useState([{name: '../../../blank-profile-picture-973460_640.png'}])
    const [errors, setErrors] = useState([{msg: ''}]) 
    useEffect(() => {
        const getInfo = async () => {
            try {
                const request = await fetch(info + `/api/users/${params.userId}`, {
                    mode: 'cors',
                    method: 'GET',
                    headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
                })
                if (request.status === 404) {
                    navigate('/')
                } else {
                    const response = await request.json()
                    if (response.username === "Guest") {
                        setCannotEdit(true)
                    }
                    setUser(response.username)
                    setBio(response.bio)
                    setFollowing(response.following)
                    setFollowed(response.followed)
                    if (response.profilePic != "1") {
                        setProfilePic([{name: response.profilePic}])
                    }
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
        <Form className="grid grid-rows-10 h-96 mt-10 w-10/12 mx-auto md:w-8/12">
            <img className="w-20 mx-auto row-span-2" src={`${profilePic[0].name}`} alt="User's Profile Picture" />
            <label className="text-gray-400 self-end" htmlFor="user">Username</label>
            <input className="bg-white border-2 border-solid border-gray-400 h-10" id="user" value={user} onChange={e => setUser(e.target.value)} type="text" required/>
            <label className="text-gray-400 self-end" htmlFor="bio">Bio</label>
            <input className="bg-white border-2 border-solid border-gray-400 h-10" id="bio" value={bio} onChange={e => setBio(e.target.value)} type="text" required/>
            <label className="text-gray-400 self-end" htmlFor="picture">Upload Profile Picture</label>
            <input className="" onChange={e => { 
                   const reader = new FileReader()
                   reader.readAsDataURL(e.target.files[0])
                   reader.onloadend = () => {
                       setProfilePic([{name: reader.result}])
                   }   
                   setFile(e.target.files[0])
                }} id='picture' type='file' accept="image/*"/>
            <button className="text-gray-400" onClick={async click => {
                click.preventDefault()
                setErrors([{msg: ''}])
                if (cannotEdit === true) {
                    setErrors([{msg: "Please do not edit the guest profile, to use these features create your own account"}])
                } else {   
                    try {
                        if (profilePic[0].name != '../../../blank-profile-picture-973460_640.png') {
                            const formData = new FormData();
                            formData.append('img', file);
                            const req = await fetch(info + `/api/users/${params.userId}/picture`, {
                                mode: 'cors',
                                method: 'PUT',
                                headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`},
                                body: formData
                            })
                            const res = await req.json()
                            if (res.errors) {
                                setErrors([{msg: 'There was an issue uploading this image.'}])
                            }
                        }
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
                        if (errors[0].msg === '') {
                            navigate('/')
                        }
                    } catch {
                        setErrors([{msg: 'There was an error reaching the server'}])
                    }
                }
            }}>Submit</button>
            <button className="text-gray-400" onClick={(click) => {
                click.preventDefault()
                if (cannotEdit === true) {
                    setErrors([{msg: "Please do not edit the guest profile, to use these features create your own account"}])
                } else {
                    setShowModal(true)
                }
            }}>Delete</button>
            <button className="text-gray-400" onClick={click => {
                click.preventDefault()
                localStorage.clear()
                navigate('/')
            }} >Log off</button>
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