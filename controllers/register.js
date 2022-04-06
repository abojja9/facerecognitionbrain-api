const saltRounds = 10;

const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password ){
        return res.status(400).json('Incorrect form submission');
    }

    console.log("register:", req.body)
    const hash = bcrypt.hash(password, saltRounds, function(err, hash) {
        // Store hash in your password DB.

        console.log(hash)
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                console.log("loginEmail:", loginEmail)
                return trx('users')
                .returning('*')
                .insert({
                    name: name,
                    email: loginEmail[0].email,
                    entries: 0,
                    joined: new Date()
            
                }).then(
                    user => {
                        res.json(user[0]);
                    }
                )
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('Unable to register!'))
})
       
    }

module.exports = {
    handleRegister: handleRegister
}