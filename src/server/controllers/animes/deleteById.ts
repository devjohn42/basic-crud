import fs from 'fs';

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { ANIMES_FILE_PATH } from '../../constants/constants';
import { IAnime } from '../../interfaces/anime';
import { IByIdProps } from '../../interfaces/byId';

export const deleteByIdValidation = async (req: Request<IByIdProps>) => {
	await yup
		.object()
		.shape({
			id: yup.number().required().integer().moreThan(0),
		})
		.validate(req.params);
};

export const deleteById = async (req: Request<IByIdProps>, res: Response) => {
	try {
		await deleteByIdValidation(req);
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Requisição feita de forma errada' });
	}

	const animeId = Number(req.params.id);

	try {
		const data = fs.readFileSync(ANIMES_FILE_PATH, 'utf-8');
		let animes: IAnime[] = JSON.parse(data);

		const animeDeletedIndex = animes.findIndex((a) => a.id === animeId);
		if (animeDeletedIndex === -1) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: 'Anime não encontrado',
			});
		}

		animes.splice(animeDeletedIndex, 1);

		animes = animes.map((anime, idx) => {
			return { ...anime, id: idx + 1 };
		});

		fs.writeFileSync(ANIMES_FILE_PATH, JSON.stringify(animes, null, 2));

		return res.json({ message: 'Anime deletado com sucesso' });
	} catch (error) {
		console.log('Erro ao ler ou escrever o arquivo JSON:', error);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: 'Erro interno do servidor' });
	}
};
