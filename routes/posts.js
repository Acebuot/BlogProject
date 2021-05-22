var express = require('express');
var router = express.Router();
const ObjectID = require('mongodb').ObjectID;

router.get('/posts', function(req, res, next)
{
    const posts = req.app.locals.posts;
    
    posts
    .find({})
    .toArray()
    .then(function(posts) {res.render('posts', { title: 'All Posts', posts})});
});

///Built to go on posts.ejs so it needs to be in an array to work
router.get('/posts/:id', function(req, res, next)
{
    const id = ObjectID(req.params.id);
    const posts = req.app.locals.posts;
    const users = req.app.locals.users;
    const arr = [];

    posts
    .findOne({ _id: id})
    .then(function(post)
    {
        arr.push(post);
        console.log('here come that bitch');
        console.log(post);
        res.render('posts', { title:`view post`, posts: arr});
    });
});

router.get('/postsByUser/:username', function(req, res, next)
{
    const username = req.params;
    const posts = req.app.locals.posts;
    
    posts
    .find({author: username})
    .toArray()
    .then(function(posts)
    {
        console.log(posts.length);
        res.render('posts', { title:`${username}'s Posts`, posts})
    });
});

const checkhAuthenication = (req, res, next) =>
{
    if (!req.isAuthenticated())
    {
        req.session.message = "You must log in to make a post";
        return res.redirect('/users/login');
    }
    return next();
}


router.get('/create-post', checkhAuthenication, function(req, res, next) 
{
    const id = ObjectID(req.user.id);
    const users = req.app.locals.users;

    message = req.session.message || [];
    if (req.session.message != undefined) req.session.message = undefined;

    users
        .findOne({_id: id})
        .then(function(user) 
        {
            // console.log('YAy')
            // console.log(user);
            
            res.render('create-post', { title: 'Create a New Post', message });
        });
});

router.post('/create-post', checkhAuthenication, function(req, res, next)
{
    
    const users = req.app.locals.users;   
    const {title, content} = req.body;
    const userId = ObjectID(req.user.id);
    const posts = req.app.locals.posts;
    const date = new Date().toISOString();


    users
        .findOne({ _id: userId})
        .then(function(user)
        {
            
            posts
            .insertOne({title, content, date, author: user.username}, function(err, result)
            {
                if(err)
                {
                    console.log('posts catch');
                    req.session.message = 'An error occurred while posting. Please try again later.';
                    return res.redirect('/create-post');
                }
                console.log('post success');
                //const post = posts.findOne({ title, content, date, author: user});
                //console.log(res.ops);
                console.log(result.insertedId);
                
                
                res.redirect(`/posts/${result.insertedId}`);
                
            })
        })
        .catch(function(error)
        {
            console.log('users catch: ' + error);
            req.session.message = 'An error occurred while posting. Please try again later.';
            res.redirect('/create-post');
        });

    
});

module.exports = router;
