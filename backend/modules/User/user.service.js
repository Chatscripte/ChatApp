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

exports.searchUsers = async (keyword) => {
	const results = await UserModel.aggregate([
		{
			$match: { username: { $regex: keyword, $options: "i" } },
		},
		{
			$addFields: {
				exactMatch: {
					$eq: [{ $toLower: "$username" }, keyword.toLowerCase()],
				},
			},
		},
		{
			$sort: { exactMatch: -1, username: 1 },
		},
		{
			$project: {
				_id: 1,
				username: 1,
				exactMatch: 1,
			},
		},
	]);

	return results;
};
