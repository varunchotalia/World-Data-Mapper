const ObjectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcryptjs');
const User = require('../models/user-model');
const tokens = require('../utils/tokens');

module.exports = {
	Query: {
		/** 
		 	@param 	 {object} req - the request object containing a user id
			@returns {object} the user object on success and an empty object on failure 
		**/
		getCurrentUser: async (_, __, { req }) => {
			const _id = new ObjectId(req.userId);
			if(!_id) { return({}) }
			const found = await User.findOne(_id);
			if(found) return found;
		},
	},
	Mutation: {
		/** 
			@param 	 {object} args - login info
			@param 	 {object} res - response object containing the current access/refresh tokens  
			@returns {object} the user object or an object with an error message
		**/
		login: async (_, args, { res }) => {	
			const { email, password } = args;

			const user = await User.findOne({email: email});
			if(!user) return({});

			const valid = await bcrypt.compare(password, user.password);
			if(!valid) return({});
			// Set tokens if login info was valid
			const accessToken = tokens.generateAccessToken(user);
			const refreshToken = tokens.generateRefreshToken(user);
			res.cookie('refresh-token', refreshToken, { httpOnly: true , sameSite: 'None', secure: true}); 
			res.cookie('access-token', accessToken, { httpOnly: true , sameSite: 'None', secure: true}); 
			return user;
		},
		/** 
			@param 	 {object} args - registration info
			@param 	 {object} res - response object containing the current access/refresh tokens  
			@returns {object} the user object or an object with an error message
		**/
		register: async (_, args, { res }) => {
			const { email, password, name } = args;
			const alreadyRegistered = await User.findOne({email: email});
			if(alreadyRegistered) {
				console.log('User with that email already registered.');
				return(new User({
					_id: '',
					name: '',
					email: 'already exists', 
					password: ''}));
			}
			const hashed = await bcrypt.hash(password, 10);
			const _id = new ObjectId();
			const user = new User({
				_id: _id,
				name: name,
				email: email, 
				password: hashed
			})
			const saved = await user.save();
			// After registering the user, their tokens are generated here so they
			// are automatically logged in on account creation.
			const accessToken = tokens.generateAccessToken(user);
			const refreshToken = tokens.generateRefreshToken(user);
			res.cookie('refresh-token', refreshToken, { httpOnly: true , sameSite: 'None', secure: true}); 
			res.cookie('access-token', accessToken, { httpOnly: true , sameSite: 'None', secure: true}); 
			return user;
		},
        //to:do
        update: async (_, args, { res }) => {
            const {_id, oldEmail, email, password, name } = args;
			const user = await User.findOne({email: email});
			if(oldEmail === email && user) {
                console.log('User found for update');
                const hashed = await bcrypt.hash(password, 10);
                const updated1 = await User.updateOne({email: email},  {password: hashed} );
                const updated2 = await User.updateOne({email: email},  {name: name} );
                if(updated1 && updated2)
                    return user;
            }
            else if(user){
                console.log("New email already exists.");
                return ({});
            }
            const iduser = await User.findOne({_id: _id});
            if(iduser){
                const hashed = await bcrypt.hash(password, 10);
                const updated1 = await User.updateOne({_id: _id},  {password: hashed} );
                const updated2 = await User.updateOne({_id: _id},  {name: name} );
                const updated3 = await User.updateOne({_id: _id},  {email: email} );
                if(updated1 && updated2 && updated3)
                    return user;
            }
            console.log('User not found for update');
            return ({});
        },
		/** 
			@param 	 {object} res - response object containing the current access/refresh tokens  
			@returns {boolean} true 
		**/
		logout:(_, __, { res }) => {
			res.clearCookie('refresh-token');
			res.clearCookie('access-token');
			return true;
		}
	}
}
