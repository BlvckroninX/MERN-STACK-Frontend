import axios from "axios"
import { useState,useEffect } from "react"
import NavbarComponent from "./NavbarComponent"
import { useParams } from "react-router-dom"
const SingleComponent=()=>{
    const [blog,setBlog] = useState('')
    const {slug} = useParams()
    useEffect(()=>{
        axios
        .get(`${process.env.REACT_APP_API}/blog/${slug}`)
        .then(response=>{
          setBlog(response.data)

            
        })
        .catch(err=>alert(err))
        // eslint-disable-next-line
    },[])
    return(
        <div className="container p-5">
            <NavbarComponent/>
            
           <h2>{blog.title}</h2>
           <p dangerouslySetInnerHTML={{__html:blog.content}}></p>
            
            <p className="text-muted">ผู้เขียน : {blog.author} , เผยแพร่ : {new Date(blog.createdAt).toLocaleString()}</p>
        </div>
    )
}
export default SingleComponent;
