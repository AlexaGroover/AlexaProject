/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const i18next = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

const languageLabels = {
	"en-US": {
		translation: {
			WelcomeMessage: 'Welcome to the Alexa Skills Kit, you can say hello!',
			YourNameIsName: 'Your name is {{PersonName}}. Right?',
			YesInPersonIntent: 'You said Yes in Person Name',
			NoInPersonIntent: 'You said No in Person Name',
			YouWantToVisitCountry: 'You want to visit {{CountryName}}. Right?',
			YesInCountry: 'You said Yes in Country Name',
			NoInCountry: 'You said No in Country Name'
		}
	},
	"de-DE": {
		translation: {
			WelcomeMessage: 'Willkommen auf der Alexa Skills Kit, können Sie sagen, Hallo!',
			YourNameIsName: 'Dein Name ist {{PersonName}}. Richtig? ',
			YesInPersonIntent: 'Du hast ja im Personennamen gesagt ',
			NoInPersonIntent: 'Sie sagten Nein in Person Name ',
			YouWantToVisitCountry: 'Du möchtest {{CountryName}} besuchen. Richtig? ',
			YesInCountry: 'Du hast ja im Ländernamen gesagt ',
			NoInCountry: 'Du hast Nein im Ländernamen gesagt '
		}
	},
	"fr-FR": {
		translation: {
			WelcomeMessage: 'Bienvenue sur le kit de compétences Alexa, vous pouvez dire Bonjour!',
			YourNameIsName: 'votre nom est {{PersonName}}. N\'est-ce pas?',
			YesInPersonIntent: 'vous avez dit oui en nom de personne',
			NoInPersonIntent: 'vous avez dit non dans le nom de personne',
			YouWantToVisitCountry: 'vous voulez visiter {{CountryName}}. N\'est-ce pas?',
			YesInCountry: 'vous avez dit oui dans le nom du pays',
			NoInCountry: 'vous avez dit non dans le nom du pays'
		}
	}
}

i18next.use(sprintf).init({
	overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
	returnObjects: true,
	lng: "en-US",
	resources: languageLabels
})

const LaunchRequestHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
	},
	handle(handlerInput) {
		i18next.changeLanguage(handlerInput.requestEnvelope.request.locale);
		const speechText = i18next.t('WelcomeMessage');

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

		i18next.changeLanguage(handlerInput.requestEnvelope.request.locale);
		return handlerInput.responseBuilder
			.speak(i18next.t('YourNameIsName', { PersonName: personName }))
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

		i18next.changeLanguage(handlerInput.requestEnvelope.request.locale);
		return handlerInput.responseBuilder
			.speak(i18next.t('YesInPersonIntent'))
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

		i18next.changeLanguage(handlerInput.requestEnvelope.request.locale);
		return handlerInput.responseBuilder
			.speak(i18next.t('NoInPersonIntent'))
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

		i18next.changeLanguage(handlerInput.requestEnvelope.request.locale);
		return handlerInput.responseBuilder
			.speak(i18next.t('YouWantToVisitCountry'))
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

		i18next.changeLanguage(handlerInput.requestEnvelope.request.locale);
		return handlerInput.responseBuilder
			.speak(i18next.t('YesInCountry'))
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

		i18next.changeLanguage(handlerInput.requestEnvelope.request.locale);
		return handlerInput.responseBuilder
			.speak(i18next.t('NoInCountry'))
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