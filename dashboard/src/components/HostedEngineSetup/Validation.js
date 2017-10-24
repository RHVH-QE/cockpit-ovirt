const Validation = {
    ipAddress: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    macAddress: /^[0-9a-fA-F]{1,2}([\.:-])(?:[0-9a-fA-F]{1,2}\1){4}[0-9a-fA-F]{1,2}$/
};

export function validatePropsForUiStage(stage, model, errorMsgs) {
    let isValid = true;

    Object.getOwnPropertyNames(model).forEach(
        function(sectionName) {
            let section = model[sectionName];
            Object.getOwnPropertyNames(section).forEach(
                function(propName) {
                    let prop = section[propName];

                    if (prop.uiStage !== stage) {
                        return;
                    }

                    const errorMsg = getErrorMsgForProperty(prop);
                    if (errorMsg !== "") {
                        errorMsgs[propName] = errorMsg;
                        isValid = false;
                    }
                }, this)
        }, this);

    return isValid;
}

export function getErrorMsgForProperty(prop) {
    let errorMsg = "";

    if (isRequiredAndEmpty(prop)) {
        errorMsg = "Required field";
    } else if (requiresRegexValidation(prop)) {
        const isInvalidFormat = !prop.regex.test(prop.value);
        if (isInvalidFormat) {
            errorMsg = prop.hasOwnProperty("errorMsg") ? prop.errorMsg : "Invalid format";
        }
    } else if (requiresRangeValidation(prop)) {
        const value = parseInt(prop.value);
        const outOfRange = value < prop.range.min || value > prop.range.max;
        if (outOfRange) {
            let genericMsg = "Value must be between " + prop.range.min + " and " + prop.range.max;
            errorMsg = prop.hasOwnProperty("errorMsg") ? prop.errorMsg : genericMsg;
        }
    }

    return errorMsg;
}

function isRequiredAndEmpty(prop) {
    const propType = typeof prop.value;
    const isValidType = propType === 'string' || propType === 'number';
    const isEmpty = prop.value === "";
    const isRequired = prop.required;

    return isValidType && isEmpty && isRequired;
}

function requiresRegexValidation(prop) {
    return prop.value !== "" && prop.hasOwnProperty("regex")
}

function requiresRangeValidation(prop) {
    let value = parseInt(prop.value, 10);
    return !isNaN(value) && prop.hasOwnProperty("range");
}

export default Validation;