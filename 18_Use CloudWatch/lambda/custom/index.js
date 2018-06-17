/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
	},
	handle(handlerInput) {
		const speechText = 'Welcome to your first Alexa skill. From version 2 SDK';

		return handlerInput.responseBuilder
			.speak(speechText)
			.reprompt(speechText)
			.getResponse();
	},
};

const HelloIntentHandler = {
	canHandle: function (handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'HelloIntent';
	},
	handle: function (handlerInput) {
		const speechText = 'Hello, How are you?';
		const reprompt = 'Hey, How are you?';

		return handlerInput.responseBuilder
			.speak(speechText)
			.reprompt(reprompt)
			.getResponse();
	}
}


const DisplayGreetingsHandler = {
	canHandle: function (handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'DisplayGreetings';
	},
	handle: function (handlerInput) {
		var name = handlerInput.requestEnvelope.request.intent.slots.PersonName.value;

		console.log(JSON.stringify(handlerInput.requestEnvelope.request.intent.slots, null, 4));
		const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
		sessionAttributes['PersonName'] = name;
		handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

		const speechText = `Welcome back ${name}. <break time="3s"/> Good Morning.`;
		return handlerInput.responseBuilder
			.speak(speechText)
			.withShouldEndSession(false)
			.getResponse();
	}
}


const FavoriteLanguageHandler = {
	canHandle: function (handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'FavoriteLanguage';
	},
	handle: function (handlerInput) {
		// Note: Below line will generates error
		var selectedLanguage = handlerInput.some_undefined_property.requestEnvelope.request.intent.slots.LanguageName
			.resolutions.resolutionsPerAuthority[0].values[0].value;
		if (selectedLanguage) {
			var languageName = selectedLanguage.name;
			var languageId = selectedLanguage.id;

			var personName = 'Guest Name';
			const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
			if (sessionAttributes['PersonName']) {
				personName = sessionAttributes['PersonName'];
			}
			handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

			const speechText = `Hey ${personName}, You like ${languageName} whose ID is ${languageId}.`;
			return handlerInput.responseBuilder
				.speak(speechText)
				.getResponse();
		}
	}
}



const HelloWorldIntentHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
	},
	handle(handlerInput) {
		const speechText = 'Hello World!';

		return handlerInput.responseBuilder
			.speak(speechText)
			.withSimpleCard('Hello World', speechText)
			.getResponse();
	},
};

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

const CancelAndStopIntentHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			(handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
				handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
	},
	handle(handlerInput) {
		const speechText = 'Goodbye!';

		return handlerInput.responseBuilder
			.speak(speechText)
			.withSimpleCard('Hello World', speechText)
			.getResponse();
	},
};

const SessionEndedRequestHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
	},
	handle(handlerInput) {
		console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

		return handlerInput.responseBuilder.getResponse();
	},
};

const ErrorHandler = {
	canHandle() {
		return true;
	},
	handle(handlerInput, error) {
		console.log(`Error handled: ${error.message}`);

		return handlerInput.responseBuilder
			.speak('Sorry, I can\'t understand the command. Please say again.')
			.reprompt('Sorry, I can\'t understand the command. Please say again.')
			.getResponse();
	},
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
	.addRequestHandlers(
		LaunchRequestHandler,
		HelloWorldIntentHandler,
		HelpIntentHandler,
		CancelAndStopIntentHandler,
		SessionEndedRequestHandler,

		HelloIntentHandler,
		DisplayGreetingsHandler,
		FavoriteLanguageHandler
	)
	.addErrorHandlers(ErrorHandler)
	.addRequestInterceptors(function(requestEnvelope, response){
		console.log("\n" + "********************* REQUEST ENVELOPE **********************");
		console.log("\n" + JSON.stringify(requestEnvelope, null, 4));
	})
	.addResponseInterceptors(function(requestEnvelope, response){
		console.log("\n" + "********************* RESPONSE **********************");
		console.log("\n" + JSON.stringify(response, null, 4));
	})
	.lambda();