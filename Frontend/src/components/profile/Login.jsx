import { Form, useNavigate } from "react-router-dom"
import { useState } from "react"
import info from "../../info"
import { v4 as uuidV4 } from "uuid"
function Login () {
    const navigate = useNavigate()
    const [user, setUser] = useState('')
    const [pass, setPass] = useState('')
    const [errors, setErrors] = useState([{msg: ""}])
    return <>
        <Form className="grid grid-rows-5 h-96 mt-10 w-10/12 mx-auto md:w-8/12">
            <label className="text-gray-400 self-end" htmlFor="username">Username</label>
            <input id="username" className="bg-white border-2 border-solid border-gray-400 h-10" type="text" value={user} onChange={e => setUser(e.target.value)} />
            <label className="text-gray-400 self-end" htmlFor="pass">Password</label>
            <input id="pass" className="bg-white border-2 border-solid border-gray-400 h-10" type="text" value={pass} onChange={e => setPass(e.target.value)} />
            <button className="text-gray-400" onClick={async click => {
                click.preventDefault()
                try {
                    const request = await fetch(info + '/api/users/login', {
                        mode: 'cors',
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            username: user,
                            password: pass
                        })
                    })
                    const response = await request.json()
                    if (response.errors) {
                        setErrors(response.errors)
                    } else {
                        localStorage.setItem('token', response.token)
                        navigate('/')
                    }
                } catch {
                    setErrors([{msg: "There was an error reaching the server"}])
                }
            }}>Submit</button>
        </Form>
        <ul>
            {errors.map(val => {
                if (val.path) {
                    return <li className="text-gray-400" key={uuidV4()}>{val.path} - {val.msg}</li>
                } else {
                    return <li className="text-gray-400" key={uuidV4()}>{val.msg}</li>
                }
            })}
        </ul>
        <div className="w-10/12 mx-auto grid grid-rows-2">
            <h1 className="text-gray-400 text-center">Don't have an account? Sign up!</h1>
            <button className="text-gray-400 justify-self-center" onClick={click => {
                click.preventDefault()
                navigate('/signup')
            }}>Sign up</button>
        </div>
    </>
}
export default Login