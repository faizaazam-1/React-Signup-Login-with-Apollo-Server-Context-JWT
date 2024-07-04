const User = require('../../models/User');
const {ApolloError} = require('apollo-server-errors');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


module.exports = {
    Mutation: {
        async registerUser(_, {registerInput: {username, email, password, confirmPassword} }) {
           
           // Ensure password and confirmPassword match
            if (password !== confirmPassword) {
                 throw new ApolloError('Passwords do not match', 'PASSWORDS_DO_NOT_MATCH');
                }
                
            // see if an old user existswith email attempting to register
           const oldUser = await User.findOne({email});

           //THROW ERROR IF USER ALREADY EXISTS
           if(oldUser)
            {
                throw new ApolloError('A user is already registered with the email' + email,'USER_ALREADY_EXISTS' )
            }

            //Encrypt password
            const encryptedPassword = await bcrypt.hash(password, 10);

            //Build out the moongoose model(User)
            const newUser = new User({
                username: username,
                email: email.toLowerCase(),
                password: encryptedPassword
            })

            //Creat our JWT(attach to our user model)
            const token = jwt.sign(
                {user_id: newUser._id, email},
                "UNSAFE_STRING",
                {
                    expiresIn:"2h"
                }
                
            );

            newUser.token = token;
        

           //Save our user in MongoDB 
           const res = await newUser.save();
           return {
            id: res.id,
            ...res._doc
                  };
        },

        async loginUser(_, {loginInput: {email, password} }) {

            //See if a user exists with the email
            const user = await User.findOne({email});

            //Check if the entered password is equal to the encrypted password
            if(user && (await bcrypt.compare(password, user.password )))
                {
                     //Create a New token 
                    const token = jwt.sign(
                        {user_id: user._id, email},
                        "UNSAFE_STRING",
                        {
                            expiresIn:"2h"
                        }
                        
                    );
                    //Attach token to the user model
                    user.token = token;
                    return {
                        id: user.id,
                        ...user._doc
                              };
                    
                }
                //If user doesn't exists, return error 
                else {
                    throw new ApolloError('Incorrect Password or Username','INCORRECT_PASSWORD_USERNAME')
                }
            
            
            
        }
    },
    Query: {
        user: (_, {ID}) => User.findById(ID)
    }
}