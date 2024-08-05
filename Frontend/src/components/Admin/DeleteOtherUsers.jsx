import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import info from "../../info"
import { v4 } from "uuid"
function DeleteOtherUsers () {
    const [users, setUsers] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        const getinfo = async () => {
            try {
                const req = await fetch(info + '/api/users/isadmin', {
                    mode: 'cors',
                    method: 'GET',
                    headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}
                })
                if (req.status != 200) {
                    if (req.status === 401) {
                        localStorage.clear()
                        navigate('/login')
                    } else {
                        console.log("There was an error reaching the server")
                    }
                } else {
                    const res = await req.json()
                    if (res.authorized === false) {
                        navigate('/')
                    } else {
                        const request = await fetch(info + '/api/users', {
                            mode: 'cors',
                            method: 'GET',
                            headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}
                        })
                        const response = await request.json()
                        if (!response.users) {
                            console.log("Your mom")
                        } else {
                            setUsers(response.users)
                        }
                    }
                }
            } catch {
                console.log("there was an error reaching the server")
            }
        }
        getinfo()
    }, [])
    return <>
        <ul className="w-8/12 mx-auto">
            {users.map(user => {
                return <li className="text-white " key={v4()}> 
                    {user.username} -   
                    <button className="ml-2" onClick={async (click) => {
                        click.preventDefault()
                        try {
                            const req = await fetch(info + `/api/users/${user.id}/admin`, {
                                mode: 'cors',
                                method: 'DELETE',
                                headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}
                            }) 
                            if (req.status != 200) {
                                console.log("There was an error deleting the user")
                            } else {
                                const request = await fetch(info + '/api/users', {
                                    mode: 'cors',
                                    method: 'GET',
                                    headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}
                                })
                                const response = await request.json()
                                if (!response.users) {
                                    console.log("There was an error reaching the database")
                                } else {
                                    setUsers(response.users)
                                }
                            }
                        } catch {
                            console.log("there was an error reaching the server")
                        }
                    }}>Delete?</button>
                </li>
            })}
        </ul>
    </>
}
export default DeleteOtherUsers