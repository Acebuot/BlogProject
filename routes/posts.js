var express = require('express');
var router = express.Router();
const ObjectID = require('mongodb').ObjectID;

//return user obj of logged in user otherwise return null user
function userLoggedIn(req)
{
    
    const users = req.app.locals.users;
    return new Promise((resolve, reject) => 
    {
        if (req.user == undefined)
        {
            resolve(null)
        }
        else
        {
            const id = ObjectID(req.user.id);

            users
            .findOne({ _id: id})
            .then(function(user)
            {
                
                resolve(user);
            })
        }
    })
}

const checkhAuthenication = (req, res, next) =>
{
    if (!req.isAuthenticated())
    {
        req.session.message = "You must be logged in to do that";
        return res.redirect('/users/login');
    }
    return next();
}

router.get('/posts', function(req, res, next)
{
    

    const posts = req.app.locals.posts;
    const message = req.session.message;
    if (req.session.message != undefined) req.session.message = undefined;

    userLoggedIn(req).then( function(user) 
    {
        posts
            .find({})
            .toArray()
            .then(function(posts) 
            {
                //console.log(user);
                res.render('posts', { title: 'All Posts', posts, message, user});
            });
    });

});


router.get('/posts/:id', function(req, res, next)
{
    const id = ObjectID(req.params.id);
    const posts = req.app.locals.posts;
    var username = null;
    
    const message = req.session.message;
    if (req.session.message != undefined) req.session.message = undefined;

    userLoggedIn(req)
    .then(function(user) 
    {
        posts
        .findOne({ _id: id})
        .then(function(post)
        {
            
            
            if (post == null)
            {
                res.render('posts', { title:`View Post`, posts: arr, message: 'Sorry, the post was not found'});
            }
            res.render('post', { title:`View Post`, post, message, user});
        });
    });
    
});

router.post('/posts/deletePost', checkhAuthenication, function(req, res, next)
{
    const posts = req.app.locals.posts;
    const id = ObjectID(req.body.postID);
    console.log(id);

    posts
    .deleteOne({_id: id})
    .then(function(result)
    {
        console.log(`Deleted: ${result.deletedCount}`);
        res.redirect('/posts');
    })
    .catch(function(err)
    {
        console.log(`Delete unsuccessful: ${err}`)
    });

    
    //posts.deleteOne()
});

router.get('/postsByUser', function(req, res, next)
{
    const posts = req.app.locals.posts;
    const message = req.session.message;
    if (req.session.message != undefined) req.session.message = undefined;

    userLoggedIn(req)
    .then(function(user) 
    {
        //if not logged in
        if (user == null)
        {
            //go to all posts
            return res.redirect('/posts');
        }

        //go to logged user's posts
        res.redirect(`/postsByUser/${user.username}`);
    });

});

router.get('/postsByUser/:username', function(req, res, next)
{
    const {username} = req.params;
    const posts = req.app.locals.posts;
    const message = req.session.message;
    if (req.session.message != undefined) req.session.message = undefined;

    userLoggedIn(req)
    .then(function(user) 
    {
        
        posts
        .find({author: username})
        .toArray()
        .then(function(posts)
        {
            res.render('posts', { title:`${username}'s Posts`,message, posts, user})
        });
    });

});

router.post('/postsByUser')


router.get('/create-post', checkhAuthenication, function(req, res, next) 
{
    const id = ObjectID(req.user.id);
    const users = req.app.locals.users;

    message = req.session.message || [];
    if (req.session.message != undefined) req.session.message = undefined;

    userLoggedIn(req)
    .then(function(user) 
    {
        res.render('create-post', { title: 'Create a New Post', message, user});
    });

});



//add alert for successful post creation
router.post('/create-post', checkhAuthenication, function(req, res, next)
{
    
    const users = req.app.locals.users;   
    const {title, content} = req.body;
    const userId = ObjectID(req.user.id);
    const posts = req.app.locals.posts;
    const date = new Date().toISOString()
                                .replace(/T/, ' ') //replace T with space
                                .replace(/\..+/, ''); //replace everything after time


                                
    userLoggedIn(req)
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
                req.session.message = 'Successfully made a post';
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
