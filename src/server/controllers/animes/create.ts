import { Request, Response } from 'express';
import * as yup from 'yup';

interface IAnime {
	name: string;
	episodes: number;
	seasons: number;
	note: number;
}

//Realiza uma validação no corpo da requisição

const bodyValidation: yup.ObjectSchema<IAnime> = yup.object().shape({
	name: yup.string().required().min(1),
	episodes: yup.number().required().min(1),
	seasons: yup.number().required().min(1),
	note: yup.number().required().min(0),
});

export const create = async (req: Request<{}, {}, IAnime>, res: Response) => {
	let validateData: IAnime | undefined = undefined;

	try {
		validateData = await bodyValidation.validate(req.body);
	} catch (error) {
		const yupError = error as yup.ValidationError;

		return res.json({
			errors: {
				default: yupError.message,
			},
		});
	}
	console.log(validateData);
	return res.send(`Anime ${validateData.name} created`);
};
