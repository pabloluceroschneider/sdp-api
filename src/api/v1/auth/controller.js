const userService = require('../users/services');

class Auth {
	login = async (req, res, next) => {
		try {
			const users = await userService.findByAttribute({
				attribute: 'username',
				value: req.body.username
			});

			if (!users) {
				res.status(400).send('User not found.');
			}
			const [ user ] = users;
			const auth = user.password === req.body.password;

			auth ? res.json([ ...user.permissions ]) : res.status(400).send('Password incorrect.');
		} catch (error) {
			res.send(error);
		}
	};
}

module.exports = new Auth();
