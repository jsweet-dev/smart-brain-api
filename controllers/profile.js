const profileGet = (req, res, db) => {
    const { id } = req.params;
    db('users')
    .select()
    .where({id})
    .then(data => {
        res.json(data);
    })
    .catch(err => res.json("Error getting user."));
}

module.exports = {
    profileGet
};