export default {
    saveOrUpdate
};

function saveOrUpdate(values, options, model) {
    return model
        .findOne(options)
        .then(function(obj) {
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