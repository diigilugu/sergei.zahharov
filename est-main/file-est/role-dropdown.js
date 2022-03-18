let roleDropdown = (function () {
    let GET_TRUSTORS_URL = PP.CONTEXT_ROOT + '/person/trustor/actionableRoles/getList';

    let myId;
    let myFullName;
    let onBehalfOfId;
    let onBehalfOfFullName;
    let iRepresentMyself;
    let isRepresentativeWorkerActive = false;

    let relationshipTypes;
    let hasFetchedTrustors = false;

    let header;
    let menu;
    let button;
    let loadingItem;

    function addDropdownItem(id, name, relation, isSelected) {
        loadingItem.before(ich.dropdownItem({
            id: id,
            name: name,
            relation: relationshipTypes[relation],
            itemClass: isSelected ? 'selected' : ''
        }));
    }

    function addSomRepresentativeDropdownItem(isSelected) {
        loadingItem.before(ich.somRepresentativeDropdownItem({
            itemClass: isSelected ? 'selected' : ''
        }));
    }

    function addHbRepresentativeDropdownItem(isSelected) {
        loadingItem.before(ich.hbRepresentativeDropdownItem({
            itemClass: isSelected ? 'selected' : ''
        }));
    }

    function setupDropdown() {
        button.click(function () {
            if (!hasFetchedTrustors) {
                fetchTrustors();
                hasFetchedTrustors = true;
            }
            if (menu.is(':visible')) {
                menu.fadeOut('fast');
            } else {
                menu.css('left', $(this).offset().left)
                    .fadeIn('fast');
            }
        });
    }

    function fetchTrustors() {
        $.get(GET_TRUSTORS_URL, function (data) {
            let list = data.list;

            if (list) {
                for (let i = 0; i < list.length; i++) {
                    let trustor = list[i];
                    addDropdownItem(trustor.id, trustor.fullName, trustor.relationshipTypeKey,
                        !isRepresentativeWorkerActive && trustor.id === onBehalfOfId);
                }
            }

            loadingItem.hide();
        });
    }

    $(document).ready(function () {
        $(window).bind('click', function (e) {
            // console.log($(menu).has(e.target).length);
            if ($(button).has(e.target).length === 0 && menu) {
                menu.hide();
            }
        });
    });

    function init() {
        header = $('.header');
        menu = header.find('.role-dropdown-container ul');
        button = header.find('.role-dropdown-container');
        loadingItem = header.find('.role-dropdown-container span.loading');
        hasFetchedTrustors = false;

        setupDropdown();
        addDropdownItem(myId, myFullName, 'SELF', iRepresentMyself);
        if (isSomWorker) {
            addSomRepresentativeDropdownItem(isRepresentativeWorkerActive);
        } else if (isHbWorker) {
            addHbRepresentativeDropdownItem(isRepresentativeWorkerActive);
        }
    }

    return {
        setup: function (args, relTypes) {
            myId = args.myId;
            myFullName = args.myFullName;
            onBehalfOfId = args.onBehalfOfId;
            onBehalfOfFullName = args.onBehalfOfFullName;
            iRepresentMyself = myId === onBehalfOfId;
            isSomWorker = args.isSomWorker;
            isHbWorker = args.isHbWorker;
            isRepresentativeWorkerActive = args.isRepresentativeWorkerActive;
            relationshipTypes = relTypes;

            $(window).ready(function () {
                init();
            });
        }
    };
})();
