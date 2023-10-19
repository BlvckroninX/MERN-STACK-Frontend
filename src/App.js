import './App.css';
import NavbarComponent from './components/NavbarComponent';
import axios from 'axios'
import {useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import Swal from 'sweetalert2';
import { getToken, getUser } from './services/authorize';
function App() {
  const [blogs,setBlogs] = useState([])
  
  const fetchData =() =>{
    axios.get(`${process.env.REACT_APP_API}/blogs`)
    .then(response=>{
      setBlogs(response.data)
    })
    .catch(err=>alert(err));
  }
  useEffect(()=>{
    fetchData()
  },[])
  const confirmDelete = (slug)=>{
    Swal.fire({
        title:"ต้องลบบทความหรือไม่",
        icon:"warning",
        showCancelButton:true
    }).then((result)=>{
      //กดปุ่มตกลง
        if(result.isConfirmed){
          deleteBlog(slug)
        }
    })
  }
  const deleteBlog=(slug)=>{
      //ส่ง req ไปที่ api เพื่อลบ
      axios
      .delete(`${process.env.REACT_APP_API}/blog/${slug}`,
      {
        headers:{
          authorization:`Bearer ${getToken()}`
        }
      }
      ).then(response=>{
         Swal.fire("Deleted",response.data.message,"success")
         fetchData()
      })
      .catch(err=>console.log(err))
         
  }
  return (
    <div className="container p-5">
      <NavbarComponent/>
      {blogs && blogs.map((blog,index)=>(
         <div className='row' key={index} style={{borderBottom:'1px solid silver'}}> 
            <div className='col pt-3 pb-2'>
              <Link to={`/blog/${blog.slug}`}>
              <h2 >{blog.title}</h2>
              </Link>
               <p dangerouslySetInnerHTML={{__html:blog.content.substring(0,250)}}></p>
               <p className='text-muted'>ผู้เขียน : {blog.author} , เผยแพร่ : {new Date(blog.createdAt).toLocaleString()}</p>
              {getUser() &&(
                <div>
                   <Link to={`/blog/edit/${blog.slug}`} className='btn btn-outline-success' >อัพเดต</Link> &nbsp;
                    <button className='btn btn-outline-danger ' onClick={()=>confirmDelete(blog.slug)} >ลบ</button>
                </div>
              )}
            </div>
         </div>
      ))}
    </div>
  );
}

export default App;
