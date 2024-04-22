import fs from 'fs';

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { ANIMES_FILE_PATH } from '../../constants/constants';
import { IAnime } from '../../interfaces/anime';

interface IQueryProps {
	page?: number;
	limit?: number;
}

export const getAllValidation = async (req: Request<{}, {}, {}, IQueryProps>) => {
	await yup
		.object()
		.shape({
			page: yup.number().optional().positive().integer().moreThan(0),
			limit: yup.number().optional().positive().integer(),
		})
		.validate(req.query);
};

export const getAll = async (req: Request<{}, {}, {}, IQueryProps>, res: Response) => {
	const { page = 1, limit = 10 } = req.query;

	//Validação dos parâmetros de consulta
	try {
		await getAllValidation(req);
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Requisição feita de forma errada' });
	}

	let animes: IAnime[] = [];
	try {
		const data = fs.readFileSync(ANIMES_FILE_PATH, 'utf-8');
		animes = JSON.parse(data);

		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;
		const paginatedAnimes = animes.slice(startIndex, endIndex);

		return res.json(paginatedAnimes);
	} catch (error) {
		console.log('Erro ao ler o aquivo JSON', error);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: 'Erro interno do servidor' });
	}
};
