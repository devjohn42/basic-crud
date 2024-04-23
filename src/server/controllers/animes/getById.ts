import fs from 'fs';

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { ANIMES_FILE_PATH } from '../../constants/constants';
import { IAnime } from '../../interfaces/anime';

interface IQueryProps {
	id?: string | null;
}

export const getByIdValidation = async (req: Request<IQueryProps>) => {
	await yup
		.object()
		.shape({
			id: yup.string().required().trim().matches(/^\d+$/),
		})
		.validate(req.params);
};

export const getById = async (req: Request<IQueryProps>, res: Response) => {
	try {
		await getByIdValidation(req);
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Requisição feita de forma errada' });
	}

	const animeId = req.params.id;

	let anime: IAnime | undefined;
	try {
		const data = fs.readFileSync(ANIMES_FILE_PATH, 'utf-8');
		const animes: IAnime[] = JSON.parse(data);

		anime = animes.find((a) => a.id === animeId);
	} catch (error) {
		console.log('Error ao ler o arquivo JSON:', error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: 'Error interno do servidor',
		});
	}

	if (!anime) {
		return res.status(StatusCodes.NOT_FOUND).json({ error: 'Anime não encontrado' });
	}

	return res.json(anime);
};
