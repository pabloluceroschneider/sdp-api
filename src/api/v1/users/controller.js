const AbstractController = require('../abstract/AbstractController')
const UsersService = require('./services')

class UsersController extends AbstractController{
  constructor(service){
    super(service);
  }

  findTasks = async (req, res) => {
    const { username } = req.params;
    const tasks = await this.Service.findTasks({username});
    res.send(tasks);
  }

}

module.exports = new UsersController(UsersService);