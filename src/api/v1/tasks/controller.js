const AbstractController = require('../abstract/AbstractController')
const TasksServices = require('./services')

class TasksController extends AbstractController{
  constructor(service){
    super(service);
  }

  findTasks = async (req, res) => {
    try {
      const response = await this.Service.findTasks();
      res.send(response)
    } catch (error) {
      res.status(500).send(error)
    }
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

  record = async (req, res) => {
    try {
      const { name } = req.params;
      const response = await this.Service.record({ name });
      res.send(response)
    } catch (error) {
      res.status(500).send(error)
    }
  }

  updateTask = async (req, res) => {
    try {
      const { body } = req;
      const { id } = req.params;
      const { offline, accumulateDone } = req.query;
      const response = await this.Service.updateTask({ id, body, offline, accumulateDone });
      res.send(response);
    } catch (error) {
      res.status(500).send(error)
    }
  }

  upsert = async (req, res) => {
    try {
      const { body: tasks } = req;
      const { id } = req.params;
      const response = await this.Service.upsert({ id, tasks });
      res.send(response)
    } catch (error) {
      res.status(500).send(error)
    }
  }

}

module.exports = new TasksController(TasksServices);