import { randomBytes } from 'crypto';
import fs from 'fs';

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { ANIMES_FILE_PATH } from '../../constants/constants';
import { IAnime } from '../../interfaces/anime';
import { idGenerator } from '../../utils/idGenerator';

//Realiza uma validação no corpo da requisição

type ID = 'id' | 'rootId';

const bodyValidation: yup.ObjectSchema<Omit<IAnime, ID>> = yup.object().shape({
	name: yup.string().required().min(1),
	episodes: yup.number().required().min(1),
	seasons: yup.number().required().min(1),
	note: yup.number().required().min(0),
});

export const create = async (req: Request<{}, {}, IAnime>, res: Response) => {
	let validateData: IAnime | undefined = undefined;

	try {
		validateData = (await bodyValidation.validate(req.body, { stripUnknown: true })) as IAnime;

		const rootId = randomBytes(8).toString('hex');
		validateData.rootId = rootId;

		validateData.id = idGenerator();
	} catch (error) {
		const yupError = error as yup.ValidationError;

		return res.json({
			errors: {
				default: yupError.message,
			},
		});
	}

	let animes: IAnime[] = [];
	try {
		const data = fs.readFileSync(ANIMES_FILE_PATH, 'utf-8');
		animes = JSON.parse(data);
	} catch (error) {
		console.log('Erro ao ler o arquivo JSON:', error);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: 'Erro interno do servidor' });
	}

	try {
		const lastAnime = animes[animes.length - 1];
		const lastId = lastAnime ? lastAnime.id : 0;

		const newId = lastId + 1;
		validateData.id = newId;

		animes.push(validateData);

		fs.writeFileSync(ANIMES_FILE_PATH, JSON.stringify(animes, null, 2));
	} catch (error) {
		console.log('Erro ao inserir o anime ao arquivo JSON: ', error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: 'Erro interno no servidor',
		});
	}
	console.log(validateData);
	return res.status(StatusCodes.CREATED).json(validateData.id);
};
