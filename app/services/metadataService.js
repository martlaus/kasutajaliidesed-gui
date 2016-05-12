define([
    'angularAMD',
    'services/serverCallService'
], function(angularAMD) {
    var instance;

    var CROSS_CURRICULAR_THEMES;
    var KEY_COMPETENCES;
    var LANGUGAGES;
    var LICENSE_TYPES;
    var RESOURCE_TYPES;
    var EDUCATIONAL_CONTEXTS;

    var crossCurricularThemesCallbacks = [];
    var keyCompetencesCallbacks = [];
    var langugagesCallbacks = [];
    var licenseTypesCallbacks = [];
    var resourceTypesCallbacks = [];
    var educationalContextsCallbacks = [];

    angularAMD.factory('metadataService', ['serverCallService',
        function(serverCallService) {

            init();

            function init() {
            }

            function getCrossCurricularThemesSuccess(data) {
                if (isEmpty(data)) {
                    getCrossCurricularThemesFail();
                } else {
                    CROSS_CURRICULAR_THEMES = data;
                    crossCurricularThemesCallbacks.forEach(function(callback) {
                        callback(data);
                    });
                }
            }

            function getCrossCurricularThemesFail() {
                console.log('Failed to get cross curricular themes.')
            }

            function getKeyCompetencesSuccess(data) {
                if (isEmpty(data)) {
                    getKeyCompetencesFail();
                } else {
                    KEY_COMPETENCES = data;
                    keyCompetencesCallbacks.forEach(function(callback) {
                        callback(data);
                    });
                }
            }

            function getKeyCompetencesFail() {
                console.log('Failed to get key comptences.')
            }

            function getLanguagesSuccess(data) {
                if (isEmpty(data)) {
                    getLanguagesFail();
                } else {
                    LANGUGAGES = data;
                    langugagesCallbacks.forEach(function(callback) {
                        callback(data);
                    });
                }
            }

            function getLanguagesFail() {
                console.log('Failed to get languages.')
            }

            function getLicenseTypeSuccess(data) {
                if (!isEmpty(data)) {
                    LICENSE_TYPES = data;
                    licenseTypesCallbacks.forEach(function(callback) {
                        callback(data);
                    });
                }
            }

            function getLicenseTypeFail() {
                console.log('Failed to get license types.');
            }

            function getResourceTypeSuccess(data) {
                if (!isEmpty(data)) {
                    RESOURCE_TYPES = data;
                    resourceTypesCallbacks.forEach(function(callback) {
                        callback(data);
                    });
                }
            }

            function getResourceTypeFail() {
                console.log('Failed to get resource types.');
            }

            function getEducationalContextSuccess(data) {
                if (!isEmpty(data)) {
                    EDUCATIONAL_CONTEXTS = data;
                    educationalContextsCallbacks.forEach(function(callback) {
                        callback(data);
                    });
                }
            }

            function getEducationalContextFail() {
                console.log('Failed to get educational contexts.');
            }

            instance = {

                loadCrossCurricularThemes: function(callback) {
                    if (CROSS_CURRICULAR_THEMES) {
                        callback(CROSS_CURRICULAR_THEMES);
                    } else {
                        // Save callback, call it when data arrives
                        crossCurricularThemesCallbacks.push(callback);
                    }
                },

                loadKeyCompetences: function(callback) {
                    if (KEY_COMPETENCES) {
                        callback(KEY_COMPETENCES);
                    } else {
                        // Save callback, call it when data arrives
                        keyCompetencesCallbacks.push(callback);
                    }
                },

                loadLanguages: function(callback) {
                    if (LANGUGAGES) {
                        callback(LANGUGAGES);
                    } else {
                        // Save callback, call it when data arrives
                        langugagesCallbacks.push(callback);
                    }
                },

                loadLicenseTypes: function(callback) {
                    if (LICENSE_TYPES) {
                        callback(LICENSE_TYPES);
                    } else {
                        // Save callback, call it when data arrives
                        licenseTypesCallbacks.push(callback);
                    }
                },

                loadResourceTypes: function(callback) {
                    if (RESOURCE_TYPES) {
                        callback(RESOURCE_TYPES);
                    } else {
                        // Save callback, call it when data arrives
                        resourceTypesCallbacks.push(callback);
                    }
                },

                loadEducationalContexts: function(callback) {
                    if (EDUCATIONAL_CONTEXTS) {
                        callback(EDUCATIONAL_CONTEXTS);
                    } else {
                        // Save callback, call it when data arrives
                        educationalContextsCallbacks.push(callback);
                    }
                }
            };

            return instance;
        }
    ]);
});
