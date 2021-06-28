const express = require('express'),
  { createEvent } = require('../middleware/eventware'),
  { createGame } = require('../middleware/gameware'),
  { createSingleGame, createSteps } = require('../middleware/sgameware'),
  { createLocations } = require('../middleware/locatware'),
  { createUser } = require('../middleware/userware');
const router = express.Router();

async function startTest() {
  //FASE 1 CREAZIONE
  // Registrazione utente
  const userdata = {
    first_name: 'Luca',
    full_name: 'Pana',
    username: 'luke',
    password: '123456',
    is_admin: true,
  };
  const user = await createUser(userdata);

  const idu = user._id;
  const eventdata = {
    name: 'Event1',
    minloc: 2,
    maxloc: 4,
    avgloc: 100,
  };

  const event = await createEvent(eventdata, idu);

  const ide = event._id;
  const gamedata = {
    event_id: ide,
    name: 'Game1',
    organizer: idu,
    riddle_category: 'Basic',
    is_open: true,
  };
  const game = await createGame(gamedata);

  const idg = game._id,
    riddle_cat = game.riddle_category;
  // Creazione N clusters
  // const cluster_nr = getNrClusterLoc(idg) + 1;
  const locationdata = [
    {
      // 1 location
      game: idg,
      cluster: 1,
      location: {
        type: 'Point',
        coordinates: [59.3399, 18.0548],
      },
      description: 'Find the place where the first Swedish computer was built.',
      hint: 'It is the biggest town in Sweden.',
      is_start: true,
    },
    {
      // 2 location
      game: idg,
      cluster: 1,
      location: {
        type: 'Point',
        coordinates: [35.8621, 23.305],
      },
      description:
        'Find the place of a hand-powered device that was used to predict astronomical positions.',
      hint: 'It took its name from the Greek island where it was found.',
    },
    {
      // 3 location
      game: idg,
      cluster: 2,
      location: {
        type: 'Point',
        coordinates: [45.5469, 11.5465],
      },
      description:
        'Find the place of birth of the man who created a technology that made the microprocessor possible.',
      hint: 'This city is close to Venice in Italy.',
    },
    {
      // 4 location
      game: idg,
      cluster: 2,
      location: {
        type: 'Point',
        coordinates: [48.2082, 16.3738],
      },
      description:
        'Find the place of study of the man who created the printed circuit board.',
      hint: 'Paul Eislier studied in a German speaking capital situated on the Danube.',
    },
    {
      // 5 location
      game: idg,
      cluster: 2,
      location: {
        type: 'Point',
        coordinates: [47.5039, 19.0548],
      },
      description:
        'Find the place of birth of the man who co-created the BASIC programming language.',
      hint: 'John George Kemeny was born in ninth-largest city in the European Union.',
    },
    {
      // 6 location
      game: idg,
      cluster: 2,
      location: {
        type: 'Point',
        coordinates: [45.764, 4.8357],
      },
      description:
        'Find the place where a weaver who played an important role in the development of hte earlierst programmable loom came from.',
      hint: 'The third largest city in France.',
    },
    {
      // 7 location
      game: idg,
      cluster: 3,
      location: {
        type: 'Point',
        coordinates: [46.0321, 14.5278],
      },
      description:
        'Find the place where the inventor of Line Rider went to school.',
      hint: 'It’s the capital city of an EU country with LOVE in its name.',
    },
    {
      // 8 location
      game: idg,
      cluster: 3,
      location: {
        type: 'Point',
        coordinates: [44.8149, 20.1424],
      },
      description:
        'Find the place of one of the pioneers of the net.art movement.',
      hint: 'Look for a pin where Danube meets the river Sava.',
    },
    {
      // 9 location
      game: idg,
      cluster: 3,
      location: {
        type: 'Point',
        coordinates: [47.3727, 8.53083],
      },
      description: 'Find the city hosting a huge online calendar.',
      hint: 'The country is known for its alps, chocolate and its citizens have the reputation of always being on time.',
    },
    {
      // 10 location
      game: idg,
      cluster: 3,
      location: {
        type: 'Point',
        coordinates: [50.081, 14.4114],
      },
      description:
        'Find the city where the word robot was used in public for the first time in 1921.',
      hint: 'The play is called RUR - Rossums Universial Robots.',
      is_final: true,
    },
  ]; // inserisci le coordinate
  await createLocations(locationdata);

  // FASE 2 Creazione squadra
  const singleGameInput = {
    game_id: idg,
    group_name: 'Group1',
    group_nr_players: 5,
  };
  const singleGame = await createSingleGame(singleGameInput, idu);
  var idsg = singleGame._id;
  await createSteps(idg, idsg, riddle_cat);

  // FASE 3 GIOCO
  /*   
    1) getAction(idsg) // prende e invia le info sulla tappa (descrizione, coordinate) 

    2) setReached(ida); // dopo aver scansionato il qrcode, attiva la tappa e...

    3) getRiddleFromAction(ida) // prende l'id dal campo riddle di actions
        generateRiddle(idr, 'it') // genera il riddle e lo invia                                                       

    4) if (checkRiddle(riddledata)) setSolved(ida) // se la soluzione corrisponde, aggiorna il campo solved
    5) riparte dal punto 1;
    */
}

router.get('/', (req, res) => {
  startTest();
  res.status(200).send();
});

module.exports = router;
