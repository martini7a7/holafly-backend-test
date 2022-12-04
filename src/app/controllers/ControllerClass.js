require('dotenv').config();

class Controller {
    app;

    constructor(app) {
        this.app = app;
    }

    async testSwapi() {
        return await this.app.swapiFunctions.genericRequest(process.env.SWAPI_BASE_URL, 'GET', null, true);
    }

    async getPeopleById(id) {
        let data = await this.app.db.swPeople.findOne(
            { 
                where: { id }, 
                attributes: [
                    'name', 
                    'mass', 
                    'height', 
                    'homeworld_name', 
                    'homeworld_id'
                ] 
            });

        if (data == null) {
            const getPeopleSwapiResponse = await this.app.swapiFunctions.genericRequest(
                `${process.env.SWAPI_BASE_URL}/people/${id}`,
                'GET',
                null,
                false
            );
            const getPlanetInfoSwapiResponse = await this.app.swapiFunctions.genericRequest(
                `${getPeopleSwapiResponse.homeworld}`,
                'GET',
                null,
                false
            );
            data = {
                name: getPeopleSwapiResponse.name,
                mass: getPeopleSwapiResponse.mass,
                height: getPeopleSwapiResponse.height,
                homeworld_name: getPlanetInfoSwapiResponse.name,
                homeworld_id: '/'+getPlanetInfoSwapiResponse.url.split('/').slice(-3, -1).join('/'),
            };
        }
        
        return data;
    }

    async getPlanetById(id) {
        let data = await this.app.db.swPlanet.findOne(
            { 
                where: { id }, 
                attributes: ['name', 'gravity']
            });

        if (data == null) {
            const getPlanetSwapiResponse = await this.app.swapiFunctions.genericRequest(
                `${process.env.SWAPI_BASE_URL}/planets/${id}`,
                'GET',
                null,
                false
            );
            data = getPlanetSwapiResponse.detail ? 
                getPlanetSwapiResponse :
                {
                    name: getPlanetSwapiResponse.name,
                    gravity: getPlanetSwapiResponse.gravity,
                };
        }

        return data;
    }

    async getWeightOnPlanetRandom() {
        let data = {};
        const swRandomPersonInfo = await this.getPeopleById(this.app.swapiFunctions.getRandomPeopleId());
        const swRandomPlanetInfo = await this.getPlanetById(this.app.swapiFunctions.getRandomPlanetId());
        if (swRandomPersonInfo.homeworld_name == swRandomPlanetInfo.name) {
            data = { error: 'Se intentó calcular el peso del personaje en su planeta natal'};
        } else if (swRandomPersonInfo.mass == 'unknown') {
            data = { error: `La masa del personaje ${swRandomPersonInfo.name} es desconocida`};
            
        } else if (swRandomPlanetInfo.gravity == 'unknown') {
            data = { error: `La gravedad del planeta ${swRandomPlanetInfo.name} es desconocida`};
        } else {
            const personMass = parseFloat(swRandomPersonInfo.mass.match(/[+-]?\d+(\.\d+)?/g)[0]);
            const planetGravity = parseFloat(swRandomPlanetInfo.gravity.match(/[+-]?\d+(\.\d+)?/g)[0]);

            const weightOnPlanet = this.app.swapiFunctions.getWeightOnPlanet(personMass, planetGravity);

            data = { message: `El peso del personaje ${swRandomPersonInfo.name} en el planeta ${swRandomPlanetInfo.name} es: ${weightOnPlanet}`}
        }
        return data;
    }
}

module.exports = {
    Controller,
};