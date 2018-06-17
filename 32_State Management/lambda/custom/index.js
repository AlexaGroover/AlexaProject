/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
	},
	handle(handlerInput) {
		const speechText = 'Welcome to the fourth demo skill!';

		return handlerInput.responseBuilder
			.speak(speechText)
			.reprompt(speechText)
			.withSimpleCard('Hello World', speechText)
			.getResponse();
	},
};

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

const PersonNameIntentHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'PersonNameIntent';
	},
	handle(handlerInput) {
		const personName = handlerInput.requestEnvelope.request.intent.slots.PersonName.value;
		const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
		sessionAttributes.STATE = 'PersonName';
		handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

		return handlerInput.responseBuilder
			.speak(`Your name is ${personName}. Right?`)
			.withShouldEndSession(false)
			.getResponse();
	}
}

const PersonNameYesIntentHandler = {
	canHandle(handlerInput) {
		const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent' &&
			sessionAttributes.STATE === 'PersonName';
	},
	handle(handlerInput) {
		const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
		sessionAttributes.STATE = undefined;
		handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

		return handlerInput.responseBuilder
			.speak('You said Yes in Person Name')
			.withShouldEndSession(false)
			.getResponse();
	}
}


const PersonNameNoIntentHandler = {
	canHandle(handlerInput) {
		const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent' &&
			sessionAttributes.STATE === 'PersonName';
	},
	handle(handlerInput) {
		const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
		sessionAttributes.STATE = undefined;
		handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

		return handlerInput.responseBuilder
			.speak('You said No in Person Name')
			.withShouldEndSession(false)
			.getResponse();
	}
}


const CountryNameIntentHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'CountryNameIntent';
	},
	handle(handlerInput) {
		const countryName = handlerInput.requestEnvelope.request.intent.slots.CountryName.value;

		const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
		sessionAttributes.STATE = 'CountryName';
		handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

		return handlerInput.responseBuilder
			.speak(`You want to visit ${countryName}. Right?`)
			.withShouldEndSession(false)
			.getResponse();
	}
}



const CountryNameYesIntentHandler = {
	canHandle(handlerInput) {
		const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent' &&
			sessionAttributes.STATE === 'CountryName';
	},
	handle(handlerInput) {
		const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
		sessionAttributes.STATE = undefined;
		handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

		return handlerInput.responseBuilder
			.speak('You said Yes in Country Name')
			.withShouldEndSession(false)
			.getResponse();
	}
}


const CountryNameNoIntentHandler = {
	canHandle(handlerInput) {
		const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent' &&
			sessionAttributes.STATE === 'CountryName';
	},
	handle(handlerInput) {
		const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
		sessionAttributes.STATE = undefined;
		handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

		return handlerInput.responseBuilder
			.speak('You said No in Country Name')
			.withShouldEndSession(false)
			.getResponse();
	}
}

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
	.addRequestHandlers(
		LaunchRequestHandler,
		HelloWorldIntentHandler,
		HelpIntentHandler,
		CancelAndStopIntentHandler,
		SessionEndedRequestHandler,

		PersonNameIntentHandler,
		PersonNameYesIntentHandler,
		PersonNameNoIntentHandler,
		CountryNameIntentHandler,
		CountryNameYesIntentHandler,
		CountryNameNoIntentHandler
	)
	.addErrorHandlers(ErrorHandler)
	.lambda();