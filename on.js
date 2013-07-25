define([], function() {
    var nodeRegistry = [];
    
    var getEventRegistryFor = function(node) {
        for (index in nodeRegistry) {
            if (nodeRegistry[index].node === node) {
                return nodeRegistry[index];
            }
        }
        return createEventRegistryFor(node);
    };
    
    var createEventRegistryFor = function(node) {
        var eventRegistry = {
            node: node,
            registry: [],
            add: function(eventName, callback) {
                var eventCallbacks = this.getCallbacksFor(eventName);
                eventCallbacks.push(callback);
                return {
                    remove: function() {
                        for (index in eventCallbacks) {
                            if (eventCallbacks[index] === callback) {
                                eventCallbacks.splice(index);
                            }
                        }
                        return callback;
                    }
                };
            },
            getCallbacksFor: function(eventName) {
                for (index in this.registry) {
                    if (this.registry[index].eventName === eventName) {
                        return this.registry[index].callbacks;
                    }
                }
                return this.registerEvent(eventName).callbacks;
            },
            registerEvent: function(eventName) {
                var entry = {
                    eventName: eventName,
                    callbacks: []
                };
                this.registry.push(entry);
                return entry;
            }
        };
        nodeRegistry.push(eventRegistry);
        return eventRegistry;
    };
    
    return function(node, eventName, callback) {
        node["on"+eventName] = function(e) {
            var callbacks = getEventRegistryFor(node).getCallbacksFor(eventName);
            for (index in callbacks) {
                callbacks[index](e);
            }
        };
        return getEventRegistryFor(node).add(eventName, callback);
    };
});