const axios = require('axios');
const Dev = require('./../models/Dev');
const PasrStringAsArray = require('./../utils/ParseStringAsArray');
const { findConnections, sendMessage } = require('./../websocket');

module.exports = {
    async index(require, response) {
        const devs = await Dev.find();

        return response.json(devs);
    },
    async store(require, response) {
        const { github_username, techs, latitude, longitude } = require.body;

        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

            const { name = login, avatar_url, bio } = apiResponse.data;

            const techsArray = PasrStringAsArray(techs);

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }

            dev = await Dev.create({
                name,
                github_username,
                bio,
                avatar_url,
                techs: techsArray,
                location
            });

            const sendSocketMessageTo = findConnections({ latitude, longitude }, techsArray);

            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        }

        return response.json(dev);
    }
};