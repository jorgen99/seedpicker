const {client: browser} = require('nightwatch-api');
const {Given, When, Then} = require('cucumber');
const expect = require("chai").expect;
const chai = require("chai");
chai.use(require('chai-string'));
const step_helpers = require('./step_helpers');

const validWords =
    "     empower  soul    reunion  entire  help raise   " +
    "truth  reflect    argue transfer chicken narrow oak " +
    "friend junior figure auto small  push spike    next " +
    "pledge december   "

Given(/^I open the Seedpicker calculator$/, async () => {
    const workingDir = process.cwd()
    const fileUrl = "file://" + workingDir + "/calculator/last-word.html"
    await browser
        .url(fileUrl)
        .waitForElementVisible('body', 1000)
});
Then(/^I see the Seedpicker page$/, async function () {
    await browser
        .waitForElementVisible('body', 1000)
        .getTitle(function (phrase) {
            expect(phrase).to.startWith("SeedPicker:")
        })
});
Given(/^I enter the words "([^"]*)"$/, async words => {
    await browser.setValue('#seedphrase_input', words)
});
Given(/^I enter 23 valid words$/, async () => {
    await browser.setValue('#seedphrase_input', validWords)
});
When(/^I click the Calculate button$/, async () => {
    await browser.click('#seed-submit')
});
When(/^I press ENTER$/, async () => {
    await browser.setValue('#seedphrase_input', browser.Keys.ENTER)
});
Then(/^I can see the last word$/, async () => {
    await browser
        .expect.element("#checksum_word")
        .to.be.visible
});
Then(/^the last word should be "([^"]*)"$/, async word => {
    await browser
        .expect.element("#checksum_word").text
        .to.equal(word)
});
Then(/^the Extended Public Key should start with "([^"]*)"$/, async word => {
    await browser
        .expect.element("#extended_pub_result").text
        .to.startWith(word)
});
Then(/^there should not be an error message$/, async () => {
    await browser
        .waitForElementNotVisible("#seed_error_msg")
        .expect.element("#seed_error_msg")
        .to.not.be.visible
});
When(/^I click the QR-code button$/, async () => {
    await browser
        .waitForElementVisible("#qr_code_button", 1000)
        .click('#qr_code_button')
});
Then(/^I should see the QR-code$/, async () => {
    await browser
        .expect.element("#qr_code > canvas")
        .to.be.visible
});
Then(/^I should see the Extended Public Key in the same dialog$/, async () => {
    let qr_text_value =
        await step_helpers.getTextFrom("#qr_text", browser)
    let ext_pub_value =
        await step_helpers.getTextFrom("#extended_pub_result", browser)

    expect(qr_text_value).to.not.equal("")
    expect(qr_text_value).to.not.equal("undefined")
    expect(qr_text_value).to.equal(ext_pub_value)
})
When(/^I click the close-x on the QR-code dialog$/, async () => {
    await browser
        .click('.modal-close')
});
Then(/^the QR-code dialog should go away$/, async () => {
    await browser
        .expect.element("#qr_code > canvas")
        .to.not.be.present
});
Then(/^the Advanced button has the text "([^"]*)"$/, async buttonText => {
    await browser
        .expect.element("#toggle_advanced_btn").text
        .to.equal(buttonText)
});
Then(/^I should not see the Avanced-section$/, async () => {
    await browser
        .expect.element("#advanced").to.not.be.visible
});
When(/^I click the Advanced button$/, async () => {
    await browser
        .click('#toggle_advanced_btn')
});
Then(/^I should see the Advanced-section$/, async () => {
    await browser
        .expect.element("#advanced").to.be.visible
});
Then(/^I should see the xpub key$/, async () => {
    await browser
        .expect.element("#xpub_key").to.be.visible
});

Then(/^I can see the error message "([^"]*)"$/, async errorMessage => {
    await browser
        .expect.element("#seed_error_msg")
        .to.be.visible

    await browser
        .expect.element("#seed_error_msg").text
        .to.equal(errorMessage);
});
When(/^I leave the phrase field empty$/, async () => {
    await browser.setValue('#seedphrase_input', "")
});
Then(/^the phrase input should contain (\d+) words$/, async function (noOfWords) {
    await browser.getValue("#seedphrase_input", function (phrase) {
        const words = phrase.value.trim().split(" ")
        expect(words).to.have.lengthOf(noOfWords)
    })
});
