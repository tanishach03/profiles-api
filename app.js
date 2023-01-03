const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const qs = require('qs');
const assert = require('assert');
const dotenv = require("dotenv");
const _ = require("lodash");
const mongoosePaginate = require("mongoose-paginate-v2");

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://admin:1234@cluster0.dib21mu.mongodb.net/profilesDB");

const profileSchema = {
    guid: String,
    isActive: Boolean,
    balance: String,
    picture: String,
    age: Number, 
    eyeColor: String,
    name: String,
    gender: String,
    company: String,
    email: String,
    phone :String,
    address: String,
    about: String,
    regTime: String,
    latitude: String,
    longitude: String, 
    tags: [
        {
          type: {
            type: { type: String }
          }
        }
      ],
    friends: [
        {
          type: {
            type: { type: String }
          }
        }
      ], 
    greeting: String
} 

profileSchema.set('validateBeforeSave', false);
schema.path('email').validate(function (value) {
    const validate = value.includes(_.lowerCase(req.body.company));
});
// profileSchema.plugin(mongoosePaginate);

const Profile = new mongoose.model("Profile", profileSchema);

// Profile.paginate().then({});

//Requests targeting all the profiles
app.route("/profiles")
    .get(function(req, res){
        Profile.find(function(err, foundProfiles){
            if(!err){
                res.send(foundProfiles);
            }
            else{
                res.send(err)
            }
        });
    })
    .post(function(req, res){

        const newProfile = new Profile({
            guid: req.body.guid,
            isActive: req.body.activity,
            balance: req.body.balance,
            picture: req.body.picture,
            age: req.body.age, 
            eyeColor: req.body.eyeColor,
            name: req.body.name,
            gender: req.body.gender,
            company: req.body.company,
            email: req.body.email,
            phone : req.body.phone,
            address: req.body.address,
            about: req.body.about,
            regTime: req.body.regTime,
            latitude: req.body.latitude,
            longitude: req.body.longitude, 
            tags: req.body.tags,
            friends: req.body.friends, 
            greeting: req.body.greeting
        });
        newProfile.save(function(err){
            if (!err){
                res.send("Successfully added the new profile!");
            }
            else{
                res.send(err);
            }
            if (!req.body.email.includes(_.lowerCase(req.body.company))){
                throw new Error("Invalid email");
            }
        });
    })
    .delete(function(req, res){
        Profile.deleteMany(function(err){
            if(!err){
                res.send("Sucessfully deleted all the profiles!");
            }
            else{
                res.send(err);
            }
        });
    });


//Sorting the profiles based on their genders
app.get("/profiles/:gender", function (req, res) {
    Profile.find({gender: req.params.gender}, function(err, foundGender){
        if (foundGender){
            res.send(foundGender);
        }
        else{
            res.send("No profiles matching that gender were found.");
        }
    })
})


//Requests targeting specific profile(s)
app.route("/profiles/:profileId")
    .get(function(req, res){
        Profile.findOne({GUID: req.params.profileId}, function(err, foundProfile){
            if(foundProfile){
                res.send(foundProfile);
            }
            else{
                res.send("No profiles matching that id were found.");
            }
        });
    })
    .put(function(req, res){
        Profile.updateOne(
            {title: req.params.profileId},
            {guid: req.body.guid, isActive: req.body.activity, balance: req.body.balance, picture: req.body.picture, age: req.body.age, eyeColor: req.body.eyeColor, name: req.body.name, gender: req.body.gender, company: req.body.company, email: req.body.email, phone : req.body.phone, address: req.body.address, about: req.body.about, regTime: req.body.regTime, latitude: req.body.latitude, longitude: req.body.longitude,  tags: req.body.tags, friends: req.body.friends,  greeting: req.body.greeting},
            function(err){
                if (!err){
                    res.send("Successfullly updated the profile.");
                }
            }
         );
    })
    .patch(function(req, res){
        Profile.updateOne(
            {title: req.params.profileId},
            {$set: req.body},
            function(err){
                if (!err){
                    res.send("Successfullly updated the profile.");
                }
                else{
                    console.log(err);
                }
            }
         );
    })
    .delete(function(req, res){
        Profile.deleteOne(
            {title: req.params.profileId},
            function(err){
                if (!err){
                    res.send("Successfullly deleted the profile.");
                }
                else{
                    console.log(err);
                }
            }
         );
    })


app.listen("3000", function(){
    console.log("Server started on port 3000");
})


