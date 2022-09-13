import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = Schema(
	{
		name: {
			type: String,
			required: true,
			match: [/[a-zA-Zа-яА-ЯіїІЇєЄ]/g, 'Please fill a valid name'],
		},
		email: {
			type: String,
			required: true,
			unique: true,
			match: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				'Please fill a valid email',
			],
		},
		phone: {
			type: String,
			unique: true,
			required: true,
			match: [/\+\d\(\d{4}\)\d{3}-\d{2}-\d{2}/, 'Please fill a valid phone'],
		},
		passport: {
			type: String,
			unique: true,
			required: true,
			match: [/^([A-Z]{2}[\d]{6})|([\d]{9})$/, 'Please fill a valid passport'],
		},
		birthday: {
			type: String,
			required: true,
			match: [
				/^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-((19[0-9]{2})|(20([0-1][0-9]|2[0-2])))$/,
				'Please fill a valid birthday',
			],
		},
	},
	{ versionKey: false, timestamps: true }
);

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
	const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
	return !!user;
};

userSchema.statics.isPhoneTaken = async function (phone, excludeUserId) {
	const user = await this.findOne({ phone, _id: { $ne: excludeUserId } });
	return !!user;
};

userSchema.statics.paginate = async function (filter, options) {
	let sort = '';

	if (options.sortBy) {
		const sortingCriteria = [];
		options.sortBy.split(',').forEach((sortOption) => {
			const [key, order] = sortOption.split(':');
			sortingCriteria.push((order === 'desc' ? '-' : '') + key);
		});
		sort = sortingCriteria.join(' ');
	} else {
		sort = 'createdAt';
	}

	const limit =
		options.limit && parseInt(options.limit, 10) > 0
			? parseInt(options.limit, 10)
			: 10;

	const page =
		options.page && parseInt(options.page, 10) > 0
			? parseInt(options.page, 10)
			: 1;

	const skip = (page - 1) * limit;

	const countPromise = this.countDocuments(filter).exec();
	let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);

	if (options.populate) {
		options.populate.split(',').forEach((populateOption) => {
			docsPromise = docsPromise.populate(
				populateOption
					.split('.')
					.reverse()
					.reduce((a, b) => ({ path: b, populate: a }))
			);
		});
	}

	docsPromise = docsPromise.exec();

	return Promise.all([countPromise, docsPromise]).then((values) => {
		const [totalResults, results] = values;
		const totalPages = Math.ceil(totalResults / limit);
		const result = {
			results,
			page,
			limit,
			totalPages,
			totalResults,
		};

		return Promise.resolve(result);
	});
};

const User = model('user', userSchema);

export default User;
