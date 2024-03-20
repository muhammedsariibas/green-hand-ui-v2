import { useTokenStore } from "@/stores/tokenStore";

const urlAddress: string = `http://${window.location.hostname}:9080`

async function fetchPost(path: string, options: RequestInit | null, data: any) {

    const tokenStore = useTokenStore();
    const token: any = tokenStore.getToken;
    

    let _headers: HeadersInit = {
        "Content-Type": "application/json",
    }
 
    console.log(tokenStore.getTokenExist)
    if (tokenStore != null && token != null) {
        _headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    }


    let _options: RequestInit = {
        headers: _headers,
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    };

    if (options != null) {
        _options = { ..._options, ...options };
    }

    try {

        const resp = await fetch(`${urlAddress + path}`, _options);

        if (resp.status === 403) {
            console.log(`fetchUtils ${tokenStore.isTokenExist}`)
            tokenStore.isTokenExist = false;
            window.localStorage.removeItem('token')
        }
        return await resp.json()
    } catch (exp) {
        console.error(exp)
        throw exp;
    }


}


async function fetchGet(path: string): Promise<any> {


    const tokenStore = useTokenStore();
    const token: any = tokenStore.getToken;
    const isTokenExist: any = tokenStore.isTokenExist;
  
    let _headers: HeadersInit = {
        "Content-Type": "application/json",

    }
    if (tokenStore != null && token != null) {
        _headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    }

    try {

        const resp = await fetch(`${urlAddress + path}`, {
            method: "GET",
            credentials: 'same-origin',
            headers: _headers
        });

        console.log(resp.status)
        if (resp.status === 403) {

            tokenStore.isTokenExist = false;
            window.localStorage.removeItem('token')

        }
        
        return await resp.json()
    } catch (exp) {

        console.error(exp)
        throw exp;
    }
}



async function fetchPut(path: string, status: any) { 
    const tokenStore = useTokenStore();
    const token: any = tokenStore.getToken;

    try{
      
      const resp = await fetch(`${urlAddress + path}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': "*",
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          newStatus: status.approvalStatus,
          newDegree: status.degree,
          explanation: status.explanation,
        })
      })
  
      if (resp.status === 403) {
        
        tokenStore.isTokenExist = false;
        window.localStorage.removeItem('token')
      }
  
      return await resp.json()
    }catch(exp){
      
    }
   
    
  }
export { fetchPost, fetchGet ,fetchPut}