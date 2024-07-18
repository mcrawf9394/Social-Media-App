import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import info from '../../info'
import { v4 } from 'uuid'
function UserList () {
    const navigate = useNavigate()
    const [profile, setProfile] = useState([{id: 1, username: 'loading', profilePic: '../../blank-profile-picture-973460_640.png'}])
    const [errors, setErrors] = useState([{msg: ''}])
    useEffect(() => {
        const getInfo = async () => {
            try {
                const request = await fetch(info + '/api/users', {  
                    mode: 'cors',
                    method: 'GET',
                    headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
                })
                if (request.status === 200) {
                    const response = await request.json()
                    if (response.errors) {
                        setErrors(response.errors)
                    } else {
                        setProfile(response.users)
                    }
                } else {
                    if (request.status === 401) {
                        localStorage.clear()
                        navigate('/')
                    } else {
                        setErrors([{msg: 'There was an issue reaching the database'}])
                    }
                }
            } catch {
                setErrors([{msg: 'There was an error reaching the server'}])
            }
        } 
        getInfo()
    }, [])
    return <>
        {profile.map(userInfo => {
            return <button className='grid grid-cols-2 w-10/12 mx-auto justify-items-center items-center bg-gray-200 gap-y-2 mt-2 hover:bg-gray-400 md:w-6/12' key={v4()} onClick={click =>{
                click.preventDefault()
                navigate(`/profile/${userInfo.id}`)
            }}>
                <img className='h-20 w-20' src={userInfo.profilePic} alt={`${userInfo.username}'s Profile Picture`}/>
                {userInfo.username}
            </button>
        })}
        <ul className=''>
            {errors.map(val => {
                <li className='' key={v4()}>{val.msg}</li>
            })}
        </ul>
    </>
}
export default UserList