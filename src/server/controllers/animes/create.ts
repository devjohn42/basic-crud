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

		validateData.id = idGenerator().toString();
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
			.json({ error: 'Error interno do servidor' });
	}

	//Adiciona o anime validado ao array de animes
	animes.push(validateData);

	//Escreve o array atualizado no arquivo JSON
	try {
		fs.writeFileSync(ANIMES_FILE_PATH, JSON.stringify(animes, null, 2));
		console.log('Anime inserido');
	} catch (error) {
		console.log('Erro ao escrever no arquivo JSON:', error);
		return res.status(500).json({ error: 'Erro interno do servidor' });
	}

	console.log(validateData);
	return res.json(validateData);
};
