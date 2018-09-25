// object to hold users
const users = {};

// handles GET responses
const respondToGET = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// handles HEAD responses
const respondToHEAD = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// function to add a user from a POST body
const addUser = (request, response, body) => {
  // default json message
  const responseJSON = {
    message: 'Name and age are both required.',
  };

  // check for both params
  if (!body.name || !body.age) {
    responseJSON.id = 'missingParams';
    return respondToGET(request, response, 400, responseJSON);
  }

  // default status code to 201 created
  let responseCode = 201;

  // check if user already exists
  if (users[body.name]) {
    responseCode = 204;
  } else {
    // otherwise create an object with that name
    users[body.name] = {};
  }

  // add or update fields for this user name
  users[body.name].name = body.name;
  users[body.name].age = body.age;

  // if response is created, then set our created message
  // and sent response with a message
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondToGET(request, response, responseCode, responseJSON);
  }

  return respondToHEAD(request, response, responseCode);
};


// gets the list of users
const getUsers = (request, response, action) => {
  // checks if request method is HEAD
  if (action === 'HEAD') {
    return respondToHEAD(request, response, 200);
  }

  // creates response object
  const responseJSONObject = {
    users,
  };

  return respondToGET(request, response, 200, responseJSONObject);
};

const notReal = (request, response, action) => {
  if (action === 'HEAD') {
    return respondToHEAD(request, response, 404);
  }

  const responseJSONObject = {
    id: 'notFound',
    message: 'The resource you were looking for was not found',
  };

  return respondToGET(request, response, 404, responseJSONObject);
};


module.exports = {
  getUsers,
  notReal,
  addUser,
};
