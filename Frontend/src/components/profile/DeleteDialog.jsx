import info from "../../info"
import { useState } from "react";
import { v4 } from "uuid";
function DeleteDialog ({onClose}) {
    const [errors, setErrors] = useState([{msg: ''}])
    return <div className="absolute top-32 size-6/12 w-10/12 left-8 z-2 bg-gray-200">
        <button className="" onClick={onClose}>Cancel</button>
        <button className="" onClick={async click => {
            click.preventDefault()
            try {
                
            } catch {
                console.error("Could not reach the server");
            }
        }}>Delete</button>
        <ul>
            {errors.map(val => {
                <li className='' key={v4()}>{val.msg}</li>
            })}
        </ul>
    </div>
}
export default DeleteDialog