let get_numerical_indexes = function(number_of_items, index_size){

    let number_of_indexes = Math.ceil(number_of_items / index_size)
    let indexes_array = []

    for(let i = 1; i < number_of_indexes + 1; i++){

        indexes_array.push(i)
    }

    return indexes_array
}

module.exports = {get_numerical_indexes}