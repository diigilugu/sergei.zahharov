let personalDetails = (function (fadingOverlay) {

    let comboBoxes = 'table.horizontal-data select';
    let formSubmitButton = '#form-submit';
    let hiddenComboBoxes = '.ui-combobox';
    let changeableFields = 'table.horizontal-data input, table.horizontal-data textarea';
    let saveConfirmDialog = '#save-confirmation-dialog';
    let saveSuccessDialog = '#generic-success-dialog';
    let saveFailureDialog = '#generic-failure-dialog';
    let form = '#mainForm';
    let addContactPersonButton = '#addContactPerson';
    let removalButtons = '.field-remove';
    let contactPersonList = '#contactPersonList';

    let somethingChanged = false;

    let saveUrl = PP.CONTEXT_ROOT + '/person/details/save';
    let validateUrl = PP.CONTEXT_ROOT + '/person/details/validate';

    let mode = "";
    let respErr = "";

    function saveSuccessful() {
        return $(saveSuccessDialog).length > 0;
    }

    function saveFailed() {
        return $(saveFailureDialog).length > 0;
    }

    function setupSuccessDialog() {
        setTimeout(
            function () {
                window.location.href = PP.CONTEXT_ROOT;
            },
            3000);
    }

    function setupFailureDialog() {
        let dialog = $(saveFailureDialog);
        dialog.find('.ok-button').click(backToEdit);
    }

    function setupComboboxes() {
        $(comboBoxes).combobox({
            menuOpened: function () {
                fadingOverlay.fade(0.1, 'black');
            },
            menuClosed: function () {
                fadingOverlay.restore();
            }
        });
    }

    function updateFieldAttribute(params) {
        let idValue = params.attrValuePrefix;
        let attrName = params.attrName;
        let field = params.field;

        if (field.attr(attrName)) {
            idValue += '.';
            idValue += field.attr(attrName);
        }

        field.attr(attrName, idValue);
    }

    function setupAdditionButtonForBlock(params) {
        $(params.button).click(function () {
            somethingChanged = true;

            let newBlock = params.template.clone();
            let newBlockIdx = $(params.blockList + ' > li').length;

            newBlock.find('input, select').each(function (index, field) {
                let $field = $(field);

                updateFieldAttribute({
                    field: $field,
                    attrName: 'id',
                    attrValuePrefix: params.fieldNamePrefix + newBlockIdx
                });
                updateFieldAttribute({
                    field: $field,
                    attrName: 'name',
                    attrValuePrefix: params.fieldNamePrefix + '[' + newBlockIdx + ']'
                });

                $field.val('');
            });

            let $newBlock = $(newBlock);
            $newBlock.hide();
            $(params.blockList).append(newBlock);
            $newBlock.slideDown(300);

            newBlock.find(hiddenComboBoxes).remove();
            setupComboboxes();
            setupRemovalButtons();

            return false;
        });
    }

    function setupAdditionButtons() {
        if (mode === "edit") {
            setupAdditionButtonForBlock({
                button: addContactPersonButton,
                blockList: contactPersonList,
                template: ich.contactPersonBlock(),
                fieldNamePrefix: 'contactPersons'
            });

        }
    }

    function setupRemovalButtons() {
        if (mode === "edit") {
            $(removalButtons).each(function (index, button) {
                $(button).click(function () {
                    somethingChanged = true;

                    let $block = $(button).closest('li');
                    $block.slideUp(300, function () {
                        $block.remove();
                    });

                    return false;
                });
            });
        }
    }

    function setupValidateButton() {
        if (mode === "edit" && respErr !== "true") {
            let saveButton = $('#saveContactPerson');
            saveButton.click(function () {
                removeUnloadListener();
                $(form).attr('action', validateUrl);
                $(formSubmitButton).click();
            });
        }
    }

    function setupSaveConfirmDialog() {
        let dialog = $(saveConfirmDialog);

        let backToEditButton = dialog.find('.cancel-button');
        backToEditButton.click(function () {
            backToEdit(backToEditButton);
        });

        let confirmSaveButton = dialog.find('.ok-button');
        confirmSaveButton.click(function () {
            confirmSave(confirmSaveButton);
        });
    }

    function backToEdit(button) {
        $(button).addClass('pressed');

        $(saveConfirmDialog + ',' + saveFailureDialog).remove();

        setupValidateButton();
    }

    function confirmSave(button) {
        $(button).addClass('pressed');
        removeUnloadListener();

        $(form).attr('action', saveUrl);
        $(formSubmitButton).click();
    }

    function setupChangeListeners() {
        setTimeout(function () {
            $(changeableFields).each(function (index, field) {
                $(field).change(function () {
                    let $this = $(field);
                    if ($this.hasClass('ui-combobox-input')) {
                        $this = $this.parent();
                    }

                    $this.parent().parent().find('.edited-indicator').show();

                    somethingChanged = true;
                });
            });
        }, 1000); // timeout is needed since there are some address field
                  // inits that trigger change listeners
    }

    function setupUnloadListener() {
        window.onbeforeunload = function (e) {
            if (somethingChanged) {
                return messages.confirmLeave;
            }
        };
    }

    function removeUnloadListener() {
        window.onbeforeunload = null;
    }

    function removeTopPaddingIfFirstFieldIsEditable() {
        $('.subblock').each(function () {
            let fieldName = $(this).children(':first').children(':first');

            if (fieldName.hasClass('of-editable-field')) {
                fieldName.css('padding-top', 0);
            }
        });
    }

    return {
        setup: function (_config, _messages) {
            config = _config;
            messages = _messages;

            mode = config.mode;
            respErr = config.respErr;
            $(document).ready(function () {
                fadingOverlay.setup();

                setupComboboxes();
                setupAdditionButtons();
                setupRemovalButtons();
                setupChangeListeners();
                setupUnloadListener();
                removeTopPaddingIfFirstFieldIsEditable();

                if (saveSuccessful()) {
                    setupSuccessDialog();
                } else if (saveFailed()) {
                    setupFailureDialog();
                } else if (config.action === 'save') {
                    setupSaveConfirmDialog();
                } else {
                    setupValidateButton();
                }
            });
        }
    };

})(fadingOverlay);
