# LogoService
Getting a Image for a Brand From Twitter.

I have always found a need to get a logo for a name, may be a Brand Name, Organization or anything. No public serivce is available for this.
For this use case I have found a simple way of getting it from twitter.

For this use case, we will get the list of nouns from a brand name and search for users on twitter with those nouns.
In the list of users so retreived we will use the profile image of user which as highest Followers/Following ratio.


# Getting Started
#####  Installation


    npm install logoservice --save

##### Usage

Using service

    var logoService = require('logoservice');
    var LogoService = new logoService(TWITTER_CONFIG, RETURN_FIRST_RESULT);
    
    
TWITTER_CONFIG is the configuation of twitter application:

    {
        consumer_key: '<VALUE>',
        consumer_secret: '<VALUE>',
        access_token_key: '<VALUE>',
        access_token_secret: '<VALUE>'
    }
RETURN_FIRST_RESULT if set to true then first result is returned, if skipped or set to false then profile image of the best twitter account from the search result is returned.

### Finally getting logo

    LogoService.getLogoForName(brandname, function(err, data) {
                if (err || !data) {
                    console.log('Unable to find logo correctly');
                    console.log(err);
                    sendResponse(404, '', res);
                } else {
                    res.writeHead(302, {
                        'Location': data
                    });
                    res.end();
                }
            });
