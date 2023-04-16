const patterns = {
	email: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
	password: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
};

const messages = {
	email: "Invalid email address",
	password:
		"Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number",
};
const validate = (rule) => {
	// const rulesArr = rules.split("|");
	console.log("validate rules__________");
	if (patterns[rule]) {
		return {
			validator: (v) => patterns[rule].test(v),
			message: messages[rule],
		};
	}
};

module.exports = {
	validate,
};
