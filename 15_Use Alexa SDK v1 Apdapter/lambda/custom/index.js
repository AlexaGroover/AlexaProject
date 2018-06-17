/* eslint-disable  func-names */
/* eslint-disable  no-console */

const AlexaCore = require('ask-sdk-core');
const Alexa = require('ask-sdk-v1adapter');

const HelpIntentHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
	},
	handle(handlerInput) {
		const speechText = 'You can say hello to me!';

		return handlerInput.responseBuilder
			.speak(speechText)
			.reprompt(speechText)
			.withSimpleCard('Hello World', speechText)
			.getResponse();
	},
};

const handlers = {
	'LaunchRequest': function () {
		var speech = 'Welcome to ALexa Skill SDK Version 1 Adapter';
		this.response.speak(speech).shouldEndSession(false);
		this.emit(':responseReady');
	},
	'HelloIntent': function () {
		this.response
			.speak('Hey, How are you?')
			.listen('Hello there!');
		this.emit(':responseReady');
	}
}

exports.handler = function (event, context, callback) {
	const alexa = Alexa.handler(event, context);
	alexa.registerHandlers(handlers);
	alexa.registerV2Handlers(HelpIntentHandler);
	alexa.execute();
};