import { useState,useEffect} from "react";
import NavbarComponent from "./NavbarComponent";
import axios from 'axios'
import { useParams } from "react-router-dom";
import  Swal from 'sweetalert2'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getToken } from "../services/authorize";

export default function  EditComponent(){
    const [state,setState] = useState({
        title:"",
        author:"",
        slug:"",
    })
    const [content,setContent] =useState('')
    const {title,author} = state
    const {slug} = useParams()

    //ดึงข้อมูลบทความที่ต้องการแก้ไข
    useEffect(()=>{
        axios
        .get(`${process.env.REACT_APP_API}/blog/${slug}`)
        .then(response=>{
          const {title,content,author,slug} = response.data
          setState({...state,title,author,slug})
          setContent(content)
          
            
        })
        .catch(err=>alert(err))
        // eslint-disable-next-line
    },[])


    const submitContent=(event)=>{
        setContent(event)

    }

    const showUpdateForm=()=>(
        <form onSubmit={submitForm}>
                <div className="form-group">
                    <label>ชื่อบทความ</label>
                    <input type="text" className="form-control" value={title} onChange={inputValue("title")} />
                </div>
                <div className="form-group">
                    <label>รายละเอียด</label>
                    <ReactQuill 
                        value={content}
                        onChange={submitContent}
                        theme="snow"
                        className="pb-5 mb-3"
                        style={{border:'1px solid #666'}}
                    />
                </div>
                <div className="form-group">
                    <label>ผู้แต่ง</label>
                    <input type="text" className="form-control" value={author} onChange={inputValue("author")}/>
                </div>
                <br/>
                <input type="submit" value="อัพเดต" className="btn  btn-primary "/>
              
            </form>
    )
    //กำหนดค่า  state
    const inputValue = name => event =>{
        //console.log(name,"=",event.target.value)
        setState({...state,[name]:event.target.value})
    }
    // อัพเดตข้อมูล
    const submitForm = (e) =>{
        e.preventDefault();
        // console.log("API URL",":",process.env.REACT_APP_API)
        axios
        .put(`${process.env.REACT_APP_API}/blog/${slug}`,{title,content,author},
        {
            headers:{
              authorization:`Bearer ${getToken()}`
            }
          }
        )
        .then(response=>{
            Swal.fire(
                'แจ้งเตือน!',
                "อัพเดตข้อมูลเรียบร้อย",
                'success'
              )
            const {title,content,author,slug} = response.data
            setState({...state,title,author,content,slug})

           
        }).catch(err=>{
            Swal.fire(
                'แจ้งเตือน!',
                err.response.data.error,
                'error'
              )
        })
        

    }

    return(
        <div  className="container p-5">
            <NavbarComponent/>
            <h1>แก้ไขบทความ</h1>
            
            {showUpdateForm()}
           
        </div>
    );


}