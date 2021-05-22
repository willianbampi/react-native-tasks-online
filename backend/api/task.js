const moment = require('moment')

module.exports = app => {

    const getTasks = (request, response) => {
        const date = request.query.date ? request.query.date : moment().endOf('day').toDate()
        const userId = request.user.id
        
        if(userId) {
            app.db('tasks')
                .where({ userId: userId })
                .where('estimateAt', '<=', date)
                .orderBy('estimateAt')
                .then(tasks => response.json(tasks))
                .catch(error => response.status(500).json(error))
        } else {
            return response.status(400).send('Dados inválidos!')
        }
    }

    const save = (request, response) => {
        request.body.userId = request.user.id
        const description = request.body.description
        
        if(!description.trim()) {
            return response.status(400).send('A descrição é obrigatória!')
        }

        app.db('tasks')
            .insert(request.body)
            .then(_ => response.status(204).send())
            .catch(error => response.status(500).json(error))
    }

    const remove = (request, response) => {
        const id = request.params.id
        const userId = request.user.id
        
        if(id && userId) {
            app.db('tasks')
                .where({
                    id: id,
                    userId: userId
                })
                .del()
                .then(rowsDeleted => {
                    if(rowsDeleted > 0) {
                        response.status(204).send()
                    } else {
                        const message = `Não foi encontrada task com o id ${id}.`
                        response.status(400).send(message)
                    }
                })
                .catch(error => response.status(500).json(error))

        } else {
            return response.status(400).send('Dados inválidos!')
        }
    }

    const updateTaskDoneAt = (request, response, doneAt) => {
        const id = request.params.id
        const userId = request.user.id

        if(id && userId && doneAt) {
            app.db('tasks')
                .where({
                    id: id,
                    userId: userId
                })
                .update({ doneAt })
                .then(_ => response.status(204).send())
                .catch(error => response.status(500).json(error))
        } else {
            return response.status(400).send('Dados inválidos!')
        }
    }

    const toggleTask = (request, response) => {
        const id = request.params.id
        const userId = request.user.id

        if(id && userId) {
            app.db('tasks')
                .where({
                    id: id,
                    userId: userId
                })
                .first()
                .then(task => {
                    
                    if(!task) {
                        const message = `Task com id ${id} não foi localizada.`
                        return response.status(400).send(message)
                    }

                    const doneAt = task.doneAt ? null : new Date()

                    updateTaskDoneAt(request, response, doneAt)

                })
                .catch(error => response.status(500).json(error))
        } else {
            return response.status(400).send('Dados inválidos!')
        }
    }

    return {
        getTasks,
        save,
        remove,
        toggleTask
    }
}