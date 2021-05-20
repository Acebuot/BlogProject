var express = require('express');
var router = express.Router();

router.get('/posts', function(req, res, next)
{
    
});

router.get('/create-post', function(req, res, next) 
{
    message = req.session.message || [];
    if (req.session.message != undefined) req.session.message = undefined;
    res.render('create-post', { title: 'Create a New Post', message });
});

router.post('/create-post', function(req, res, next)
{
    const {title, content} = req.body;
    const username = req.user.username;
    const posts = req.app.locals.posts;
    const date = new date().toISOString();

    posts
    .insertOne({title, content, date, author: username})
    .then(function()
    {
        const post = posts.findOne({ title, content, date, author: username});
        res.render(`/posts/${post.id}`)
    })
    .catch(function()
    {
        req.session.message = 'An error occurred while posting. Please try again later.';
        res.redirect('/create-post');
    });
});

module.exports = router;
