import { Router } from 'itty-router'
import { validateClientAuthCredentials } from './auth'
import { flickrGetUserAuthUrl } from './flickr'

addEventListener('fetch', (event) => {

    //event.respondWith( new Response( "booya" ) )

    // Make sure they've authenticated properly
    const authValidationResponse:Response|null = validateClientAuthCredentials( event.request )

    let eventResponse:Response;

    // Null means user is successfully authenticated, all good in the hood
    if ( authValidationResponse === null ) {
        const router:any = Router()

        router.get( '^/api/v1/auth/flickr/user_auth_url$', flickrGetUserAuthUrl )

        // 404 for everything else
        router.all( '*', () => new Response( 'Not Found', { status: 404 } ) )

        // attach the router handle to the event handler
        eventResponse = router.handle( event.request )
    } else {
        // Auth response is non-null, pass them whatever the error response object we got back was

        eventResponse = authValidationResponse
    }

    event.respondWith( eventResponse )
})
