// A simple controller Based JAVSCRIPT framework by Alexander Think - MIT Licensed - ThinkAcademy.io
// version 1.5


var MasterControl = (function (window, undefined) {

    // keeps the list of controller that need to be called
    var $$controllerList = [];
    var $$methodList = [];
    var $$actionList = [];
    var $$DOMSnapShot = [];
    var $$DOMCurrentSnapShot = [];

    var _init = function (appName, func, refresh) {

        window.addEventListener('load', function (){

            //look for main app controller 
            var moduleName = "[fan-app='" + appName + "']";
            var module = document.querySelector(moduleName);

            // call the module method function
            func(module);

            // setup the DOM SnapShot
            _setupWatcher(module);
        });
    };

    var _setupWatcher = function(module){

            // select all controllers inside of the main app
            var controllerArray = module.querySelectorAll("[fan-controller]");

            // check that we find a controller declaration inside the app declaration
            if (controllerArray.length > 0) {

                // loop through all controllers found inside the main app
                for (var i = 0; i < controllerArray.length; i++) {

                        var controllerWatcher = _createSnapShot(controllerArray[i]);
                        // send the controller to watch
                        $$DOMSnapShot.push(controllerWatcher);

                        // wait for last loop to call digest html
                        if (i == controllerArray.length - 1) {
                            _digestSnapShot();
                        }
                }

            }
            else{
                // cannot find any controllers on page
                console && console.log("no controller found");
            }

    };

    var _createSnapShot = function(controllerArray){

            var controllerName = controllerArray.getAttribute("fan-controller");

            // create a controller engine 
            var controllerWatcher = {
                controllerName: controllerName,
                controllerScope: controllerArray, // scope is the html of the containing declaration
                actions : []
            };

            // find actions inside the controller declaration
            var actionArray = controllerArray.querySelectorAll("[fan-action]");

            if (actionArray.length > 0) {

                for (var r = 0; r < actionArray.length; r++) {

                    var actionName = actionArray[r].getAttribute("fan-action");

                        // create a action engine 
                        var actionWatcher = {
                            actionName: actionName,
                            actionScope: actionArray[r] // scope is the html of the containing declaration
                        }

                        // push to action array inside the controller watch
                        controllerWatcher.actions.push(actionWatcher);
                }

            }

            return controllerWatcher
    }

        // loops through watch array and calls every function
    var _digestSnapShot = function () {

        var controllerCalled = false;
        var actionCalled = false;

        // loop through all controllers html delcarations
        for (var i = 0; i < $$DOMSnapShot.length; i++) {
        
            // loop through all controller function declarations to find matches with DOMSNAPSHOT
            $$controllerList.forEach(function (callback, index) {

                // before we look for a match lets clean up the controller name
                var controllerNameSplit = callback.controllerName.split(":");
                var controllerName = controllerNameSplit[0];

                // only call the declarations that match
                if (controllerName === $$DOMSnapShot[i].controllerName) {

                    controllerCalled = true;

                    // add the call back function to DOMSnapShot for later use
                    $$DOMSnapShot[i].callback = callback;

                    // call the controller
                    //$$DOMSnapShot[i].callback.aFunction($$DOMSnapShot[i].controllerScope);
                    _call_controller(controllerName, $$DOMSnapShot[i].controllerScope);

                    //loop through html controller list
                    for (var p = 0; p < $$DOMSnapShot[i].actions.length; p++) {

                        var outerAction = $$DOMSnapShot[i].actions[p]

                        // loop through action function list
                        $$actionList.forEach(function (actionCallBack) {

                            if (actionCallBack.controllerName === $$DOMSnapShot[i].controllerName && actionCallBack.actionName === $$DOMSnapShot[i].actions[p].actionName) {
                                actionCalled = true;
                                // add call back to snapshot
                                $$DOMSnapShot[i].actions[p].callback = actionCallBack;
                                _call_action(actionCallBack.actionName, actionCallBack.controllerName, outerAction.actionScope);
                                //$$DOMSnapShot[i].actions[p].callback.aFunction(outerAction.actionScope);
                            }

                        });

                        // if action counter is 0 then it did not find action controller with html name
                        if (actionCalled === false) {
                            var errorMessage = "Error could not find any function action declaration with name " + $$DOMSnapShot[i].actions[p].actionName + " for controller " + $$DOMSnapShot[i].controllerName;
                            throw new Error(errorMessage);
                        }

                    }

                }

            });

            // if controller counter is 0 then it did not find function controller with html name
            if (controllerCalled === false) {
                var errorMessage = "Error could not find any function controller declaration with name " + $$DOMSnapShot[i].controllerName;
                throw new Error(errorMessage);
            }
        }

        //clear the array
        $$DOMCurrentSnapShot = $$DOMSnapShot;
        $$DOMSnapShot = [];
    };

    var _refreshDOM = function(scope){
        // build SnapShot of HTML 
        // compare new snapshot with current snapshot
        // if snap shot is dffrent then call controller

        if(scope){

               var controllerArray = scope.querySelectorAll("[fan-controller]");

               if (controllerArray.length > 0 && $$DOMCurrentSnapShot.length > 0) {

                    // inside loop check match with $$DOMCurrentSnapShot
                    for (var i = 0; i < controllerArray.length; i++) {

                        var newSnapShot = _createSnapShot(controllerArray[i]);
                        
                        // loop through current DOM snap shot
                        for (var p = 0; p < $$DOMCurrentSnapShot.length; p++) {

                                // if controller Array dont match then call
                            if(newSnapShot.controllerName !== $$DOMCurrentSnapShot[p].controllerName){
                                // call controller
                                _call_controller(newSnapShot.controllerName, controllerArray[i]);

                                // loop through new snapshot actions
                                for (var r = 0; r < newSnapShot.actions.length; r++) {
                                    var actionName = newSnapShot.actions[r].getAttribute("fan-action");
                                    _call_action(actionName, controllerName, newSnapShot.actions[r].actionScope);
                                }

                                $$DOMCurrentSnapShot.push(newSnapShot);


                            }

                        }

                    }
               }
               // if old dom is blank then nothing has been called then call everything
               else{
                                   // inside loop check match with $$DOMCurrentSnapShot
                    _setupWatcher(scope);

               }
        }else{
            var errorMessage = "Please provide scope for refresh function to work properly";
            throw new Error(errorMessage);
        }
    };

    var _call_controller = function (controllerName, scope) {
          

            if(controllerName){

                   var counter = 0;

                    // loop through all the controller that were loaded 
                    if ($$controllerList.length > 0) {
                        // call an anonymous function that has object
                        $$controllerList.forEach(function (callback) {
                            // only call the ones that we find in the DOM
                            if (callback.controllerName === controllerName) {
                                counter++
                                callback.aFunction(scope);
                            }
                        });

                        // if couter is 0 then it did not find controller for attribute
                        if (counter === 0) {
                            var errorMessage = "Error could not find controller with name " + controllerName;
                            return errorMessage;
                        }
                    }
                    else {
                        var errorMessage = "Error could not find any controller";
                        return errorMessage;
                    }
                }
    };

    var _call_action = function (actionName, controllerName, scope) {

            if(actionName && controllerName){

                var counter = 0;

                // loop through all the actions that were loaded 
                if ($$actionList.length > 0) {

                    for(var b = 0; $$actionList.length > b; b++){

                        var actionNameLowercase = $$actionList[b].actionName.toLowerCase();
                        var controllerNameLowercase = $$actionList[b].controllerName.toLowerCase();
                        var actionName = actionName.toLowerCase();
                        var controllerName = controllerName.toLowerCase();

                        if(actionNameLowercase === actionName){
                            // only call the ones that we find in the DOM
                            if (actionNameLowercase === actionName && controllerNameLowercase == controllerName) {
                                counter++
                                $$actionList[b].aFunction(scope);
                            }
                        }

                    }

                    // if couter is 0 then it did not find controller for attribute
                    if (counter === 0) {
                        var errorMessage = "Error could not find action with name " + actionName;
                        return errorMessage;
                    }
                }
                else {
                    var errorMessage = "Error could not find any action";
                    return errorMessage;
                }
            }
    };

    // return only the api that we want to use
    return {
            // will refresh DOM
            refresh:function(scope){
                _refreshDOM(scope);
            },

            // call controller using name
            callController : function(controllerName, scope){
                var returnController = _call_controller(controllerName, scope);
                return returnController;
            },

            // call action using name
            callAction : function(actionName, controllerName, scope){

                var returnAction = _call_action(actionName, controllerName, scope);
                return returnAction;
            },
            
            module : function(appName, func){
                // calling inner fucntion
                _init(appName, func, false);
                return this;
            },

            // this gets called by the declairation of the function on the page
            controller : function (controllerName, aFunction) {
                // this will push an object into array
                var object = {
                    controllerName: controllerName,
                    aFunction: aFunction
                }

                $$controllerList.push(object);
                return this;
            },

            // this gets called by the declairation of the function on the page
            action : function (controllerName, actionName, aFunction) {
                // this will push an object into array
                var object = {
                    controllerName: controllerName,
                    actionName: actionName,
                    aFunction: aFunction
                }

                $$actionList.push(object);
                return this;
            },

            // this will call any methods that we create
            callMethod : function (methodName, dataObject) {

                    var counter = 0;
                    var returnData;
                    // loop through all models that were loaded 
                    if ($$methodList.length > 0) {
                        // call an anonymous function that has object
                        $$methodList.forEach(function (callback) {
                            // only call the ones that we find in the DOM
                            if (callback.scopeName === methodName) {
                                counter++
                                returnData = callback.aFunction(dataObject);
                            }
                        });
                        // if couter is 0 then it did not find controller for attribute
                        if (counter === 0) {
                            var errorMessage = "Error could not find method with name - " + methodName;
                            throw new Error(errorMessage);
                        }
                    }
                    else {
                        var errorMessage = "Error could not find any method with name - " + methodName;
                        throw new Error(errorMessage);
                    }
                    return returnData;
                },

                // this gets called first to load all the Views
            method : function (scopeName, aFunction) {
                    // this will push the function on to an array
                    var object = {
                        scopeName: scopeName,
                        aFunction: aFunction
                    }

                    $$methodList.push(object);
                    return this;
                }

    }
})(window);

/********************************************************************************************************************************/
/************************************************ LOADING YOUR APPLICATION EXAMPLES *********************************************/
/********************************************************************************************************************************/

// load the Application
// var app = MasterControl();

// declare the Application
// app.module("nameofApp", function(scope){});

// declare Application in html
// fan-app="nameofapp"

// declare a Controller
// EXAMPLE:
// AdminApp.controller('name', function (action, scope) {});

// declare a Controller in HTML
// EXAMPLE:
// fan-controller='name'

// declare a Action
// EXAMPLE:
// AdminApp.action('controllerName', name', function (scope) {});

// declare a Action in HTML inside of controller
// EXAMPLE:
// fan-action='name'

// EXAMPLE: inside the controllers you can call call actions
// AdminApp.callMethod('name', data);

// declare a Mothod 
// EXAMPLE: 
// AdminApp.method('name', function ( data ) {});






