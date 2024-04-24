import fs from 'fs';

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { ANIMES_FILE_PATH } from '../../constants/constants';
import { IAnime } from '../../interfaces/anime';
import { IByIdProps } from '../../interfaces/byId';

export const updateByIdValidation = async (req: Request<IByIdProps>) => {
	await yup
		.object()
		.shape({
			id: yup.number().required().integer().moreThan(0),
			name: yup.string().required().min(1),
			episodes: yup.number().required().min(1),
			seasons: yup.number().required().min(1),
			note: yup.number().required().min(0),
		})
		.validate({ ...req.params, ...req.body });
};

export const updateById = async (req: Request<IByIdProps & Partial<IAnime>>, res: Response) => {
	try {
		await updateByIdValidation(req);
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Requisição feita de forma errada' });
	}

	const animeId = Number(req.params.id);

	try {
		const data = fs.readFileSync(ANIMES_FILE_PATH, 'utf-8');
		const animes: IAnime[] = JSON.parse(data);

		const animeUpdatedIndex = animes.findIndex((a) => a.id === animeId);
		if (animeUpdatedIndex === -1) {
			return res.status(StatusCodes.NOT_FOUND).json({ error: 'Anime não encontrado' });
		}

		animes[animeUpdatedIndex] = { ...animes[animeUpdatedIndex], ...req.body };

		fs.writeFileSync(ANIMES_FILE_PATH, JSON.stringify(animes, null, 2));

		return res.json({ message: 'Anime atualizado com sucesso' });
	} catch (error) {
		console.log('Erro ao ler ou escrever o arquivo JSON: ', error);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: 'Erro interno do servidor' });
	}
};
