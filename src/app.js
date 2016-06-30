/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');

var cards = [];
var card_index = 0;

var main = new UI.Card({
  subtitle: 'Today, £1 will buy...',
  subtitleColor: 'indigo', // Named colors
  bodyColor: '#9a0036' // Hex colors
});
main.show();

function fetch_results(symbols, cb) {
    var url = "https://api.fixer.io/latest?base=GBP&symbols=" + symbols.join(',');
    ajax({url: url, type: 'json'}, function(response) {
        var cards = [];
        symbols.forEach(function(symbol){
            var card = new UI.Card({title: symbol, body: response.rates[symbol]});
            card.on('click', 'down', show_next_card);
            card.on('click', 'up', show_previous_card);
            card.on('click', 'back', exit_app);
            cards.push(card);
        });
        cb(cards);
    });   
}

function show_next_card() {
    if (card_index == cards.length) { card_index = 0; }
    cards[card_index++].show();
}

function show_previous_card() {
    if (card_index < 0) { card_index = cards.length - 1; }
    cards[card_index--].show();
}

function exit_app() {
    cards.forEach(function(card) {
       card.hide(); 
    });
}

fetch_results(['USD', 'EUR'], function(rate_cards){
    cards = rate_cards;
    card_index = 0;
    show_next_card();
    main.hide();
});
