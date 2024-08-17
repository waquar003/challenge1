import { User } from "./user.model.js"

/**
 * Generates access and refresh tokens for a user.
 * 
 * @param {string} userId - The ID of the user for whom tokens are generated
 * @returns {Object} An object containing the generated access and refresh tokens
 * @throws {Error} If there is an error while generating tokens
 */

const generateAccessAndRefreshToken = async (userId) => {
	try {
		const user = await User.findById(userId)
		const accessToken = user.generateAccessToken()
		const refreshToken = user.generateRefreshToken()

		user.refreshToken = refreshToken

		await user.save({
			validateBeforeSave: false
		})

		return { accessToken, refreshToken }

	} catch (error) {
		throw new Error("Error while generating access and refresh Tioken")
	}
}


/**
 * Registers a new user with the provided information.
 * 
 * @param {Object} req - The request object containing user details in the body.
 * @param {Object} res - The response object to send back the result.
 * @returns {Object} JSON response with status and message indicating the result of user registration.
 * @throws {Error} If any required field is missing, if the user already exists, or if there is an error during registration.
 */

const registerUser = async (req, res) => {
	const { fullName, email, username, password, phone } = req.body


	if([fullName, email, username, password, phone].some(field => field?.trim()==='')){
		throw new Error("All fields are required")
	}

	const existedUser = await User.findOne({
		$or: [{username}, {email}, {phone}]
	})

	if(existedUser){
		throw new Error("User already existed. Login to Your account")
	}

	const user = await User.create({
		fullName,
		username,
		email,
		phone,
		password
	})

	if(!user){
		throw new Error("Error while registering. Try Again!")
	}

	return res.json({
		status: 200,
		message: "User Created Successfully"
	})

}


/**
 * Logs in a user by validating the provided credentials and generating access and refresh tokens.
 * 
 * @param {Object} req - The request object containing user login details in the body.
 * @param {Object} res - The response object to send back the login status and tokens.
 * @returns {Object} - Returns a JSON response with status 200 and a message upon successful user login.
 * @throws {Error} - Throws an error if required fields are missing, user is not found, password is invalid, or token generation fails.
 */

const loginUser = async (req, res) => {	
	
	const { email, username, phone, password } = req.body;

	if(!email && !username && !phone){
		throw new Error("One of the field from email, username and phone is required")
	}

	const user = await User.findOne({
		$or:[{username}, {email}, {phone}]
	})

	if(!user){
		throw new Error("User not found")
	}

	const isPasswordValid = await user.isPasswordCorrect(password)

	if(!isPasswordValid){
		throw new Error("Invalid Password")
	}

	const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

	const option = {
		secure: true,
		httpOnly: true
	}

	return res
	.cookie("accessToken", accessToken, option)
	.cookie("refreshToken", refreshToken, option)
	.json({
		status: 200,
		message: "User logged in Successfully"
	})
}

export {
	registerUser,
	loginUser
}