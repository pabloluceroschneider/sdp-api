const userService = require('../users/services');
const configurationsService = require('../app_configurations/services');
const companiesService = require('../companies/services');
const baseplansService = require('../baseplans/services');
const productsService = require('../products/services');

class Auth {
	login = async (req, res, next) => {
		try {
			const logged_users = await userService.findByAttribute({
				attribute: 'username',
				value: req.body.username
			});

			if (!logged_users) {
				res.status(400).send('User not found.');
			}
			const [ user ] = logged_users;
			const auth = user.password === req.body.password;
			
			const user_permissions = user.permissions;

			// configurations
			const { permissions, status } = await configurationsService.findOne();
			const users = await userService.find();
			const companies = await companiesService.find();
			const baseplans = await baseplansService.find();
			const products = await productsService.find();

			const response = {
				user_permissions,
				status,
				permissions,
				users,
				companies,
				baseplans,
				products,
			};

			auth ? res.json(response) : res.status(400).send('Password incorrect.');
		} catch (error) {
			res.send(error);
		}
	};
}

module.exports = new Auth();
