exports.get404 = (rep,res,next) => {
    res.status(404).send({ error: 'Not found' });
}