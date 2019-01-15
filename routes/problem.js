const express = require("express");
const router = express.Router();
const db = require("../models");


router.post('/', (req, res) => {
    db.problem.create({
        username: req.user.username,
        userId: req.user._id,
        title: req.body.title,
        twitter_url: req.user.twitter_url,
        content: req.body.content,
        genres: req.body.genres.split(','),
        country: req.body.country
    }).then(prob => {
        res.json({ statusCode: 200 });
    }).catch(err => {
        res.json({ statusCode: 400 });
    });
});

router.get('/', (req, res) => {
    db.problem.find().then(probs => {
        res.json(probs);
    }).catch(err => {
        res.json({ statusCode: 400 });
    });
});


router.get('/start', (req, res) => {
    db.Subscribers.create({ name: 'mailing list' }).then(list => {
    }).catch(err=>{
        
    })
});

router.post('/subscribe', (req, res) => {
    db.Subscribers.findOne({ name: 'mailing list' }).then(list => {
        if (list.emails.includes(req.body.email)) {
            res.json({ statusCode: 500 });
        } else {
            list.emails.push(req.body.email);
            list.save();
            res.json({ statusCode: 200 });
        }
    }).catch(() => res.json({ statusCode: 400 }));
})

router.get('/:id', (req, res) => {
    db.problem.findById(req.params.id).then(prob => {
        res.json(prob.comments); Get
    });
});

router.post('/:id', (req, res) => {
    const io = req.app.get('io');
    db.problem.findById(req.params.id).then(prob => {
        prob.comments.push({
            comment: req.body.comment,
            twitter_url: req.user.twitter_url,
            username: req.user.username
        });
        prob.save().then(() => {
            io.emit('new_comment');
        });
        res.json({ statusCode: 200, twitter_url: req.user.twitter_url, username: req.user.username });
    }).catch(err => {
        res.json({ statusCode: 400 });
    });
});


// router.get('/:id', (req, res) => {
//     const io = req.app.get('io');
//     db.song.findById(req.params.id).then(song => {
//         song.likes = song.likes + 1;
//         song.save().then(() => {
//             io.emit('newlike');Get
//         });
//         res.json({ statusCode: 200 });
//     }).catch(err => {
//         res.json({ err: 404 });
//     });
// });

// router.get('/:id/likes', (req, res) => {
//     db.song.findById(req.params.id).then(song => {
//         res.json({ likes: song.likes });
//     });
// });

// router.get('/:id/views', (req, res) => {
//     db.song.findById(req.params.id).then(song => {
//         res.json({ views: song.views });
//     });
// })

module.exports = router;