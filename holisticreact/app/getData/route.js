import { NextRequest, NextResponse } from "next/server"

export async function POST(req) {

  let res = await fetchUserData(
    req.headers.get("user_id"),
    req.headers.get("start_date"), 
    req.headers.get("end_date"), 
    req.headers.get("scope"))



  return NextResponse.json({"data": res})
}


// This is how to fetch data from our Rest API
async function fetchUserData(userID, start_date, end_date, scope) {

  let request = await fetch(`https://api.tryterra.co/v2/${scope}?user_id=${userID}&start_date=${start_date}&end_date=${end_date}&to_webhook=false`, {
    method: "GET",
    headers: {
      "auth_success_redirect_url": "http://localhost:3000",
      'dev-id': process.env.NEXT_PUBLIC_DEV_ID,
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY
    }
  })


  let response = await request.text()

  return response
}