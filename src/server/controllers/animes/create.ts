import { Request, Response } from 'express';
import * as yup from 'yup';
import fs from 'fs';
import { randomBytes } from 'crypto';

interface IAnime {
	id: string;
	name: string;
	episodes: number;
	seasons: number;
	note: number;
}

//Realiza uma validação no corpo da requisição

const bodyValidation: yup.ObjectSchema<Omit<IAnime, 'id'>> = yup.object().shape({
	name: yup.string().required().min(1),
	episodes: yup.number().required().min(1),
	seasons: yup.number().required().min(1),
	note: yup.number().required().min(0),
});

const animesFile = 'src/server/database/animes.json';

export const create = async (req: Request<{}, {}, IAnime>, res: Response) => {
	let validateData: IAnime | undefined = undefined;

	try {
		validateData = (await bodyValidation.validate(req.body, { stripUnknown: true })) as IAnime;

		const id = randomBytes(8).toString('hex');
		validateData.id = id;
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
		const data = fs.readFileSync(animesFile, 'utf-8');
		animes = JSON.parse(data);
	} catch (error) {
		console.log('Erro ao ler o arquivo JSON:', error);
		return res.status(500).json({ error: 'Error interno do servidor' });
	}

	//Adiciona o anime validado ao array de animes
	animes.push(validateData);

	//Escreve o array atualizado no arquivo JSON
	try {
		fs.writeFileSync(animesFile, JSON.stringify(animes, null, 2));
		console.log('Anime inserido');
	} catch (error) {
		console.log('Erro ao escrever no arquivo JSON:', error);
		return res.status(500).json({ error: 'Erro interno do servidor' });
	}

	console.log(validateData);
	return res.json(validateData);
};
