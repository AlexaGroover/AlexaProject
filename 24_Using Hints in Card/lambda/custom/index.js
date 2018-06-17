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
		var selectedLanguage = handlerInput.requestEnvelope.request.intent.slots.LanguageName
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

const GenerateCardHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'GenerateCard';
	},
	handle(handlerInput) {
		const speechText = 'Here is your card';
		const title = 'Sample card Demo';
		const content = 'See random umages in a card!';

		const images = [
			'https://s3.amazonaws.com/samplemp3files/image_1.jpg',
			'https://s3.amazonaws.com/samplemp3files/image_2.jpg',
			'https://s3.amazonaws.com/samplemp3files/image_3.jpg',
			'https://s3.amazonaws.com/samplemp3files/image_4.jpg',
			'https://s3.amazonaws.com/samplemp3files/image_5.jpg',
			'https://s3.amazonaws.com/samplemp3files/image_6.jpg'
		];

		var randomNumber = Math.floor(Math.random() * images.length) + 1;
		return handlerInput.responseBuilder
			.speak(speechText)
			// .withSimpleCard(title, content)
			.withStandardCard(title, content, images[randomNumber], images[randomNumber])
			.getResponse();
	}
}

const MusicIntentHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'MusicIntent';
	},
	handle(handlerInput) {
		const audioUrl = 'https://s3.amazonaws.com/samplemp3files/mp3_2.mp3';
		const speechOutput = 'Playing your request';

		return handlerInput.responseBuilder
			.speak(speechOutput)
			.addAudioPlayerPlayDirective('REPLACE_ALL', audioUrl, audioUrl, 0, null)
			.getResponse();
	}
}

const PauseIntentHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PauseIntent' &&
			handlerInput.requestEnvelope.content.AudioPlayer.playActivity === 'PLAYING';
	},
	handle(handlerInput) {
		const speechOutput = 'Sopping your music request';

		return handlerInput.responseBuilder
			.speak(speechOutput)
			.addAudioPlayerStopDirective()
			.getResponse();
	}
}

const ShowVideoHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'ShowVideo';
	},
	handle(handlerInput) {
		if (handlerInput.requestEnvelope.context.System.device.supportedInterfaces.VideoApp) {
			const speechText = 'Playing your request';
			const title = 'My Video Player';
			const subtitle = 'My favorite track details';
			const videoUrl = 'https://s3.amazonaws.com/samplemp3files/videoplayback.mp4';

			return handlerInput.responseBuilder
				.speak(speechOutput)
				.addVideoAppLaunchDirective(videoUrl, title, subtitle)
				.getResponse();
		} else {
			return handlerInput.responseBuilder
				.speak('Your device does not support Video playback.')
				.getResponse();
		}
	}
}

const ShowHintHandler = {
	canHandle(handlerInput){
		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'ShowHint';
	},
	handle(handlerInput){
		const title = 'Hint Demo';
		const content = 'See Hint in card';
		const image = 'https://s3.amazonaws.com/samplemp3files/image_6.jpg';
		const hintText = 'Generate Card to see Different Image in card';

		return handlerInput.responseBuilder
			.speak(title)
			.addHintDirective(hintText)
			.withStandardCard(title, content, image, image)
			.getResponse();
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
		FavoriteLanguageHandler,
		GenerateCardHandler,
		MusicIntentHandler,
		PauseIntentHandler,
		ShowVideoHandler,
		ShowHintHandler
	)
	.addErrorHandlers(ErrorHandler)
	.addRequestInterceptors(function (requestEnvelope, response) {
		console.log("\n" + "********************* REQUEST ENVELOPE **********************");
		console.log("\n" + JSON.stringify(requestEnvelope, null, 4));
	})
	.addResponseInterceptors(function (requestEnvelope, response) {
		console.log("\n" + "********************* RESPONSE **********************");
		console.log("\n" + JSON.stringify(response, null, 4));
	})
	.lambda();