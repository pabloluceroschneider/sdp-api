const monk = require('monk');

class AbstractController{
    constructor(service){
        this.Service = service;
    }

    find = async (_, res) => {
        try {
            const items = await this.Service.find({});
            res.status(200).send(items);
        } catch (error) {
            res.status(500).send(`${error}`);
        }
    };
    
    create = async (req, res) => {
        try {
            const { body } = req;
            const inserted = await this.Service.create({ body });
            res.status(200).send(inserted);
        } catch (error) {
            if (error.details) {
                const errs = error.details.map( e => e.message )
                res.status(400).send(errs);
            }
            res.status(500).send(`${error}`);
        }
    };
    
    findOne = async (req, res) => {
        try {
            const { id } = req.params;
            const item = await this.Service.findOne({ id });
            res.status(200).send(item);
        } catch (error) {
            if (error.details) {
                const errs = error.details.map( e => e.message )
                res.status(400).send(errs);
            }
            res.status(500).send(`${error}`);
        }
    };
    
    findByAttribute = async (req, res, next) => {
        try {
            const { attribute, value } = req.params;
            const item = await this.Service.findByAttribute({ attribute, value });
            res.status(200).send(item);
        } catch (error) {
            res.status(500).send(`${error}`);
        }
    };
    
    update = async (req, res) => {
        try {
            const { id } = req.params;
            const { body : values } = req;
            const updated = await this.Service.update({ id, values });            
            res.status(200).send(updated);
        } catch (error) {
            res.status(500).send(`${error}`);
        }
    };
    
    remove = async (req, res) => {
        try {
            const { id } = req.params;
            const { result } = await this.Service.remove({ id });
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send(`${error}`);
        }
    };

}

module.exports = AbstractController;
