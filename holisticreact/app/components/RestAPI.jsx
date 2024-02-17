"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import JsonView from "@uiw/react-json-view"

// This is how to use out REST API  
async function fetchUserData(userID, start_date, end_date, scope) {

  
  let request = await fetch(`/getData`, {
    method: "POST",
    headers: {
      "auth_success_redirect_url": "http://localhost:3000",
      'dev-id': process.env.NEXT_PUBLIC_DEV_ID,
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
      "scope": scope,
      "user_id": userID,
      "start_date": start_date,
      "end_date": end_date
    }
  })

  return (await request.json()).data
}


export default function RestAPI() {

  const searchParams = useSearchParams()

  useEffect(() => {
    setUser({
      userID: searchParams.get("user_id"),
      resource: searchParams.get("resource")
    })
  }, [])

  const [user, setUser] = useState({
    userID: null,
    resource: null
  })

  const [scope, setScope] = useState("DAILY")
  const [start_date, setStartDate] = useState("00-00-0000")
  const [end_date, setEndDate] = useState("00-00-0000")
  const [output, setOutput] = useState()

  function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

  return (<>
  <div className="bg-white/20 p-8 rounded-[30px] border-2 border-white flex justify-center items-center flex-col gap-4 w-full min-h-[200px]">
    {!user.userID ?
      <>
        <p className="text-[24px] font-semibold">Connect a user to the the REST API</p>
      </> :
      <>
        <p className="text-[24px] font-semibold w-full">REST API - Fetch historical user data</p>
        <div className="w-full flex flex-col gap-4">
          <SelectScope scope={scope} setScope={setScope} />
          <SelectDate text={"Select your start date:"} scope={start_date} setScope={setStartDate} />
          <SelectDate text={"Select your end date:"} scope={end_date} setScope={setEndDate} />
          <button className="bg-white px-4 py-2 rounded-full border-2 border-black text-[#008AFF] hover:bg-opacity-70" onClick={async ()=>{
            setOutput({status:"Loading..."});
            fetchUserData(user.userID, start_date, end_date, scope.toLowerCase()).then(out => {
              setOutput(out)});  
          }}>Fetch</button>
        </div>
      </>}
  </div>
  
  <div className={(!user.userID && "opacity-[70%]") + " bg-white/20 p-8 rounded-[30px] border-2 border-white flex justify-center items-center flex-col gap-4 w-full h-full"}>
    <pre className="m-2 bg-white border-2 border-black rounded-[20px] w-full h-[300px] overflow-y-scroll max-h-[400px] p-2 max-w-[500px]">
      {output && ( isJsonString(output) && <JsonView value={JSON.parse(output)} />)}
    </pre>
  </div>
  </>
  
  
  )
}

function SelectScope({ scope, setScope }) {

  const [open, setOpen] = useState(false)

  const SCOPES = ["ACTIVITY", "BODY", "DAILY", "MENSTRUATION", "NUTRITION", "SLEEP"]

  return (<div className="flex justify-between items-center w-full">
    <p>Select your scope:</p>
    <div className="relative ">
      <p className="white px-4 py-2 bg-white/20 border-white text-center border-2 w-fit rounded-full cursor-pointer" onClick={(e) => {
        setOpen(!open)
        e.stopPropagation()
      }}>{scope}</p>
      {open &&
        <div className="absolute top-full translate-y-[10px] w-full rounded-[20px] overflow-hidden">
          {SCOPES.map((s) => {
            return <p className="white px-4 py-2 bg-white hover:bg-gray-300 cursor-pointer text-[10px] text-center" onClick={() => {
              setScope(s)
              setOpen(!open)
            }}>{s}</p>
          })}
        </div>}
    </div>
  </div>)
}


function SelectDate({ text, scope, setScope }) {

  const SCOPES = ["DAILY", "SLEEP"]

  return (<div className="flex gap-4 justify-between items-center w-full">
    <p>{text}</p>
    <input type="text" placeholder="YYYY-MM--DD" className="px-2 py-4 rounded-full w-fit text-center" onChange={(e) => { setScope(e.currentTarget.value) }}></input>
  </div>)
}