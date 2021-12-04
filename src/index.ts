import { Router } from 'itty-router'
import { flickrAuthGetRequestToken } from './flickr'
//import jsSHA from "jssha";

addEventListener('fetch', (event) => {
    const router:any = Router()

    router.get( '^/api/v1/auth/flickr/request_token$', flickrAuthGetRequestToken )

    // 404 for everything else
    router.all( '*', () => new Response( 'Not Found', { status: 404 } ) )

    // attach the router handle to the event handler
    event.respondWith( router.handle(event.request) )
})
