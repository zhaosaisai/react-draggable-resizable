export const propIsNumberAndGtSomeValue = (minValue) => (props, propName, componentName) => {
    if(typeof props[propName] !== 'number' || (minValue !== undefined && props[propName] <= minValue)) {
        return new Error(
            `Invalid prop ${propName} supplied to ${componentName}. Validation failed.`
        )
    }
}

export const valueMustBeInArray = (array) => (props, propName, componentName) => {
    if(array.indexOf(props[propName]) === -1) {
        return new Error(
            `Invalid prop ${propName} supplied to ${componentName}. Validation failed.`
        )
    }
}

export const valueIsStringOrNumberWithDefault = (typeArray) => (type, value) => (props, propName, componentName) => {
    const valueType = typeof props[propName]
    if(typeArray.indexOf(valueType) === -1 || (type === valueType && value !== props[propName])) {
        return new Error(
            `Invalid prop ${propName} supplied to ${componentName}. Validation failed.`
        )
    }
}