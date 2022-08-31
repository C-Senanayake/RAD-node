const express=require("express");
const path=require("path");
const session=require("express-session");
const data=require("./data");
const passport=require("passport");
const passportLocal=require("passport-local");

const app=express();


const localstrategy=new passportLocal.Strategy(
    {
        usernameField:"email",
    },
    (email,password,done)=>{
        const user=data.users.find((user)=>user.email===email);
        console.log(users);
        if(!user){
            return done(null,false);
        }
        else{
            if(user.password!=password){
                return done(null,false);
            }
            else{
                return done(null,user);
            }
        }
    }
);
passport.use(localstrategy);


passport.serializeUser(function (user,done){
    done(null,user);
});

passport.deserializeUser(function (email,done){
    done(null,email);
});

app.use(
    session({
        secret:"Hello",
        cookie:{
            maxAge:60*60*1000,
            httpOnly:true,
            secure:false
        },
        resave:false,
        saveUninitialized:true,
    })
);

app.use(passport.initialize());
app.use(passport.session());


app.use(express.urlencoded({extended:true}));


app.get("/login",
    passport.authenticate("local",{
    failureRedirect:"/index.html",
    successRedirect:"/done.html",
    }),
    (req,res)=>{}
    // res.sendFile(path.resolve(__dirname,"views","index.html"));
    
);

app.post('/done',(req,res)=>{
    if(!req.session.pageVisitCount){
        req.session.pageVisitCount=1;
    }
    else{
        req.session.pageVisitCount=req.session.pageVisitCount+1;
    }
    console.log(req.body);
    console.log(req.session.pageVisitCount);
    res.send("You have visited this page "+req.session.pageVisitCount+" times");
});

const PORT=8080;
app.listen(PORT,()=>{
    console.log('Site started running at ' +PORT+' \nVisit:http://localhost:'+PORT);
});