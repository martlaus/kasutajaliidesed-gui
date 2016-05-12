define([
    'angularAMD',
    'directives/taxonSelector/taxonSelector',
    'directives/targetGroupSelector/targetGroupSelector',
    'services/searchService',
    'services/translationService',
    'services/metadataService'
], function(angularAMD) {
    angularAMD.directive('dopDetailedSearch', ['$location', 'searchService', 'translationService', '$filter', 'serverCallService', 'metadataService', '$rootScope', function($location, searchService, translationService, $filter, serverCallService, metadataService, $rootScope) {
        return {
            scope: {
                queryIn: '=',
                queryOut: '=',
                mainField: '=',
                searchCallback: '&',
                accessor: '='
            },
            templateUrl: 'directives/detailedSearch/detailedSearch.html',
            controller: ["$scope", "$rootScope", function($scope, $rootScope) {

                var BASIC_EDUCATION_ID = 2;
                var SECONDARY_EDUCATION_ID = 3;
                var VOCATIONAL_EDUCATION_ID = 4;

                var taxon;

                init();

                function init() {
                    // Detailed search fields
                    $scope.detailedSearch = {};

                    // Languages
                    metadataService.loadLanguages(setLanguages);
                    $scope.detailedSearch.language = searchService.getLanguage();

                    // Target groups
                    $scope.detailedSearch.targetGroups = searchService.getTargetGroups();

                    // Paid
                    var isPaid = searchService.isPaid();
                    if (isPaid === true  || isPaid === false) {
                        $scope.detailedSearch.paid = !isPaid;
                    } else {
                        $scope.detailedSearch.paid = false;
                    }

                    // Type
                    $scope.detailedSearch.type = 'all';
                    if (searchService.getType() && searchService.isValidType(searchService.getType())) {
                        $scope.detailedSearch.type = searchService.getType();
                    }

                    // Curriculum literature
                    if (searchService.isCurriculumLiterature()) {
                        $scope.detailedSearch.onlyCurriculumLiterature = true;
                    }

                    // Special education
                    var isSpecialEducation = searchService.isSpecialEducation();
                    if (isSpecialEducation === true || isSpecialEducation === false) {
                        $scope.detailedSearch.specialEducation = isSpecialEducation;
                    } else {
                        $scope.detailedSearch.specialEducation = false;
                    }

                    // Issue date
                    $scope.issueDateFirstYear = 2009;
                    $scope.issueDateLastYear = new Date().getFullYear();
                    var issuedFrom = searchService.getIssuedFrom();
                    if (issuedFrom && issuedFrom >= $scope.issueDateFirstYear && issuedFrom <= $scope.issueDateLastYear) {
                        $scope.detailedSearch.issueDate = issuedFrom;
                    }

                    // Cross-curricular themes
                    metadataService.loadCrossCurricularThemes(setCrossCurricularThemes);
                    var crossCurricularTheme = searchService.getCrossCurricularTheme();
                    if (crossCurricularTheme) {
                        $scope.detailedSearch.crossCurricularTheme = crossCurricularTheme;
                    }

                    // Key competences
                    metadataService.loadKeyCompetences(setKeyCompetences);
                    var keyCompetence = searchService.getKeyCompetence();
                    if (keyCompetence) {
                        $scope.detailedSearch.keyCompetence = keyCompetence;
                    }

                    if ($rootScope.isEditPortfolioMode && $rootScope.savedPortfolio) {
                        setEditModePrefill();
                    } else {
                        // Taxon
                        if (searchService.getTaxon()) {
                            $rootScope.taxonParser.loadTaxonMap(setTaxonMap);
                        }
                    }
                }

                function setTaxonMap(taxonMap) {
                    $scope.detailedSearch.taxon = Object.create(taxonMap['t' + searchService.getTaxon()]);
                }

                $scope.search = $scope.accessor.search = function() {
                    searchService.setSearch(createSimpleSearchQuery());

                    addIsPaidToSearch();
                    addTypeToSearch();
                    addLanguageToSearch();
                    addTaxonToSearch();
                    addTargetGroupsToSearch();
                    addOnlyCurriculumLiteratureCheckboxToSearch();
                    addSpecialEducationCheckboxToSearch();
                    addIssueDateToSearch();
                    addCrossCurricularThemeToSearch();
                    addKeyCompetenceToSearch();

                    $scope.searchCallback();
                };

                function addIsPaidToSearch() {
                    searchService.setPaid(!$scope.detailedSearch.paid);
                }

                function addTypeToSearch() {
                    searchService.setType($scope.detailedSearch.type);
                }

                function addLanguageToSearch() {
                    searchService.setLanguage($scope.detailedSearch.language);
                }

                function addTaxonToSearch() {
                    if ($scope.detailedSearch.taxon) {
                        searchService.setTaxon($scope.detailedSearch.taxon.id);
                    } else {
                        searchService.setTaxon(null);
                    }
                }

                function addTargetGroupsToSearch() {
                    if ($scope.detailedSearch.targetGroups) {
                        searchService.setTargetGroups($scope.detailedSearch.targetGroups);
                    } else {
                        searchService.setTargetGroups(null);
                    }
                }

                function addOnlyCurriculumLiteratureCheckboxToSearch() {
                    if ($scope.detailedSearch.onlyCurriculumLiterature) {
                        searchService.setCurriculumLiterature(true);
                    } else {
                        searchService.setCurriculumLiterature(null);
                    }
                }

                function addSpecialEducationCheckboxToSearch() {
                    searchService.setIsSpecialEducation($scope.detailedSearch.specialEducation);
                }

                function addIssueDateToSearch() {
                    var effectiveIssueDate = $scope.getEffectiveIssueDate();
                    if (effectiveIssueDate) {
                        searchService.setIssuedFrom(effectiveIssueDate);
                    } else {
                        searchService.setIssuedFrom(null);
                    }
                }

                function addCrossCurricularThemeToSearch() {
                    if ($scope.detailedSearch.crossCurricularTheme) {
                        searchService.setCrossCurricularTheme($scope.detailedSearch.crossCurricularTheme);
                    } else {
                        searchService.setCrossCurricularTheme(null);
                    }
                }

                function addKeyCompetenceToSearch() {
                    if ($scope.detailedSearch.keyCompetence) {
                        searchService.setKeyCompetence($scope.detailedSearch.keyCompetence);
                    } else {
                        searchService.setKeyCompetence(null);
                    }
                }

                function getTextFieldsAsQuery() {
                    var query = '';

                    if ($scope.detailedSearch.title) {
                        query += 'title:' + addQuotesIfNecessary($scope.detailedSearch.title);
                    }
                    if ($scope.detailedSearch.combinedDescription) {
                        query += ' description:' + addQuotesIfNecessary($scope.detailedSearch.combinedDescription) + ' summary:' + addQuotesIfNecessary($scope.detailedSearch.combinedDescription);
                    }
                    if ($scope.detailedSearch.author) {
                        query += ' author:' + addQuotesIfNecessary($scope.detailedSearch.author);
                    }

                    return query.trim();
                }

                function getCheckboxesAsQuery() {
                    if ($scope.detailedSearch.CLIL === true && $scope.detailedSearch.educationalContext.id === 2) {
                        return 'LAK "Lõimitud aine- ja keeleõpe"';
                    }
                    if ($scope.detailedSearch.specialEducationalNeed === true && $scope.detailedSearch.educationalContext.id === 4) {
                        return 'HEV "Hariduslik erivajadus"';
                    }
                    return '';
                }

                function createSimpleSearchQuery() {
                    var query = '';
                    var textFields = getTextFieldsAsQuery();
                    var checkboxes = getCheckboxesAsQuery();

                    query = (textFields + ' ' + checkboxes).trim();

                    return query.trim();
                }

                function parseSimpleSearchQuery(query) {
                    $scope.detailedSearch.main = '';
                    $scope.detailedSearch.title = '';
                    $scope.detailedSearch.combinedDescription = '';
                    $scope.detailedSearch.author = '';

                    if (query) {
                        var titleRegex = /(^|\s)(title:([^\s\"]\S*)|title:\"(.*?)\"|title:)/g;
                        var descriptionRegex = /(^|\s)(description:([^\s\"]\S*)|description:\"(.*?)\"|description:|summary:([^\s\"]\S*)|summary:\"(.*?)\"|summary:)/g;
                        var authorRegex = /(^|\s)(author:([^\s\"]\S*)|author:\"(.*?)\"|author:)/g;
                        var clilRegex = /(^|\s)(LAK|"Lõimitud aine- ja keeleõpe")(?=\s|$)/g;
                        var specialEducationalNeedRegex = /(^|\s)(HEV|"Hariduslik erivajadus")(?=\s|$)/g;

                        var firstTitle;
                        var firstDescription;
                        var firstAuthor;
                        var main = query;

                        while (title = titleRegex.exec(query)) {
                            // Remove token from main query
                            main = main.replace(title[2], '');

                            if (!firstTitle) {
                                // Get token content
                                firstTitle = title[3] || title[4];
                            }
                        }

                        while (description = descriptionRegex.exec(query)) {
                            main = main.replace(description[2], '');
                            if (!firstDescription) {
                                firstDescription = description[3] || description[4] || description[5] || description[6];
                            }
                        }

                        while (author = authorRegex.exec(query)) {
                            main = main.replace(author[2], '');
                            if (!firstAuthor) {
                                firstAuthor = author[3] || author[4];
                            }
                        }

                        while (keyword = clilRegex.exec(query)) {
                            main = main.replace(keyword[2], '');
                            $scope.detailedSearch.CLIL = true;
                        }

                        while (keyword = specialEducationalNeedRegex.exec(query)) {
                            main = main.replace(keyword[2], '');
                            $scope.detailedSearch.specialEducationalNeed = true;
                        }

                        $scope.detailedSearch.main = removeExtraWhitespace(main).trim();
                        $scope.detailedSearch.title = firstTitle;
                        $scope.detailedSearch.combinedDescription = firstDescription;
                        $scope.detailedSearch.author = firstAuthor;

                        $scope.mainField = $scope.detailedSearch.main;
                    }
                }

                function removeExtraWhitespace(str) {
                    return str.replace(/\s{2,}/g, ' ');
                }

                function hasWhitespace(str) {
                    return /\s/g.test(str);
                }

                function addQuotesIfNecessary(str) {
                    return hasWhitespace(str) ? '"' + str + '"' : str;
                }

                $scope.$watch('queryIn', function(queryIn) {
                    parseSimpleSearchQuery(queryIn);
                }, true);

                $scope.$watchCollection('detailedSearch', function() {
                    $scope.queryOut = createSimpleSearchQuery();
                });

                $scope.getLanguageTranslationKey = function(languageCode) {
                    return 'LANGUAGE_' + languageCode.toUpperCase();
                };

                function clearHiddenFields() {
                    var educationalContext = $scope.detailedSearch.educationalContext;

                    // Only curriculum literature checkbox
                    if (!educationalContext ||
                        (educationalContext.id != BASIC_EDUCATION_ID &&
                            educationalContext.id != SECONDARY_EDUCATION_ID &&
                            educationalContext.id != VOCATIONAL_EDUCATION_ID)) {
                        $scope.detailedSearch.onlyCurriculumLiterature = false;
                    }

                    // Special education checkbox
                    if (!educationalContext || educationalContext.id != BASIC_EDUCATION_ID) {
                        $scope.detailedSearch.specialEducation = false;
                    }

                    // Cross-curricular themes and key competences
                    if (!educationalContext || (educationalContext.id != BASIC_EDUCATION_ID && educationalContext.id != SECONDARY_EDUCATION_ID)) {
                        $scope.detailedSearch.crossCurricularTheme = null;
                        $scope.detailedSearch.keyCompetence = null;
                    }

                    // Target groups
                    if (educationalContext && educationalContext.id === VOCATIONAL_EDUCATION_ID) {
                        $scope.detailedSearch.targetGroups = [];
                    }
                }

                $scope.clear = $scope.accessor.clear = function() {
                    $scope.detailedSearch = {
                        'paid': true,
                        'onlyCurriculumLiterature': false,
                        'CLIL': false,
                        'targetGroups': [],
                        'specialEducation': false,
                        'specialEducationalNeed': false,
                        'issueDate': $scope.issueDateFirstYear,
                        'type': 'all'
                    };

                    if ($rootScope.isEditPortfolioMode) {
                        $scope.detailedSearch.type = "material";
                    }
                };

                $scope.$watch('detailedSearch.taxon.id', function(newTaxon, oldTaxon) {
                    if (!$scope.detailedSearch.taxon)
                        $scope.detailedSearch.educationalContext = null;

                    if (newTaxon !== oldTaxon && $scope.detailedSearch.taxon) {
                        var taxon = Object.create($scope.detailedSearch.taxon);
                        $scope.detailedSearch.educationalContext = $rootScope.taxonUtils.getEducationalContext(taxon);
                        clearHiddenFields();
                    }
                }, true);

                $scope.getEffectiveIssueDate = function() {
                    if ($scope.detailedSearch.issueDate && $scope.detailedSearch.issueDate != $scope.issueDateFirstYear) {
                        return $scope.detailedSearch.issueDate;
                    }
                };

                $scope.$watch(function() {
                    return $rootScope.savedPortfolio
                }, function(newValue, oldValue) {
                    setEditModePrefill();
                }, false);

                function setLanguages(languages) {
                    $scope.languages = languages;
                }

                function setCrossCurricularThemes(crossCurricularThemes) {
                    $scope.crossCurricularThemes = crossCurricularThemes;
                }

                function setKeyCompetences(keyCompetences) {
                    $scope.keyCompetences = keyCompetences;
                }

                function setEditModePrefill() {
                    if ($rootScope.isEditPortfolioMode && $rootScope.savedPortfolio) {
                        try {
                            $scope.detailedSearch.taxon = Object.create($rootScope.savedPortfolio).taxon;
                            $scope.detailedSearch.targetGroups = Object.create($rootScope.savedPortfolio.targetGroups);
                        } catch (e) {}
                        $scope.detailedSearch.type = "material";
                    }
                }

            }]
        };
    }]);
});
