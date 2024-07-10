import { Form, useNavigate } from "react-router-dom"
import { useState } from "react"
function Login () {
    const navigate = useNavigate()
    const [user, setUser] = useState('')
    const [pass, setPass] = useState('')
    return <>
        <Form className="grid grid-rows-5 h-96 mt-10 w-10/12 mx-auto md:w-8/12">
            <label className="text-gray-400 self-end" htmlFor="username">Username</label>
            <input id="username" className="bg-white border-2 border-solid border-gray-400 h-10" type="text" value={user} onChange={setUser} />
            <label className="text-gray-400 self-end" htmlFor="pass">Password</label>
            <input id="pass" className="bg-white border-2 border-solid border-gray-400 h-10" type="text" value={pass} onChange={setPass} />
            <button className="text-gray-400" onClick={click => {
                click.preventDefault()

            }}>Submit</button>
        </Form>
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