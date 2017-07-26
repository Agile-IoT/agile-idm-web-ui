# Change Log

All notable changes to this project will be documented in this file
automatically by Versionist. DO NOT EDIT THIS FILE MANUALLY!
This project adheres to [Semantic Versioning](http://semver.org/).

## v1.0.5 - 2017-07-26

* Remove node modules to avoid issues with travis before building in the Docerfile [david]

## v1.0.4 - 2017-07-13

* Avoid building in the host which has side effects on docker build [david]

## v1.0.3 - 2017-07-13

* Travis: upgrading build template [Csaba Kiraly]

## v1.0.2 - 2017-07-13

# Functionality for v1.0.2


 * policy enforcement over nested attributes, i.e. credentials.dropbox
 * support for the  enforcement of strict json schema https://github.com/tdegrunt/jsonschema/issues/173
 * Dropbox authentication
 * change the console-based script to generate users and clients to use the API without enforcement to ensure that policies were created for every entity
 * hash users' passwords
 * endpoints to reset passwords for own and other users if admin
 * endpoints to fetch and write attribute's policies
 * initial mockup of pdp for actions in the AGILE API (for initial integration)
 * add endpoint to delete an attribute
 * add endpoint to list all users, and groups
 * fix non-deterministic behaviour during login (sometimes another user was chosen).

  * fix group issue reported in agile-idm-entity-storage: groups now can be deleted without removing entities first. Before there was an inconsistency when this was the case.

 * fix issue when the same user logs is with different clients: when the same user used different clients simultaneously, there was only one session valid.

 * fix to ensure that the client id is propagated to the provider strategies. This allows strategies to create tokens for a particular oauth2 flow and for a particular client, to ensure that there are no race conditions.

 * fix add expiration time, and deletion of tokens that expired (when they are queried). Also a general cleanup of the token db happens whenever tokens are iterated, so we keep only tokens that are valid.

 * fix session sync issue between passport and tokens stored in the db (this was generating an error when integrated with OS.js from which the only way to recover is to delete cookies from the browser)

# Functionality for v1.0.1 (Passport and LevelDB pre-release)


* Oauth Server functionality:
 * implements the authorization code authorization flow [see example here](https://github.com/Agile-IoT/agile-idm-oauth2-client-example)
 * implements the client credential authorization flow [see example here](https://github.com/Agile-IoT/agile-idm-examples/tree/master/client-credentials)
 * implements the implicit grant [see example here](https://github.com/Agile-IoT/agile-idm-examples/tree/master/implicit)

* Storage:
 * Proper handling of Oauth2 clients (through entities of type client)
 * Storage of tokens
 * Generic storage of entities in leveldb


* Policy Enforcement
 * Uses owner policies to handle visibility of private attributes, such as the user's password
 * Uses role policies (admin) to protect creation of new entities and setting of roles and passwords.