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
        type: String, require: true, unique: true
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
    organizer: {
        type: Schema.Types.ObjectId, ref: 'user'
    },
    riddle_category: {
        type: String,
        enum: ['Basic','Intermediate','Advanced']
    },
    //start_date: Date,
    qr_created: {
        type: Boolean, default: false
    },
    active: {
        type: Boolean, default: false
    },
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
    is_completed: {
        type: Boolean, default: false
    }
}).index({ game: 1, is_start: 1, is_final: 1 }, { unique: true });

const SingleGame = mongoose.model('singlegame', singleGameSchema);
// --------------------------------------------------------------------


// ----- ACTIONS -----
const actionsSchema = Schema({
    prog_nr: Number,
    sgame: { type: Schema.Types.ObjectId, ref: 'singlegame' },
    step: { type: Schema.Types.ObjectId, ref: 'location' },
    reachedOn: { type: Date, default: null },
    riddle: { type: Schema.Types.ObjectId, ref: 'riddle', default: null },
    solvedOn: { type: Date, default: null },
    group_photo: { type: String, default: null }
});

const Actions = mongoose.model('actions', actionsSchema);
// --------------------------------------------------------------------


// ----- LOCATIONS -----
const locationSchema = Schema({
    game: {
        type: Schema.Types.ObjectId, ref: 'game', required: true
    },
    cluster: Number, // progressive number
    location: {
        type: {
            type: String, 
            enum: ['Point']           
        },
        coordinates: [Number]
    },
    name: {
        type: String, default: ''
    },
    image_path: {
        type: String, default: null
    },
    description: { 
        type: String, default: null
    },
    hint: { 
        type: String, default: null 
    }, 
    is_start: {
        type: Boolean, default: false
    },
    is_final: {
        type: Boolean, default: false
    }
}).index( { location : "2dsphere" } );

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
    },
    is_final: {
        type: Boolean, default: false
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
exports.Actions = Actions;