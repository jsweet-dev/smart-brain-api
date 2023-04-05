const handleUsersGet = (req, res, db) => {
    db('users')
    .select()
    .then(data => {
        res.json(data);
    })
    .catch(err => res.json("Could not get users."));
}

module.exports = {
    handleUsersGet
};