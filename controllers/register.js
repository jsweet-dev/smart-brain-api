const handleRegister = (req, res, db, bcrypt) => {
    const saltRounds= 10;
    const { name, email, password } = req.body;
    if(name && email && password){
        let hashedPwd = bcrypt.hashSync(req.body.password, saltRounds);
        db.transaction(trx => {
            trx.insert({
                name: name,
                email: email,
                joined: new Date()
            },['*'])
            .into('users')
            .then(response => {
                trx.insert({
                    user_id: response[0].id,
                    password_hash: hashedPwd
                })
                .into('login')
                .then(pwdResponse => {
                    res.json(response[0]);
                })
                .catch(error => {
                    trx.rollback;
                    res.status(400).json(`Error adding login`);
                })
            })
            .then(trx.commit)
            .catch(error => {
                trx.rollback;
                res.status(501).json("Problem adding user");
            })
        })
        .catch(error => {
            res.status(500).json("Could not register user.");
        })
    } else {
        res.json("invalid form submission");
    }
}

module.exports = {
    handleRegister: handleRegister
}