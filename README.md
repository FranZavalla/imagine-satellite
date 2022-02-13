# imagine-satellite-api

Backend API service that returns the live information of satellites
This project is for the Imagine Fellowships.

## Introduction
This API is composed of 3 points, the main endpoint that returns all the satellites in the database, an endpoint that allows searching for satellites by name, and finally an endpoint to search for satellites by distance to a point.

As an extra, a user system was added, which allows adding new satellites with a unique key for each user.

### Table of contents
- [Install](#install)
- [Testing](#testing)
- [Run](#run)
- [Routes protocol](#routes-protocol)
  * [Auth](#auth)
    + [/auth/register](#authregister)
    + [/auth/login](#authlogin)
  * [Satellites](#satellites)
    + [/satellites](#satellites)
    + [/satelliteByName](#satellitebyname)
    + [/satelliteByDistance](#satellitebydistance)


# Install

- ```npm install```

# Testing

- ```npm test```

# Run

- ```npm start```

# Routes protocol

## Auth

### /auth/register
* Method POST
* Create a new user 
* **Receives**: ```username, password``` in body request
* **Returns**:
  - On successful registration -> code 201, ```{ auth: true, key }```
  - On failed validation -> code 400, ```{ auth: false, msg: [errors] }```
  - If username already exist -> code 400, ```{ auth: false, msg: "Your username already exist" }```
  - On server error -> code 500, ```{ auth: false, msg: "There was a problem registering your user" }```

### /auth/login
* Method POST
* Log in user to get their key
* **Receives**: ```username, password``` in body request
* **Returns**:
  - On successful log in -> code 200, ```{ auth: true, key }```
  - On failed validation -> code 400, ```{ auth: false, msg: [errors] }```
  - If the user does not exist or the password is incorrect -> code 400, ```{ auth: false, msg: "Incorrect username or password" }```
  - On server error -> code 500, ```{ auth: false, msg: "There was a problem logging" }```


## Satellites

### /satellite
* Method POST
* Create a new satellite
* **Receives**: ```satellite``` in body request, ```key``` in query
* **Returns**:
  - On successful create -> code 201, ```{ created: true, msg: "Satellite created successfully" }```
  - On failed validation -> code 400, ```{ created: false, msg: [errors] }```
  - If the user does not exist -> code 404, ```{ created: false, msg: "User not found" }```
  - On server error -> code 500, ```{ created: false, msg: "There was a problem creating a satellite" }```
<br></br>
* Method GET
* Get all satellites
* **Returns**:
  - On successful action -> code 200, ```{ [satellite] }```
  - On empty list of satellites -> code 200, ```{ msg: "There are no satellites in the database yet" }```
  - On server errors -> code 500, ```{ msg: "There was a problem getting satellites" }```

### /satelliteByName
* Method GET
* Get a specific satellite according to its name
* **Receives**: ```name``` in query
* **Returns**:
  - On successful action -> code 200, ```{ satellite }```
  - On failed validation -> code 400, ```{ msg: [errors] }```
  - If the satellite does not exist -> code 400, ```{ msg: "Satellite 'name' not found" }```
  - On server errors -> code 500, ```{ msg: "There was a problem getting satellite" }```

### /satelliteByDistance
* Method GET
* Get all the satellites that are within a maximum distance **d** of **(l1,l2)**
* **Receives**: ```l1, l2, d``` in query
* **Returns**:
  - On successful action -> code 200, ```{ satellitesInDistance: [satellites] }```
  - On failed validation -> code 400, ```{ msg: [errors] }```
  - On empty list of satellites -> code 200, ```{ msg: There are no satellites within d km of (l1,l2) }```
  - On server error -> code 500, ```{ msg: "There was a problem getting satellites" }```
