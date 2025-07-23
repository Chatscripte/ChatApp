const UserModel = require("./../../models/User");

exports.updateUser = async (userId, newInfos) => {
	const updatedUser = await UserModel.findByIdAndUpdate(
		userId,
		{
			$set: {
				...newInfos,
			},
		},
		{ new: true }
	).select("-password");

	return updatedUser;
};
