const userService = require('../users/services');

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

			const response = {
				me: user
			};

			auth ? res.json(response) : res.status(400).send('Password incorrect.');
		} catch (error) {
			res.send(error);
		}
	};
}

module.exports = new Auth();
