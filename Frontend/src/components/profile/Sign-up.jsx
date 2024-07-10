import { Form } from "react-router-dom"
import { useState } from "react"
function SignUp () {
    const [user, setUser] = useState('')
    const [pass, setPass] = useState('')
    const [confirm, setConfirm] = useState('')
    return <>
        <Form className="grid grid-rows-7 h-96 mt-10 w-10/12 mx-auto md:w-8/12">
            <label className="text-gray-400 self-end" htmlFor="user">Username</label>
            <input className="bg-white border-2 border-solid border-gray-400 h-10" id="user" type="text" value={user} onChange={e => setUser(e.target.value)} required/>
            <label className="text-gray-400 self-end" htmlFor="pass">Password</label>
            <input className="bg-white border-2 border-solid border-gray-400 h-10" id="pass" type="text" value={pass} onChange={e => setPass(e.target.value)} required/>
            <label className="text-gray-400 self-end" htmlFor="confirm">Confirm Password</label>
            <input className="bg-white border-2 border-solid border-gray-400 h-10" id="confirm" type="text" value={confirm} onChange={e => setConfirm(e.target.value)} required/>
            <button className="text-gray-400" onClick={click => {
                click.preventDefault()
            }}>Submit</button>
        </Form>
    </>
}
export default SignUp