import { Form, useNavigate } from "react-router-dom"
import { useState } from "react"
function Login () {
    const navigate = useNavigate()
    const [user, setUser] = useState('')
    const [pass, setPass] = useState('')
    return <>
        <Form className="grid grid-rows-5 h-96 mt-10">
            <label className="text-gray-400 self-end" htmlFor="username">Username</label>
            <input id="username" className="bg-white border-2 border-solid border-gray-400 h-10" type="text" value={user} onChange={setUser} />
            <label className="text-gray-400 self-end" htmlFor="pass">Password</label>
            <input id="pass" className="bg-white border-2 border-solid border-gray-400 h-10" type="text" value={pass} onChange={setPass} />
            <button className="text-gray-400" onClick={click => {
                click.preventDefault()

            }}>Submit</button>
        </Form>
        <h1 className="text-gray-400">Don't have an account? Sign up!</h1>
        <button className="text-gray-400" onClick={click => {
            click.preventDefault()
            navigate('/signup')
        }}>Sign up</button>
    </>
}
export default Login