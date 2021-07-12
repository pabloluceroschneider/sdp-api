const AbstractController = require('../abstract/AbstractController')
const ConfigurationsService = require('./services')

class ConfigurationsController extends AbstractController{
  constructor(service){
    super(service);
  }

  findOne = async (req, res) => {
    try {
      const options = await this.Service.findOne();
      res.send(options);
    } catch (error) {
      res.status(500).send(error)
    }
  }

}

module.exports = new ConfigurationsController(ConfigurationsService);