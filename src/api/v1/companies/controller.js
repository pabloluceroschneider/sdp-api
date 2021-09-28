const AbstractController = require('../abstract/AbstractController');
const CompanyService = require('./services');

class CompanyController extends AbstractController {
	constructor(service) {
		super(service);
	}
	findcompanies = async (req, res) => {
		try {
			const items = await this.Service.findcompanies();
			res.status(200).send(items);
		} catch (error) {
			res.status(500).send(`${error}`);
		}
  }
}

module.exports = new CompanyController(CompanyService);
