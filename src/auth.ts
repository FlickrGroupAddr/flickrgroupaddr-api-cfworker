import { parse } from "cookie"

export function validateClientAuthCredentials(request: Request): Response|null {
    const parsedCookies:{ [id:string]: string } = parse(request.headers.get("Cookie") || "")

    const userCognitoIdCookie:string|null = parsedCookies['FGA_COGNITO_SUB_ID']
    const sessionIdCookie:string|null = parsedCookies['FGA_SESSION_ID']

    let authCheckResponse:Response|null;

    if ( (userCognitoIdCookie) && (sessionIdCookie) ) {
        authCheckResponse = null;
    } else {
        const errorStatus:{ [id:string]: string } = {
            "error": "client failed API authentication checks",
        }
        authCheckResponse = new Response( JSON.stringify(errorStatus),
            {
                "status": 401,
                "headers": new Headers( 
                    {
                        'Access-Control-Allow-Origin'   : 'https://flickrgroupaddr.com',
                        'Content-Type'                  : 'application/json',
                    }
                ),
            }
        )
    } 

    return authCheckResponse;
}
