exports.handler = (event, context) => {
    var req = event.request;
    var res = makeResponse('Unable to process your request');

    try {
        if (req.type === 'LaunchRequest') {
            res = makeResponse('Welcome to your first Alexa skill.');
        } else if (req.type === 'IntentRequest' && req.intent) {

            switch (req.intent.name) {
                case 'HelloIntent': {
                    res = makeResponse('Hello, How are you?');
                    break;
                }
                case 'DisplayGreetings': {
                    res = handleDisplayGreetings(req.intent);
                    break;
                }
                case 'FavoriteLanguage': {
                    res = handleFavoriteLanguage(event);
                    break;
                }
            }
        }
        context.succeed(res);
    }
    catch (e) {
        context.fail("Exception: " + e);
    }
};


function handleDisplayGreetings(intent) {
    var name = intent.slots.PersonName.value;
    return makeResponse(`Welcome back ${name}. Good Morning.`, { 'PersonName': name });
}

function handleFavoriteLanguage(event) {
    var selectedLanguage = event.request.intent.slots.LanguageName.resolutions.resolutionsPerAuthority[0].values[0].value;
    if (selectedLanguage) {
        var languageName = selectedLanguage.name;
        var languageId = selectedLanguage.id;
        var personName = (event.session && event.session.attributes && event.session.attributes.PersonName)
            ? event.session.attributes.PersonName
            : 'Guest User';
        return makeResponse(`Hey ${personName}, You like ${languageName} whose ID is ${languageId}`);
    } else {
        return makeResponse('Unable to identify your favorite language.');
    }
}

function makeResponse(text, sessionData) {
    var res = {
        "version": "1",
        "response": {
            "outputSpeech": {
                "type": "PlainText",
                "text": text,
            },
            "shouldEndSession": false
        }
    };

    if (sessionData)
        res.sessionAttributes = sessionData;

    return res;
}