const { Controller } = require('../../app/controllers/ControllerClass');

const applySwapiEndpoints = (server, app) => {

    const controller = new Controller(app);

    server.get('/hfswapi/test', async (req, res) => {
        const data = await controller.testSwapi(app);
        res.send(data);
    });

    server.get('/hfswapi/getPeople/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const data = await controller.getPeopleById(id);
            res.status(200).send(data);
        } catch (error) {
            res.status(500).send({error: error.message});
        }
    });

    server.get('/hfswapi/getPlanet/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const data = await controller.getPlanetById(id);
            res.status(200).send(data);
        } catch (error) {
            res.status(500).send({error: error.message});
        }
    });

    server.get('/hfswapi/getWeightOnPlanetRandom', async (req, res) => {
        try {
            const data = await controller.getWeightOnPlanetRandom();
            res.status(200).send(data);
        } catch (error) {
            res.status(500).send({error: error.message});
        }
    });

    server.get('/hfswapi/getLogs',async (req, res) => {
        try {
            const data = await controller.getAllLogs();
            res.status(200).send(data);
        } catch (error) {
            res.status(500).send({error: error.message});
        }
    });

}

module.exports = applySwapiEndpoints;