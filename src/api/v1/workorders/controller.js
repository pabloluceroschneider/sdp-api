const AbstractController = require('../abstract/AbstractController')
const WorkordersService = require('./services')

class WorkordersController extends AbstractController{
  constructor(service){
    super(service);
  }

  findTasks = async (req, res) => {
    try {
      const { id } = req.params;
      const tasks = await this.Service.findTasks({ id });
      res.send(tasks);
    } catch (error) {
      res.status(500).send(error)
    }
  }
  
  findByAssignedTo = async (req, res) => {
    try {
      const { assignedTo } = req.params;
      const workorders = await this.Service.findByAssignedTo({ assignedTo });
      res.send(workorders);
    } catch (error) {
      res.status(500).send(error)
    }
  }

}

module.exports = new WorkordersController(WorkordersService);