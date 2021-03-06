const GitHubAPI = require('../services/GitHub.service');
const {
	per_page,
	client_id,
	client_secret,
} = require('../config/configuration.json');

exports.whoDoesNotFollowMe = async username => {
	const followers = [];
	const following = [];

	try {
		let page = 1;

		do {
			const { data } = await GitHubAPI.get(`/${username}/following`, {
				params: {
					page,
					per_page,
					client_id,
					client_secret,
				},
			});

			following.push(...data.map(({ login }) => login));

			if (data.length < 100) break;
			else page++;
		} while (true);

		page = 1;

		do {
			const { data } = await GitHubAPI.get(`/${username}/followers`, {
				params: {
					page,
					per_page,
					client_id,
					client_secret,
				},
			});

			followers.push(...data.map(({ login }) => login));

			if (data.length < 100) break;
			else page++;
		} while (true);
	} catch ({
		response: {
			data: { message = 'Malformed request' },
		},
	}) {
		return { thesePeopleDoNotFollowMe: undefined, message };
	}

	const thesePeopleDoNotFollowMe = following.filter(
		login => !followers.includes(login),
	);

	return { thesePeopleDoNotFollowMe };
};
