module.exports = {
    saveOrUpdate
};

function saveOrUpdate(values, options, model) {
    return model
        .findOne(options)
        .then((obj) => {
            if (obj) { // update
                return obj.update(values)
                    .then(data => {
                        return {
                            action: 'update',
                            data: data
                        };
                    });
            } else { // insert
                return model.create(values)
                    .then(data => {
                        return {
                            action: 'insert',
                            data: data
                        };
                    });
            }
        });
}