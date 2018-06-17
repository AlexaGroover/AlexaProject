/* eslint-disable  func-names */
/* eslint-disable  no-console */

const AlexaCore = require('ask-sdk-core');
const Alexa = require('ask-sdk-v1adapter');

var handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', 'Welcome to your first Alexa skill. From CLI');
    },
    'Whatsup': function () {
        this.emit('HelloIntent');
    },
    'HelloIntent': function () {
        this.emit(':ask', 'Hello, How are you?', 'Hey, How are you?');
    },
    'DisplayGreetings': function () {
        var name = this.event.request.intent.slots.PersonName.value
        if (!this.event.session.attributes)
            this.event.session.attributses = {};
        this.event.session.attributes.PersonName = name;
        this.emit(':ask', `Welcome back ${name}. <break time="3s"/> Good Morning.`);
    },
    'FavoriteLanguage': function () {
        var selectedLanguage = this.event.request.intent.slots.LanguageName
            .resolutions.resolutionsPerAuthority[0].values[0].value;
        if (selectedLanguage) {
            var languageName = selectedLanguage.name;
            var languageId = selectedLanguage.id;
            var personName = (this.event.session && this.event.session.attributes
                && this.event.session.attributes.PersonName)
                ? this.event.session.attributes.PersonName
                : 'Guest User';
            this.emit(':tell', `Hey ${personName}, You like ${languageName} whose ID is ${languageId}`);
        } else {
            this.emit(':ask', 'Unable to identify your favorite language.');
        }
    },
    'Unhandled': function () {
        this.emit(':tell', "Sorry, I didn't get that.");
    }
};


exports.handler = function (event, context, callback) {
	const alexa = Alexa.handler(event, context);
	alexa.registerHandlers(handlers);
	alexa.execute();
};