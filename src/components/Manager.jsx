import React from "react";
import { useRef, useState, useEffect } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
  const ref = useRef();
  const passwordRef = useRef();
  const [form, setform] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setpasswordArray] = useState([]);

  const getPasswords= async()=>{
    let req =await fetch("http://localhost:3000/")
    const passwords =await req.json()
      setpasswordArray(passwords);
    
  }

  useEffect(() => {
   getPasswords()
   
  }, []);
  const copyText = (text) => {
    toast("Copied to clipboard", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    navigator.clipboard.writeText(text);
  };

  const showPassword = () => {
    passwordRef.current.type = "text";
    if (ref.current.src.includes("/cross.svg")) {
      ref.current.src = "/e.svg";
      passwordRef.current.type = "password";
    } else {
      ref.current.src = "/cross.svg";
      passwordRef.current.type = "text";
    }
  };
  const savePassword = async() => {
    if(form.site.length>3 && form.username.length>3 && form.password.length>3){

      // IF any such id exists in the db, delete it
      await fetch("http://localhost:3000",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:form.id})})

      setpasswordArray([...passwordArray, {...form, id: uuidv4()}]);
      await fetch("http://localhost:3000",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,id:uuidv4()})})
      // localStorage.setItem(
      //   "passwords",
      //   JSON.stringify([...passwordArray, {...form, id: uuidv4()}])
      // );
      setform({ site: "", username: "", password: "" });
      toast("Password Saved", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
    else{
     
      toast("Password not Saved")
     
    }
   
  };

  const deletePassword = async(id) => {
    console.log("Deleting password with id",id);
    let c=confirm("Do you really want to delete this password?")
    if(c){
      setpasswordArray(passwordArray.filter(item=>item.id!==id));
      let res =await fetch("http://localhost:3000",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})})
      // localStorage.setItem(
      //   "passwords",
      //   JSON.stringify(passwordArray.filter(item=>item.id!==id))
      // );
      toast("Password Deleted", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
   
  };
  const editPassword = (id) => {
    console.log("Editing password with id",id);
    setform({...passwordArray.filter(i=>i.id===id)[0],id:id})
    setpasswordArray(passwordArray.filter(item=>item.id!==id));
    toast("Password Edited", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };
  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition="Bounce"
      />
      {/* Same as */}
      <ToastContainer />
      <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div>
      </div>
      <div className=" p-2 pt-3  md:mycontainer">
        <h1 className="text-4xl font-bold text-center">
          <span className="text-green-500">&lt;</span>
          Pass
          <span className="text-green-500">OP/&gt;</span>
        </h1>
        <p className="text-green-700 text-lg text-center">
          Your own Password Manager
        </p>
        <div className="text-black flex flex-col p-4 gap-8 items-center ">
          <input
            name="site"
            onChange={handleChange}
            value={form.site}
            placeholder="Enter website URL"
            className=" rounded-full border border-green-500 w-full px-4 py-1"
            type="text" id="site"
          />
          <div className="flex w-full gap-8">
            <input
              onChange={handleChange}
              name="username"
              value={form.username}
              placeholder="Enter Username"
              className=" rounded-full border border-green-500 w-full px-4 py-1"
              type="text" id="username"
            />
            <div className="relative">
              <input
                ref={passwordRef}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className=" rounded-full border border-green-500 w-full px-4 py-1"
                type="password" id="password"
              />
              <span
                className="absolute right-[3px] top-[4px] cursor-pointer "
                onClick={showPassword}
              >
                <img ref={ref} width={26} className="p-1" src="/e.svg" alt="" />
              </span>
            </div>
          </div>

          <button
            onClick={savePassword}
            className="flex justify-center items-center bg-green-600 rounded-full px-8 py-2 w-fit gap-2 hover:bg-green-500 text-white border border-green-900"
          >
            <lord-icon
              src="https://cdn.lordicon.com/ftndcppj.json"
              trigger="hover"
            ></lord-icon>
            Save 
          </button>
        </div>
        <div className="passwords">
          <h2 className="font-bold text-2xl py-4">Your Passwords</h2>
          {passwordArray.length === 0 && <div>No passwords to show</div>}
          {passwordArray.length != 0 && (
            <table className="table-auto w-full overflow-hidden rounded-md overflow-hidden mb-10">
              <thead className="bg-green-800 text-white">
                <tr>
                  <th className="py-2">Site</th>
                  <th className="py-2">Username</th>
                  <th className="py-2">Password</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-green-100">
                {passwordArray.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="text-center py-2 border border-white ">
                        <div className="flex items-center justify-center ">
                          <a href={item.site} target="_blank">
                            {item.site}
                          </a>
                          <div
                            className="size-7 cursor-pointer"
                            onClick={() => {
                              copyText(item.site);
                            }}
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/wyqtxzeh.json"
                              trigger="hover"
                              style={{
                                width: "25px",
                                height: "25px",
                                paddingTop: "3px",
                                paddingLeft: "3px",
                              }}
                            ></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-2 border border-white ">
                        <div className="flex items-center justify-center ">
                          {item.username}
                          <div
                            className="size-7 cursor-pointer"
                            onClick={() => {
                              copyText(item.username);
                            }}
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/wyqtxzeh.json"
                              trigger="hover"
                              style={{
                                width: "25px",
                                height: "25px",
                                paddingTop: "3px",
                                paddingLeft: "3px",
                              }}
                            ></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className=" text-center py-2 border border-white " d>
                        <div className="flex items-center justify-center">
                          {"*".repeat(item.password.length)}
                          <div
                            className="size-7 cursor-pointer"
                            onClick={() => {
                              copyText(item.password);
                            }}
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/wyqtxzeh.json"
                              trigger="hover"
                              style={{
                                width: "25px",
                                height: "25px",
                                paddingTop: "3px",
                                paddingLeft: "3px",
                              }}
                            ></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className=" text-center py-2 border border-white " d>
                        <span className="cursor-pointer mx-1"onClick={()=>{editPassword(item.id)}}>
                          <lord-icon
                            src="https://cdn.lordicon.com/ylvuooxd.json"
                            trigger="hover"
                            style={{"width":"25px","height":"25px"}}
                          ></lord-icon>
                        </span>
                        <span className="cursor-pointer mx-1" onClick={()=>{deletePassword(item.id)}}>
                          <lord-icon
                            src="https://cdn.lordicon.com/hjbrplwk.json"
                            trigger="hover"
                            style={{"width":"25px","height":"25px"}}
                          ></lord-icon>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;
