import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const contactSchema = Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
		},
		phone: {
			type: String,
			required: true,
			unique: true,
		},
		favorite: {
			type: Boolean,
			required: false,
			default: false,
		},
	},
	{ versionKey: false, timestamps: true }
);

contactSchema.statics.isEmailTaken = async function (email, excludeContactId) {
	const contact = await this.findOne({ email, _id: { $ne: excludeContactId } });
	return !!contact;
};

contactSchema.statics.isPhoneTaken = async function (phone, excludeContactId) {
	const contact = await this.findOne({ phone, _id: { $ne: excludeContactId } });
	return !!contact;
};

contactSchema.statics.paginate = async function (filter, options) {
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

const Contact = model('contact', contactSchema);

export default Contact;
