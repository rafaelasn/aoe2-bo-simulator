const entityUtils = {
    isVil: (entity) => {
        return (entity.constructor.name == "Vil")
    }
}

module.exports = {entityUtils}