/**
 * @description Create a guidance panel with the instructions.
 * @param {Array} guidance Informations about guidances and instructions.
 * @param {Object} [markersFactory] Optional parameter with the data needed to render markers.
 * @param {Object} markersFactory.map Used map.
 * @param {Array} markersFactory.coordinates POI coordinates.
 * Usage:
 * - create div element with class 'guidance-panel' to append guidance panel
 * - create div element with class 'unit-button' to change distance unit
 */

var guidancePanel = (function() {
    var maneuver = {
        'ARRIVE': '-arrive',
        'BEAR_LEFT': '-bear-left',
        'BEAR_RIGHT': '-bear-right',
        'DEPART': '-start -black',
        'ENTER_MOTORWAY': '-motorway',
        'FOLLOW': '-continue',
        'KEEP_LEFT': '-keep-left',
        'KEEP_RIGHT': '-keep-right',
        'ROUNDABOUT_CROSS': {
            1: '-roundabout-left1',
            2: '-roundabout-left',
            3: '-roundabout-left3'
        },
        'ROUNDABOUT_LEFT': {
            1: '-roundabout-left1',
            2: '-roundabout-left',
            3: '-roundabout-left3'
        },
        'ROUNDABOUT_RIGHT': {
            1: '-roundabout-right1',
            2: '-roundabout-right'
        },
        'STRAIGHT': '-continue',
        'TAKE_EXIT': '-continue',
        'TURN_LEFT': '-turn-left',
        'TURN_RIGHT': '-turn-right'
    };
    var selectedUnit = 'metric';
    var instructionsData = {};
    var instructionDistances = [];
    var guidanceMarkers = {};

    var unitButtonsElements = document.querySelectorAll('.unit-button');

    var map, coordinates;

    return function(guidance, markersFactory) {
        if (markersFactory) {
            map = markersFactory.map;
            coordinates = markersFactory.coordinates;
        }
        var instructionsWrapper = document.createElement('div');
        var instructionsContent = document.createElement('div');
        var instructionsHeader = document.createElement('div');

        // instructionsContent.classList.add('guidance-panel-scroll')
        // let parentElement = document.querySelector('.guidance-panel');
        let parentElement1 = document.querySelector('.guidance-panel1');
        // console.log(parentElement)
        console.log(parentElement1)
        console.log(guidance)
        
        instructionsHeader.classList.add('summary-header');
        instructionsHeader.innerText = 'Instructions';
        instructionsContent.appendChild(instructionsHeader);
        guidance.instructionGroups.forEach(function(group, index) {
            var resultItem = document.createElement('li');
            var firstIndex = group.firstInstructionIndex;
            var lastIndex = group.lastInstructionIndex;

            console.log(index)
            console.log(group)


            instructionsData[index] = createGroupedIndexes(firstIndex, lastIndex);
            resultItem.classList = 'tt-results-list__item';
            resultItem.innerHTML = createInstructionsGroupHTML(index);
            instructionsWrapper.appendChild(resultItem);

        });
        instructionsContent.appendChild(instructionsWrapper);
        // parentElement.appendChild(instructionsContent);
        parentElement1.appendChild(instructionsContent);
        console.log(instructionsContent)
       
      

        //InstructionGroup HTML
        function createInstructionsGroupHTML(groupIndex) {
            var instructionsListData = guidance.instructions.slice(instructionsData[groupIndex][0],
                instructionsData[groupIndex][instructionsData[groupIndex].length - 1] + 1);
            var instruction = guidance.instructionGroups[groupIndex];
            console.log(groupIndex)
            console.log(instructionsListData)

            return (
                '<div class="instructions-header-' + groupIndex + ' with-distance">' +
                    '<div class="instruction-wrapper">' +
                        '<div class="icon-wrapper">' +
                            '<div class="tt-icon -arrow"></div>' +
                        '</div>' +
                        '<div>' + createValidHTML(instruction.groupMessage) + '</div>' +
                    '</div>' +
                    createDistanceWrapper(instruction.groupLengthInMeters) +
                '</div>' +
                createInstructionsList(instructionsListData, groupIndex)
            );
        }

        //Creating InstructionList
        function createInstructionsList(instructions, groupIndex) {
            console.log(instructions)
            return (
                '<div class="instructions-list-' + groupIndex + ' not-visible">' +
                    createSingleInstruction(instructions, groupIndex) +
                '</div>'
            );
        }

    //creating Single Instructions
        function createSingleInstruction(instructions, groupIndex) {
            let instructionOverlayHTML = '<div class="instructions-overlay">';

            instructions.forEach(function(instruction, index) {
                var instructionNumber = instructionsData[groupIndex][index];
                var length = instructions[index + 1] ?
                    instructions[index + 1].routeOffsetInMeters - instruction.routeOffsetInMeters : 0;

                instructionOverlayHTML +=
                '<div class="instruction ' +
                    (length ? 'with-distance' : '') + '" data-number="' + instructionNumber + '">' +
                    //creating instruction warapper. In our css file(index.css), at line 3091, I've flex-direction
                    //the div's content row.
                    '<div class="instruction-wrapper">' +
                        '<div class="icon-wrapper">' +
                            '<div class="tt-icon ' + (selectRightIcon(instruction) || '') + '"></div>' +
                        '</div>' +
                        '<div class="message-wrapper">' +
                            createValidHTML(instruction.message) +
                        '</div>' +
                    '</div>' +
                    (length ? createDistanceWrapper(length, '-instruction') : '') +
                '</div>';
                if (markersFactory) 
                {
                    guidanceMarkers[instructionNumber] =
                        new tt.Marker({ element: createMarkerElement('instruction', String(instructionNumber)) })
                            .setLngLat([instruction.point.longitude, instruction.point.latitude])
                            .setPopup(new tt.Popup({ offset: 20 })
                                .setHTML(createPopupHTML(createValidHTML(instruction.message))));
                }
            });
            instructionOverlayHTML += '</div>';
            return instructionOverlayHTML;
        }

        function createMarkerElement(type, index) {
            var element = document.createElement('div');
            var innerElement = document.createElement('div');

            element.className = type === 'instruction' ?
                'guidance-marker-' + (index || '') :
                'supporting-marker';
            innerElement.className = 'tt-icon -white -' + type;
            element.appendChild(innerElement);
            return element;
        }

        function createPopupHTML(message) {
            return (
                '<div class="popup-content">' +
                    message +
                '</div>'
            );
        }

        function selectRightIcon(instruction) {
            if (instruction.junctionType === 'ROUNDABOUT' && instruction.roundaboutExitNumber !== 0) {
                return maneuver[instruction.maneuver][instruction.roundaboutExitNumber];
            }
            return maneuver[instruction.maneuver];
        }

        // function createValidHTML(string) {
        //     return string.replace(/<([^/].*?)(?=>)(.*?)<\/(.*?)(?=>)/g, '<span class="$1"$2</span');
        // }
        function createValidHTML(string) {
            return string.replace(/<([^/][^>]*)(?=>)([^>]*)<\/([^>]+)(?=>)/g, '<span class="$1">$2</span>');
        }
        

        function createDistanceWrapper(length, modifier) {
            var instructionDistanceData = {
                length: length,
                modifier: modifier || ''
            };

            instructionDistances.push(instructionDistanceData);
            return (
                '<div class="distance-wrapper ' + (modifier || '') + '">' +
                    getFormattedDistance(length) +
                '</div>'
            );
        }

        function getFormattedDistance(length) {
            return selectedUnit === 'metric' ?
                Formatters.formatAsMetricDistance(length) :
                Formatters.formatAsImperialDistance(length);
        }

        function createGroupedIndexes(firstIndex, lastIndex) {
            var array = [];

            for (var i = firstIndex; i < lastIndex + 1; i++) {
                array.push(i);
            }
            return array;
        }

        // markers and popup
        function handleGroupHeaderHover(type, event) {
            var groupIndex = event.target.classList[0].slice(-1);

            instructionsData[groupIndex].forEach(function(group) {
                if (type === 'enter') {
                    guidanceMarkers[group].addTo(map);
                }
                if (type === 'leave') {
                    guidanceMarkers[group].remove();
                }
            });
        }


        /* Handle Instruction Click, we hide the general panel and all other components
         on the map div to show the only the click div either at the top or bottom of the screen.
        on it there is a cloce or move back button where we click to send us back to the 
        general panel div and all other neccessary div hidden divs must also display */
        function handleInstructionClick(position, index) {
            const generalGuidancePanel = document.querySelector('#instruction-tab');
            const sidePanelSearch = document.querySelector('#search');
            generalGuidancePanel.classList.toggle('active')
            sidePanelSearch.classList.toggle('active')

            
            const onclickedDivVisible = document.querySelector('.click-popup-div')
            onclickedDivVisible.classList.toggle('active-click')
            const onclickedDiv = document.querySelector('.click-popup-div .onclicked')
            onclickedDiv.innerText = createValidHTML(guidance.instructions[index].message)
            // console.log(createValidHTML(guidance.instructions[index].message))
            map.flyTo({ center: [position.longitude, position.latitude], duration: 500 }); 
            console.log(position) 
        }

        function handleInstructionHover(type, event) {
            var selectedInstructionIndex = event.target.getAttribute('data-number');
            var selectedInstructionMarker = guidanceMarkers[selectedInstructionIndex];
 
            if (type === 'enter') {
                selectedInstructionMarker.addTo(map);
                selectedInstructionMarker.togglePopup();
            }
            if (type === 'leave') {
                selectedInstructionMarker.remove();
            }
        }

        // events binding
        GuidancePanel.prototype.bindEvents = function() {
            [].slice.call(document.querySelectorAll('[class^="instructions-header-"]')).forEach(function(group, index) {
                group.addEventListener('click', handleGroupHeaderClick.bind(null, index));
                if (markersFactory) {
                    group.addEventListener('mouseenter', handleGroupHeaderHover.bind(null, 'enter'));
                    group.addEventListener('mouseleave', handleGroupHeaderHover.bind(null, 'leave'));
                }
            });
            if (markersFactory) {
                [].slice.call(document.querySelectorAll('.instruction')).forEach(function(instruction, index) {
                    instruction.addEventListener('click',
                        handleInstructionClick.bind(null, guidance.instructions[index].point, index));
                        console.log(guidance.instructions[index].point)
                    instruction.addEventListener('mouseenter', handleInstructionHover.bind(null, 'enter'));
                    instruction.addEventListener('mouseleave', handleInstructionHover.bind(null, 'leave'));
                });
            }
            [].slice.call(unitButtonsElements)
                .forEach(function(button) {
                    button.addEventListener('click', handleUnitChange);
                });
        };

        function handleGroupHeaderClick(index) {
            var selectedGroupClassList = document.querySelector('.instructions-list-' + index).classList;

            handleGroupIconPositionChange(index);
            selectedGroupClassList.toggle('not-visible');
            if (markersFactory) {
                var bounds = new tt.LngLatBounds();

                if (selectedGroupClassList.contains('not-visible')) {
                    coordinates.forEach(function(point) {
                        bounds.extend(tt.LngLat.convert(point));
                    });
                } else {
                    instructionsData[index].forEach(function(number) {
                        bounds.extend(guidanceMarkers[number].getLngLat());
                    });
                }
                map.fitBounds(bounds, { duration: 500, padding: 150 });
            }
        }

        function handleGroupIconPositionChange(index) {
            var groupIconClassList = document.querySelector('.instructions-header-' + index)
                .querySelector('.tt-icon').classList;

            if (groupIconClassList.contains('-down')) {
                groupIconClassList.remove('-down');
            } else {
                groupIconClassList.add('-down');
            }
        }

        function handleUnitChange(event) {
            var distanceWrapperElements = [].slice.call(document.querySelectorAll('.distance-wrapper'));
            var selectedUnitButton = event.target;

            [].slice.call(unitButtonsElements)
                .forEach(function(button) {
                    button.classList.remove('-checked');
                });
            selectedUnitButton.classList.add('-checked');
            selectedUnit = selectedUnitButton.dataset.unit;

            distanceWrapperElements
                .forEach(function(element, index) {
                    var parentElement = element.parentNode;

                    parentElement.removeChild(element);
                    parentElement.appendChild(createInstructionDistanceElement(index));
                });
        }

        function createInstructionDistanceElement(index) {
            var length = instructionDistances[index].length;

            return DomHelpers.elementFactory('div',
                'distance-wrapper ' + instructionDistances[index].modifier,
                getFormattedDistance(length)
            );
        }
    };
})();

window.GuidancePanel = window.GuidancePanel || guidancePanel;
