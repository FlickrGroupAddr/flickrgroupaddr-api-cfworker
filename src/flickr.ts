import jsSHA from "jssha";

export async function flickrAuthGetRequestToken(request: Request): Promise<Response> {
    const oauth_timestamp:number = Math.round((new Date()).getTime() / 1000.0);

    let integerArray:Uint32Array = new Uint32Array(1)
    crypto.getRandomValues( integerArray )

    let oauthNonce:number = integerArray[0];

    const baseStringComponents:string[] = [
        FGA_FLICKR_OAUTH_REQUEST_TOKEN_VERB,
        FGA_FLICKR_OAUTH_REQUEST_TOKEN_ENDPOINT_URI,
        "oauth_callback=" + FGA_FLICKR_OAUTH_CALLBACK_URI,
        "oauth_consumer_key=" + FGA_FLICKR_OAUTH_APP_KEY,
        "oauth_nonce=" + oauthNonce,
        "oauth_signature_method=" + "",
        "oauth_timestamp=" + "",
        "oauth_version=" + "",
    ];

    let encodedBaseString:string = "";

    for ( let currComponent of baseStringComponents ) {
        encodedBaseString += encodeURIComponent( currComponent ) + "&"
    }

    // TODO: trim off last ampsersand
    

    return new Response("Getting Flicker request token\n\nEncoded base string: " + encodedBaseString )
 
}
