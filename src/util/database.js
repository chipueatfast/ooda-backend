import tables from '~/db/index';

export const getRowBySingleValueAsync = (tableName, prop, value) => {
    return tables()[tableName].findOne({
        where: {
            [prop]: value,
        },
    })

};

export const getSingleRowAsync = (tableName, filter) => {
    return tables()[tableName].findOne({
        where: filter,
    })
}

export const createSingleRowAsync = async (tableName, rowData, duplicateCondition) => {
    if (!!duplicateCondition && await tables()[tableName].findOne({
        where: duplicateCondition,
    })) {
        return ({
            error: {
                statusCode: 400,
                message: 'Duplicated entity',
            }});
    }
    return tables()[tableName].create(rowData)
}
