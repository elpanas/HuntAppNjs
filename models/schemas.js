const mongoose = require('mongoose'); // MongoDB framework
const Schema = mongoose.Schema;

//.index({ nome: 1, localita: 1, provincia: 1 }, { unique: true });


// ----- USERS -----
const userSchema = Schema({
    first_name: {
        type: String
    },
    full_name: {
        type: String
    },
    username: {
        type: String, require: true
    },
    password: {
        type: String, required: true
    },
    is_admin: {
        type: Boolean, default: false
    }
});

const User = mongoose.model('user', userSchema);
// --------------------------------------------------------------------


// ----- EVENTS -----
const eventSchema = Schema({
    name: {
        type: String, default: null, unique: true
    },
    logo_path: {
        type: String, default: null
    },
    min_locations: {
        type: Number, default: 2
    },
    max_locations: {
        type: Number, default: 8
    },
    min_avg_distance: {
        type: Number, default: null
    },
    organizer: {
        type: Schema.Types.ObjectId, ref: 'user'
    }
});

const Event = mongoose.model('event', eventSchema);
// --------------------------------------------------------------------


// ----- GAMES -----
const gameSchema = Schema({
    event: {
        type: Schema.Types.ObjectId, ref: 'event'
    },
    name: {
        type: String, default: null, unique: true
    },
    riddle_category: {
        type: String,
        enum: ['Basic','Intermediate','Advanced']
    },
    // start_date: Date,
    is_open: {
        type: Boolean, default: false
    }
});

const Game = mongoose.model('game', gameSchema);
// --------------------------------------------------------------------


// ----- SINGLE GAME -----
const singleGameSchema = Schema({ // when game is booted
    game: {
        type: Schema.Types.ObjectId, ref: 'game'
    },    
    group_name: {
        type: String, default: null, unique: true
    },
    group_captain: {
        type: Schema.Types.ObjectId, ref: 'user'
    },
    group_nr_players: {
        type: Number, required: true
    },
    group_photo_path: {
        type: String, default: null
    },    
    steps: [
        {
            prog_nr: Number,
            step: { type: Schema.Types.ObjectId, ref: 'location' },
            reachedOn: { type: Date, default: null },
            riddle: { type: Schema.Types.ObjectId, ref: 'riddle', default: null },
            solvedOn: { type: Date, default: null }
        },
    ],
    bootdate: { // a parità di partite con stesso id, sceglie quella più recente
        type: Date, default: Date.now
    }
});

const SingleGame = mongoose.model('singlegame', singleGameSchema);
// --------------------------------------------------------------------


// ----- LOCATIONS -----
const locationSchema = Schema({
    game: {
        type: Schema.Types.ObjectId, ref: 'game'
    },
    cluster: Number, // progressive number
    location: {
        type: {
            type: String, 
            enum: ['Point']           
        },
        coordinates: [Number]
    },
    image_path: {
        type: String, default: null
    },
    description: String,
    hint: String, 
    is_start: {
        type: Boolean, default: false
    },
    is_final: {
        type: Boolean, default: false
    }
});

const Location = mongoose.model('location', locationSchema);
// --------------------------------------------------------------------


// ----- RIDDLE -----
const riddleSchema = Schema({   
    riddle_category: {
        type: String,
        enum: ['Basic','Intermadiate','Hard']
    },
    riddle_type: {
        type: Number, default: 1
    },
    riddle_param: {
        type: String, default: ''
    },
    riddle_image_path: {
        type: String, default: null
    },
    riddle_solution: {
        type: String
    }
});

const Riddle = mongoose.model('riddle', riddleSchema);
// --------------------------------------------------------------------

exports.User = User;
exports.Event = Event;
exports.Game = Game;
exports.SingleGame = SingleGame;
exports.Location = Location;
exports.Riddle = Riddle;