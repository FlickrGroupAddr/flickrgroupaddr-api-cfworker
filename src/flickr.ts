import jsSHA from "jssha";

export async function flickrGetUserAuthUrl(request: Request): Promise<Response> {
    const oauthTimestamp:number = Math.round((new Date()).getTime() / 1000.0);

    let integerArray:Uint32Array = new Uint32Array(1)
    crypto.getRandomValues( integerArray )

    let oauthNonce:string = crypto.randomUUID() 

    // NOTE! The parameters are not in a random order. They have to be in lexigraphical order, hence why _callback
    //      is first, and _version is last. regardless of order in the request, the signature will be repeatable
    const baseStringComponents:string[] = [
        FGA_FLICKR_OAUTH_REQUEST_TOKEN_VERB,

        FGA_FLICKR_OAUTH_REQUEST_TOKEN_ENDPOINT_URI,

        "oauth_callback=" + encodeURIComponent(FGA_FLICKR_OAUTH_CALLBACK_URI) +
        "&oauth_consumer_key=" + FGA_FLICKR_OAUTH_APP_KEY +
        "&oauth_nonce=" + oauthNonce +
        "&oauth_signature_method=" + FGA_FLICKR_OAUTH_SIGNATURE_METHOD +
        "&oauth_timestamp=" + oauthTimestamp +
        "&oauth_version=" + FGA_FLICKR_OAUTH_VERSION,
    ];

    let encodedBaseString:string = "";

    for ( let currComponent of baseStringComponents ) {
        encodedBaseString += encodeURIComponent( currComponent ) + "&"
    }

    // Trim off last ampsersand
    encodedBaseString = encodedBaseString.substring(0, encodedBaseString.length - 1);

    // Sign the request

    // Key used for signing is "<consumer secret>&<token secret>" 
    //      At this phase, we don't yet have a token secret, so it just stays blank and we use our secret 
    //      followed by an ampsersand
    const requestSigningKey = encodeURIComponent(FGA_FLICKR_OAUTH_APP_SECRET) + "&"
    
    const shaObj = new jsSHA( "SHA-1", "TEXT", { hmacKey: { value: requestSigningKey, format: "TEXT" }, } )
    shaObj.update( encodedBaseString )
    const signature:string = shaObj.getHash( "B64" )

    // Ready to make the request, I think?
    const urlToRequest:string = FGA_FLICKR_OAUTH_REQUEST_TOKEN_ENDPOINT_URI + 
        "?oauth_nonce=" + encodeURIComponent(oauthNonce) +
        "&oauth_timestamp=" + encodeURIComponent(oauthTimestamp) + 
        "&oauth_consumer_key=" + encodeURIComponent(FGA_FLICKR_OAUTH_APP_KEY) +
        "&oauth_signature_method=" + encodeURIComponent(FGA_FLICKR_OAUTH_SIGNATURE_METHOD) +
        "&oauth_version=" + encodeURIComponent(FGA_FLICKR_OAUTH_VERSION) + 
        "&oauth_signature=" + encodeURIComponent( signature ) + 
        "&oauth_callback=" + encodeURIComponent( FGA_FLICKR_OAUTH_CALLBACK_URI )

    const tokenRequestResponse:Response = await fetch( urlToRequest )

    const responseText:string = await tokenRequestResponse.text()

    const responseTokens:string[] = responseText.split( '&' )

    let responseDictionary:{ [key:string] : string } = {}

    for ( const currToken of responseTokens ) {
        const responsePair:string[] = currToken.split("=")

        responseDictionary[ responsePair[0] ] = responsePair[ 1 ]
    }

    const encodedToken = encodeURIComponent( responseDictionary['oauth_token'] )

    const authUrlResponse:{ [id:string]: string } = {
        'flickr_user_auth_url': 
            `https://www.flickr.com/services/oauth/authorize?oauth_token=${encodedToken}&perms=write` 
    }

    return new Response( JSON.stringify(authUrlResponse), 
        { 
            headers: new Headers( 
                { 
                    'Content-Type'                          : 'application/json',

                    // CORS header needed
                    'Access-Control-Allow-Origin'           : 'https://flickrgroupaddr.com',
                    'Access-Control-Allow-Credentials'      : 'true',
                }
            )
        }
    )
}
