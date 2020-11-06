const mongoose = require('mongoose'); // MongoDB framework
const Schema = mongoose.Schema;

// ----- CLUSTERS -----
const clusterSchema = Schema({
    game: {
        type: Schema.Types.ObjectId, ref: 'game'
    },    
    locations: {
        type: [{ type: Schema.Types.ObjectId, ref: 'location' }],
        default: null
    }
});
//.index({ nome: 1, localita: 1, provincia: 1 }, { unique: true });

const Cluster = mongoose.model('cluster', clusterSchema);
// --------------------------------------------------------------------


// ----- EVENTS -----
const eventSchema = Schema({
    name: {
        type: String, default: null, unique: true
    },
    min_locations: {
        type: Number, default: 10
    },
    max_locations: {
        type: Number, default: 30
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
    clusters: {
        type: [{ type: Schema.Types.ObjectId, ref: 'cluster' }],
        default: null
    },
    organizer: {
        type: Schema.Types.ObjectId, ref: 'user'
    }
});

const Game = mongoose.model('game', gameSchema);
// --------------------------------------------------------------------


// ----- GROUPS -----
const groupSchema = Schema({
    game: {
        type: Schema.Types.ObjectId, ref: 'game'
    },
    name: {
        type: String, default: null, unique: true
    },
    captain: {
        type: Schema.Types.ObjectId, ref: 'user'
    },
    num_players: {
        type: Number, required: true
    },
    final_location: {
        type: Schema.Types.ObjectId, ref:'location'
    }
});

const Group = mongoose.model('group', groupSchema);
// --------------------------------------------------------------------


// ----- LOCATIONS -----
const locationSchema = Schema({
    game: {
        type: Schema.Types.ObjectId, ref: 'game'
    },
    cluster: {
        type: Schema.Types.ObjectId, ref: 'cluster'
    },
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
    is_start: {
        type: Boolean, default: false
    },
    is_end: {
        type: Boolean, default: false
    }
});

const Location = mongoose.model('location', locationSchema);
// --------------------------------------------------------------------


// ----- RIDDLES -----
const riddleSchema = Schema({
    event: {
        type: Schema.Types.ObjectId, ref: 'event'
    },
    riddle_type: {
        type: Number, default: 1, required: true
    },
    riddle_param: {
        type: String, default: '', required: true
    },
    image_path: {
        type: String, default: null
    },
    solution: {
        type: String, required: true
    }
});

const Riddle = mongoose.model('riddle', riddleSchema);
// --------------------------------------------------------------------


// ----- USERS -----
const userSchema = Schema({
    first_name: {
        type: String, required: true
    },
    full_name: {
        type: String, required: true
    },
    username: {
        type: String, require: true, unique: true
    },
    password: {
        type: String, required: true
    },
    is_admin: {
        type: Number, default: 0
    }
});

const User = mongoose.model('user', userSchema);
// --------------------------------------------------------------------


exports.Cluster = Cluster;
exports.Event = Event;
exports.Game = Game;
exports.Group = Group;
exports.Location = Location;
exports.Riddle = Riddle;
exports.User = User;