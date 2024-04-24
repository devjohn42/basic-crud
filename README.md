# API REST - Criador de Anime

Uma simples api-rest para cadastro de animes

## 🗺 Rotas - EndPoints

Requisições para a API devem seguir os padrões:

| Método - Path                    | Descrição                                                      |
| -------------------------------- | -------------------------------------------------------------- |
| `POST` **_/create-anime_**       | Cria um registro de anime.                                     |
| `GET` **_/animes_**              | Retorna informações de todos os animes registrados.            |
| `GET` **_/anime/:id_**           | Retorna informações do anime registrado com id correspondente. |
| `PUT` **_/update-anime/:id_**    | Atualiza dados de um anime registrado.                         |
| `DELETE` **_/delete-anime/:id_** | Remove um anime registrado no arquivo json.                    |

### ⌨ Comandos

#### Clonar o projeto

```
git clone git@github.com:devjohn42/basic-crud.git
```

#### Instalar todas as dependências

```
npm install
```

#### Iniciar o Servidor Localmente

```
npm run server:dev
```

#### Resetar o arquivo animes.json

```
npm run reset-db
```

#### Aplicar o lint em todo o projeto

```
npm run lint:fix
```

### 🛠 Ferramentas Utilizadas

- Node.js
- Express.js
- Typescript
- Yup

### 🤝🏻 Contribuições

Contribuições são bem-vindas! Se você encontrar um problema ou desejar adicionar novos recursos, sinta-se à vontade para criar um Pull Request.

### Licença

Este projeto está licenciado sob a Licença ISC.
