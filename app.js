const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const qs = require('qs');
const assert = require('assert');
const dotenv = require("dotenv");

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://admin:1234@cluster0.dib21mu.mongodb.net/profilesDB");

const profileSchema = {
    guide: String,
    isActive: Boolean,
    balance: String,
    picture: String,
    age: Number, 
    eyeColor: String,
    name: String,
    gender: String,
    company: String,
    email: {
        type: String,
        validate(value){
            if (value.includes(company)){
                throw new Error("Invalid email");
            }
        }
    },
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

const Profile = new mongoose.model("Profile", profileSchema);

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


