var passport = require('passport');
var express = require('express');
var clone = require('clone');
var IdmCore = require('agile-idm-core');
var bodyParser = require('body-parser');
var ids = require('../../lib/util/id');
var createError = require('http-errors');

var idmcore;

function RouterApi(tokenConf, idmcore, router) {

    //example to call tthis one
    // curl -H "Authorization: bearer nNGNryDDZ4zQYeWYGYcnOdxJ90k9s6" 'http://localhost:3000/api/v1/entity/user/bob!@!agile-local'
    //returns entity with 200 if OK, else, it can return 404 if the entity is not found, 401 or 403 in case of security errors or 500 in case of unexpected situations
    router.route('/pap/:entity_type/:entity_id').get(
        passport.authenticate('agile-bearer', {
            session: false
        }),
        function (req, res) {
            var entity_type = "/" + req.params.entity_type;
            var entity_id = req.params.entity_id;
            idmcore.getEntityPolicies(req.user, entity_id, entity_type).then(function(policyResult) {
                return policyResult;
            }).then(function(policies) {
                    res.json(policies);
                }).catch(function (error) {
                res.statusCode = error.statusCode || 500;
                res.json({
                    "error": error.message
                });
            });
        }
    );


    router.route('/pap/:entity_type/:entity_id/policy/:policy_name').put(
        passport.authenticate('agile-bearer', {
            session: false
        }),
        bodyParser.json(),
        function (req, res) {
            var entity = req.body;
            var entity_type = "/" + req.params.entity_type;
            var entity_id = req.params.entity_id;
            if (!req.body.value) {
                res.statusCode = 400;
                res.json({
                    "error": "provide value in the body"
                });
            } else {
                var policy_name = req.params.policy_name;
                var policy = {};
                policy[policy_name] = [];
                policy[policy_name].push({target: req.body.value.target}); //TODO policy_name/self/FLOWS? --> Ask Daniel Schreckling ds@sec.uni-passau.de
                policy[policy_name].push({source: req.body.value.source});
                idmcore.setEntityPolicy(req.user, entity_id, entity_type, policy_name, req.body.value)
                    .then(function (entity) {
                        res.json(entity);
                    }).catch(function (error) {
                    console.log("error when setting entity policy " + error);
                    res.statusCode = error.statusCode || 500;
                    res.json({
                        "error": error.message
                    });
                });
            }

        }
    );

    //returns 200 and the entity, or 401 or 403, in case of security issues, 422 in case a user is attempted to be created through this API, or 409 if entity already exists, 500 in case of unexpected situations
    //curl -H "Content-type: application/json" -H "Authorization: bearer HeTxINCpXD0U6g27D7AIxc2CvfFNaZ" -X DELETE 'http://localhost:3000/api/v1/entity/sensor/1/attribute/name'
    router.route('/pap/:entity_type/:entity_id/policy/:policy_name').delete(
        passport.authenticate('agile-bearer', {
            session: false
        }),
        bodyParser.json(),
        function (req, res) {
            var entity_type = "/" + req.params.entity_type;
            var entity_id = req.params.entity_id;
            var policy_name = req.params.policy_name;

          /* TODO: implement delete Entity Policy in agile-idm-core api
           // check if policy is an attribute_level_policy
           idmcore.deleteEntityPolicy(req.user, entity_id, entity_type, policy_name)
           .then(function (read) {
           res.json(read);
           }).catch(function (error) {
           console.log("error when updating  entity attribute " + error);
           res.statusCode = error.statusCode || 500;
           res.json({
           "error": error.message
           });
           }); */

        }
    );


}
module.exports = RouterApi;