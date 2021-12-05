import jsSHA from "jssha";

export async function flickrAuthGetRequestToken(request: Request): Promise<Response> {
    const oauthTimestamp:number = Math.round((new Date()).getTime() / 1000.0);

    let integerArray:Uint32Array = new Uint32Array(1)
    crypto.getRandomValues( integerArray )

    let oauthNonce:string = crypto.randomUUID() 

    // NOTE! The parameters are not in a random order. They have to be in lexigraphical order, hence why _callback
    //      is first, and _version is last. regardless of order in the request, the signature will be repeatable
    const baseStringComponents:string[] = [
        FGA_FLICKR_OAUTH_REQUEST_TOKEN_VERB,
        FGA_FLICKR_OAUTH_REQUEST_TOKEN_ENDPOINT_URI,
        "oauth_callback=" + FGA_FLICKR_OAUTH_CALLBACK_URI,
        "oauth_consumer_key=" + FGA_FLICKR_OAUTH_APP_KEY,
        "oauth_nonce=" + oauthNonce,
        "oauth_signature_method=" + FGA_FLICKR_OAUTH_SIGNATURE_METHOD,
        "oauth_timestamp=" + oauthTimestamp,
        "oauth_version=" + FGA_FLICKR_OAUTH_VERSION,
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
    
    //let shaObj = new jsSHA( encodedBaseString, "TEXT" )
    //const signature:string = shaObj.getHMAC( requestSigningKey, "TEXT", "SHA-1", "B64" )

    const shaObj = new jsSHA( "SHA-1", "TEXT", { hmacKey: { value: requestSigningKey, format: "TEXT" }, } )
    shaObj.update( encodedBaseString )
    const signature:string = shaObj.getHash( "HEX" )

    return new Response("Getting Flicker request token\n\nEncoded base string: " + encodedBaseString +
        "\n\nSigning key: " + requestSigningKey + "\n\nSignature: " + signature)

}
