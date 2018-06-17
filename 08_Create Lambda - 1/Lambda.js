exports.handler = (event, context, callback) => {
    context.succeed(makeResponse('Hello from a Lambda.'));
};

function makeResponse(text) {
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

    return res;
}