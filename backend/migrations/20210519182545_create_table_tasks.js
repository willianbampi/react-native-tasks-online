exports.up = function(knex, Promise) {
    return knex.schema.creatTable('tasks', table => {
        table.increments('id').primary()
        table.string('description').notNull()
        table.datetime('estimateAt')
        table.datetime('doneAt')
        table.integer('userId').references('id').inTable('users').notNull()
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('tasks')
}