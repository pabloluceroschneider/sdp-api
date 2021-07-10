const AbstractController = require('../abstract/AbstractController')
const TasksServices = require('./services')

class TasksController extends AbstractController{
  constructor(service){
    super(service);
  }

  setPriority = async (req, res) => {
    try {
      const { body: tasks } = req;
      const response = await this.Service.setPriority({ tasks });
      res.send(response)
    } catch (error) {
      res.status(500).send(error)
    }
  }

}

module.exports = new TasksController(TasksServices);