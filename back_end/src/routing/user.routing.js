import { ObjectId } from "mongodb";

export default function userRouting(app, db) {

    app.get("/users", (req, res) => {

        const page = req.query.page || 0;
        const usersPerPage = 2;

        let users = [];

        // console.log(db);

        db.collection('user')
            .find()
            .sort({ lastName: 1 })
            .skip(page * usersPerPage)
            .limit(usersPerPage)
            .forEach(user => users.push(user))
            .then(() => {
                res.status(200).json(users);
            })
            .catch(() => {
                res.status(400).json({ error: 'Failed to fetch' })
            })
    });

    app.get("/users/:id", (req, res) => {

        if (ObjectId.isValid(req.params.id)) {
            const userId = new ObjectId(req.params.id);

            db.collection('user').findOne({ _id: userId })
                .then(user => {
                    res.status(200).json(user)
                })
                .catch(() => {
                    res.status(400).json({ error: 'Failed to fetch' })
                })

        } else {
            res.status(400).json({ error: 'Not a valid Id' })
        }
    });


    app.post("/users", (req, res) => {

        let newUser = req.body;

        db.collection('user')
            .insertOne(newUser)
            .then(response => {
                res.status(201).json(response);
            })
            .catch(() => {
                res.status(400).json({ error: 'Failed to create new user' })
            })
    });

    app.delete("/users/:id", (req, res) => {

        if (ObjectId.isValid(req.params.id)) {
            const userId = new ObjectId(req.params.id);

            db.collection('user')
                .deleteOne({ _id: userId })
                .then(result => {
                    res.status(200).json(result)
                })
                .catch(() => {
                    res.status(400).json({ error: 'Failed to delete the user' })
                })

        } else {
            res.status(400).json({ error: 'Not a valid Id' })
        }
    });

    app.patch("/users/:id", (req, res) => {
        const updates = req.body;

        if (ObjectId.isValid(req.params.id)) {
            const userId = new ObjectId(req.params.id);

            db.collection('user')
                .updateOne({ _id: userId }, { $set: updates })
                .then(result => {
                    res.status(200).json(result)
                })
                .catch(() => {
                    res.status(400).json({ error: 'Failed to update the user' })
                })

        } else {
            res.status(400).json({ error: 'Not a valid Id' })
        }
    });
}