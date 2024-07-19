import { useState, useEffect } from 'react'
import { useNavigate, Form } from 'react-router-dom'
import info from '../../info'
function DisplayPosts () {
    if (localStorage.getItem('token')) {
        return <>
        
        </>
    } else {
        return <>
        
        </>
    }
}
export default DisplayPosts