const handleSignin = (req, res, db, bcrypt) => {
    const { email, password } = req.body;
    queryResult = db('users')
                .join('login','users.id', '=', 'login.user_id')
                .select('*')
                .where({email});
    queryResult.then(userInfo => {
        if(userInfo.length === 1 && userInfo[0].id > 0 && password){
            const user = userInfo[0];
            if(bcrypt.compareSync(
            password, 
            user.password_hash
            )){
                res.json({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    entries: user.entries,
                    joined: user.joined
                });
            } else {
                res.status(403).json("Error logging in.");
            }
        } else {
            res.status(500).json("Error logging in.");
        }
    });
}

module.exports = {
    handleSignin: handleSignin
};