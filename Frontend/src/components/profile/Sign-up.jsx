import { Form, useNavigate } from "react-router-dom"
import { useState } from "react"
import { v4 as uuidV4 } from "uuid"
import info from '../../info'
function SignUp () {
    const navigate = useNavigate()
    const [user, setUser] = useState('')
    const [pass, setPass] = useState('')
    const [confirm, setConfirm] = useState('')
    const [errors, setErrors] = useState([{msg: ''}])
    return <>
        <Form className="grid grid-rows-7 h-96 mt-10 w-10/12 mx-auto md:w-8/12">
            <label className="text-gray-400 self-end" htmlFor="user">Username</label>
            <input className="bg-white border-2 border-solid border-gray-400 h-10" id="user" type="text" value={user} onChange={e => setUser(e.target.value)} required/>
            <label className="text-gray-400 self-end" htmlFor="pass">Password</label>
            <input className="bg-white border-2 border-solid border-gray-400 h-10" id="pass" type="text" value={pass} onChange={e => setPass(e.target.value)} required/>
            <label className="text-gray-400 self-end" htmlFor="confirm">Confirm Password</label>
            <input className="bg-white border-2 border-solid border-gray-400 h-10" id="confirm" type="text" value={confirm} onChange={e => setConfirm(e.target.value)} required/>
            <button className="text-gray-400" onClick={async click => {
                click.preventDefault()
                try {
                    const request = await fetch(info + '/api/users', {
                        mode: 'cors',
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: {
                            username: user,
                            password: pass,
                            confirm: confirm
                        }  
                    })
                    if (request.status != 200) {
                        setErrors([{msg: 'There was an issue reaching the server'}])
                    }
                    else {
                        const response = await request.json()
                        if (response.errors) {
                            setErrors(response.errors)
                        } else {
                            localStorage.setItem('token', response.token)
                            navigate('/')
                        }
                    }
                } catch {
                    setErrors([{msg : 'There has been an error reaching the server'}])
                }
            }}>Submit</button>
        </Form>
        <ul>
            {errors.map((error) => {
                return <li className="text-gray-400" key={uuidV4()}>{error.msg}</li>
            })}
        </ul>
    </>
}
export default SignUp