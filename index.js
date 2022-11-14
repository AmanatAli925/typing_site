const express= require('express');
const mongoose= require('mongoose');
const User= require('./models/users_model.js');
const verify_codes= require('./models/verify_codes.js');
const app = express();
const express_hbs= require("express-handlebars");
const session= require('express-session');
const path= require("path");
const pages_routes= require("./routes/pages_routes.js");
const learn_routes= require("./routes/learn_routes.js");
const test_routes= require("./routes/test_routes.js");
const puzzle_routes= require("./routes/puzzle_routes.js");
const forms_handling_routes= require("./routes/forms_handling_routes.js");
const scrabble_routes= require("./routes/scrabble_routes.js");
const clue_crossword_routes= require("./routes/clue_crossword_routes.js");
const api_lessons= require("./routes/api/lessons.js")
const passport= require('passport');
const passportFacebook= require('passport-facebook');
const FacebookStrategy= passportFacebook.Strategy;

const domain_name= "TouchTyping.website"; 

//MONGOOSE CONNECT
mongoose.connect('mongodb+srv://amanat:Newpassword1@cluster0.8wfum.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
	useCreateIndex: true,
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
})

const db= mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function(){
	console.log("Connected to mongodb")
})

//Session setting

app.use(session({
	secret: "I know this should be in safe place but am too too lazy",
	cookie:{ maxAge: 8*60*60*1000 }
}))

app.use(function(req, res, next){
	res.locals.session= req.session;
	req.domain_name=domain_name;
	next();
})

app.use(function(req, res, next){

	if(req.path.includes("/enter-code")){
		
		next()
		return;
	}
	
	if(req.path.includes("/cancel-sinup")){
		
		next()
		return;
	}
	
	if(req.path.includes("css") || req.path.includes("finish-sign-up")){
		
		next()
		return;
	}
	if(req.session.user && !req.session.user.email_verified){
		res.render('email-not-verified',{
			email: req.session.user.email
		})
	}else 
		next()
})





// app configuration
app.use(express.json())
app.use(express.urlencoded({
	extended: true
}))
app.use('/',express.static(path.join(__dirname,'views')));

passport.use(new FacebookStrategy({
		clientID: "903295953558734",
		clientSecret: "15b2ff1070b8bb28628f45e421f00912",
		callbackURL: "https://touchtyping.website/auth/facebook/callback"	
	},
	function(accessToken, refreshToken, profile, done) {
        //check user table for anyone with a facebook ID of profile.id
        User.findOne({
            'facebookId': profile.id 
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            //No user was found... so create a new user with values from Facebook (all the profile. stuff)
            if (!user) {
                user = new User({
                   
                  
                    username: profile.username,
                    
                    //now in the future searching on User.findOne({'facebook.id': profile.id } will match because of this next line
                    facebookId: profile.id
                });
                user.save(function(err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            } else {
                //found user. Return
                return done(err, user);
            }
        });
	}
))

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/login'}),
	function(req, res){
		res.redirect('/');
	}
)

app.engine('handlebars', express_hbs({
	helpers:{
		is_done: function( finished_lessons, keys, layout,  options ){
		
			
			if(!layout)
				layout='qwerty';
			if(!finished_lessons)
				return options.inverse(this);
			
			
			finished_lessons= finished_lessons.filter( (l)=> l.includes(layout))
			finished_lessons= finished_lessons.map( (l)=> l.split('-') )
			var finished= false
			for( var i=0; i< finished_lessons.length; ++i){
				if(finished_lessons[i][1]==keys ){
					finished= true;
					break;
				}
				
				lesson= finished_lessons[i][1]+'-'+finished_lessons[i][2];
				
				if(lesson==keys){
					finished=true;
					break;
				}

			}
					
					
			if(finished)
				return options.fn(this)
			else
				return options.inverse(this)
					
		},
		characterize: function(digit){
			digit++;
			switch(digit){
			
				case 2:
					return "Two";
				case 3:
					return "Three";
				case 4:
					return "Four";
				case 5:
					return "Five";
				case 6:
					return "Six";
				case 7:
					return "Seven";
				case 8:
					return "Eight";
				
			}
		},
		times: function(n, options){
			var tenTimes="";
			for(var i=1; i<=n; ++i)
				tenTimes+=options.fn(i)
			return tenTimes
		},
		inc: function(n){
			return n+1;
		},
		concat: function( str1, str2){
			str2++;
			console.log(str1, str2);
			return str1+"-"+str2;
		}
	}
}));
app.set('view engine', 'handlebars');


// facebook routes

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/login'}),
	function(req, res){
		res.redirect('/');
	}
)





// app routes
app.use('/', pages_routes)
app.use('/learn-typing', learn_routes);
app.use('/test', test_routes);
app.use('/puzzle', puzzle_routes);
app.use('/forms-handling', forms_handling_routes);
app.use('/scrabble', scrabble_routes);
app.use('/clue-crossword', clue_crossword_routes);
app.use('/api/lessons', api_lessons);


const server = app.listen(process.env.PORT || 8080, function(){
	console.log("listening");
});

