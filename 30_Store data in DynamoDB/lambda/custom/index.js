/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');
const AlexaCore = require('ask-sdk-core');
const AwsSdk = require('aws-sdk');
const DynamoDBAdapter = require('ask-sdk-dynamodb-persistence-adapter');

const LaunchRequestHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
	},
	handle(handlerInput) {
		const speechText = 'Welcome to the Third Demo Skill!';

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


const IntroWithAgeHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'IntroWithAge';
	},
	handle(handlerInput) {
		const {
			request
		} = handlerInput.requestEnvelope;
		const {
			intent
		} = request;
		if (request.dialogState === 'STARTED') {
			if (intent.slots.Age.value === undefined || intent.slots.Age.value === null)
				intent.slots.Age.value = 24;

			return handlerInput.responseBuilder
				.addDelegateDirective(intent)
				.withShouldEndSession(false)
				.getResponse();
		} else if (request.dialogState !== 'COMPLETED') {
			return handlerInput.responseBuilder
				.addDelegateDirective()
				.withShouldEndSession(false)
				.getResponse();
		} else {
			const name = intent.slots.PersonName.value;
			const age = intent.slots.Age.value;
			const speechText = `Hey ${name}, Your age is ${age}`;

			return handlerInput.responseBuilder
				.speak(speechText)
				.getResponse();
		}
	}
}

const AddUserPreferenceHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'AddUserPrefrence';
	},
	handle(handlerInput) {
		const {
			intent
		} = handlerInput.requestEnvelope.request;
		const personNameSlot = intent.slots.PersonName;
		const countryNameSlot = intent.slots.CountryName;
		const countSlot = intent.slots.Count;

		// if (personNameSlot.value === undefined || personNameSlot.value === null) {
		// 	return handlerInput.responseBuilder
		// 		.speak('Tell me your name')
		// 		.addElicitSlotDirective(personNameSlot.name)
		// 		.getResponse();
		// } else if (countryNameSlot.value === undefined || countryNameSlot.value === null) {
		// 	return handlerInput.responseBuilder
		// 		.speak('Which country do you want to visit?')
		// 		.addElicitSlotDirective(countryNameSlot.name)
		// 		.getResponse();
		// } else if (countSlot.value === undefined || countSlot.value === null) {
		// 	return handlerInput.responseBuilder
		// 		.speak('With how many friends?')
		// 		.addElicitSlotDirective(countSlot.name)
		// 		.getResponse();
		// } else if (countSlot.confirmationStatus === 'NONE') {
		// 	return handlerInput.responseBuilder
		// 		.speak(`You want to visit with ${countSlot.value}`)
		// 		.addConfirmSlotDirective(countSlot.name)
		// 		.getResponse();
		// } else if (countSlot.confirmationStatus === 'DENIED') {
		// 	return handlerInput.responseBuilder
		// 		.speak(`Can you please tell me agin with how many friends you want to visit ${countryNameSlot.value}?`)
		// 		.addElicitSlotDirective(countSlot.name)
		// 		.getResponse();
		// } else {
			const personName = personNameSlot.value;
			const countryName = countryNameSlot.value;
			const count = countSlot.value;

			const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
			sessionAttributes.PersonName = personName;
			sessionAttributes.CountryName = countryName;
			sessionAttributes.FriendsCount = count;

			handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

			const speech = `Your name is ${personName}. You want to visit ${countryName} with ${count} other.`;

			return handlerInput.responseBuilder
				.speak(speech)
				.withShouldEndSession(false)
				.getResponse();
		// }
	}
}

const SaveUserPreferenceHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'SaveUserPreference';
	}, 
	handle(handlerInput) {
		return new Promise((resolve, reject) => {
			handlerInput.attributesManager.getPersistentAttributes()
				.then((dynamoAttributes) => {
					const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
					dynamoAttributes.PersonName = sessionAttributes.PersonName;
					dynamoAttributes.CountryName = sessionAttributes.CountryName;
					dynamoAttributes.FriendsCount = sessionAttributes.FriendsCount;

					handlerInput.attributesManager.setPersistentAttributes(dynamoAttributes);
					return handlerInput.attributesManager.savePersistentAttributes(handlerInput, dynamoAttributes);
				})
				.then(() => {
					resolve(handlerInput.responseBuilder
						.speak('Your data saved successgully! Open skill again to check those data.')
						.withShouldEndSession(true)
						.getResponse());
				})
				.catch((error) => {
					reject(error);
				})
		})
	}
}



const ShowUserPreferenceHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'ShowUserPreference';
	}, 
	handle(handlerInput) {
		return new Promise((resolve, reject) => {
			handlerInput.attributesManager.getPersistentAttributes()
				.then((dynamoAttributes) => {
					const speechText = `Hey ${dynamoAttributes.PersonName}, You want to visit ${dynamoAttributes.CountryName} with ${dynamoAttributes.FriendsCount} friends.`;
					resolve(handlerInput.responseBuilder
						.speak(speechText)
						.withShouldEndSession(true)
						.getResponse());
				})
				.catch((error) => {
					reject(error);
				})
		})
	}
}


const FoodOrderIntentHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'FoodOrderIntent';
	},
	handle(handlerInput) {
		const { intent } = handlerInput.requestEnvelope.request;
		if (intent.confirmationStatus === 'CONFIRMED') {
			const orderItem = intent.slots.OrderItem.value;
			const orderQuantity = intent.slots.OrderQuantity.value;
			const speech = `You order for ${orderQuantity} ${orderItem} noted successfully. Thank you.`;

			return handlerInput.responseBuilder
				.speak(speech)
				.getResponse();
		} else if (intent.confirmationStatus === 'DENIED') {
			return handlerInput.responseBuilder
				.speak('Can you tell me again what you want?')
				.reprompt('Can you tell me again what you want?')
				.getResponse();
		} else {
			const orderItem = intent.slots.OrderItem.value;
			const orderQuantity = intent.slots.OrderQuantity.value;
			const speech = `You want to buy ${orderQuantity} ${orderItem}. Right?`;

			return handlerInput.responseBuilder
				.speak(speech)
				.addConfirmIntentDirective()
				.getResponse();
		}
	}
}

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
	.addRequestHandlers(
		LaunchRequestHandler,
		HelloWorldIntentHandler,
		HelpIntentHandler,
		CancelAndStopIntentHandler,
		SessionEndedRequestHandler,

		IntroWithAgeHandler,
		AddUserPreferenceHandler,
		FoodOrderIntentHandler,
		SaveUserPreferenceHandler,
		ShowUserPreferenceHandler
	)
	.addErrorHandlers(ErrorHandler)
	.addRequestInterceptors(function (requestEnvelope) {
		console.log("\n" + "******************* REQUEST ENVELOPE **********************");
		console.log("\n" + JSON.stringify(requestEnvelope, null, 4));
	})
	.addResponseInterceptors(function (requestEnvelope, response) {
		console.log("\n" + "******************* RESPONSE  **********************");
		console.log("\n" + JSON.stringify(response, null, 4));
	})
	.withTableName('UserPreference')
	.withDynamoDbClient(new AwsSdk.DynamoDB({
		apiVersion: 'latest'
	}))
	.withPartitionKeyGenerator(DynamoDBAdapter.PartitionKeyGenerators.userId)
	.lambda();