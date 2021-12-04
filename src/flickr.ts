import jsSHA from "jssha";

export async function flickrAuthGetRequestToken(request: Request): Promise<Response> {
    const oauth_timestamp:number = Math.round((new Date()).getTime() / 1000.0);
    

    return new Response('Getting Flicker request token\n\nOAuth timestamp: ' + oauth_timestamp +
        "\n\nOauth callback: " + FGA_FLICKR_OAUTH_CALLBACK_URI )
 
}
