import { handleRequest } from './handler'

addEventListener('fetch', (event) => {
    let requestResponse:Response;

    const requestedUrl:string = event.request.url;

    if ( requestedUrl.endsWith('/api/v1/auth/flickr/request_token') )


    
    event.respondWith(handleRequest(event.request))
})
