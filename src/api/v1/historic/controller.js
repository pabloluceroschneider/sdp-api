const AbstractController = require('../abstract/AbstractController');
const HistoryService = require('./services');

class HistoryController extends AbstractController {
	constructor(service) {
		super(service);
	}
	findByTask = async (req, res) => {
		try {
      const { taskId: id } = req.params;
			const items = await this.Service.findByTask({ id });
			res.status(200).send(items);
		} catch (error) {
			res.status(500).send(`${error}`);
		}
	};
}

module.exports = new HistoryController(HistoryService);
