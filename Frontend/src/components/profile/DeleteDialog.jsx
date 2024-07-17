import info from "../../info"
import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { v4 } from "uuid";
function DeleteDialog ({onClose}) {
    const navigate = useNavigate()
    const [errors, setErrors] = useState([{msg: ''}])
    return <div className="absolute grid grid-rows-2 top-32 size-6/12 w-10/12 left-8 z-2 bg-gray-200">
        <h1 className="text-center self-center">Are you sure that you want to delete your account?</h1>
        <div className="inline-flex justify-around self-center">
            <button className="" onClick={onClose}>Cancel</button>
            <button className="" onClick={async click => {
                click.preventDefault()
                try {
                    const request = await fetch(info + `/api/users/${localStorage.getItem('token')}`,{
                        mode: 'cors',
                        method: 'DELETE',
                        headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
                    })
                    if (request.status === 200) {
                        localStorage.clear()
                        navigate('/')
                    } else {
                        setErrors([{msg: 'Could not reach the server'}])
                    }
                } catch {
                    setErrors([{msg: "Could not reach the server"}]);
                }
            }}>Delete</button>
        </div>
        <ul>
            {errors.map(val => {
                <li className='' key={v4()}>{val.msg}</li>
            })}
        </ul>
    </div>
}
export default DeleteDialog