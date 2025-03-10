# APIWeb

## Sumário

1. [Sobre o projeto](#Sobre-o-projeto)

2. [Dependências do projeto](#Dependências-do-projeto)

3. [Configurações](#Config)

4. [Configure o banco de dados](#Configure-o-banco-de-dados)

5. [Rodando o projeto](#Rodando-o-projeto)

6. [Buscar lojas próximas por CEP](#Buscar-lojas-próximas-por-CEP)

7. [Gravando uma Storeno banco de dados](#Gravando-uma-<span-style="color:green">Store</span>-no-banco-de-dados)

8. [Listar todas as Stores](#Listar-todas-as-Stores)

9. [Pesquisar ID](#Pesquisar-ID)

10. [Atualizar store](#Atualizar-Store)

11. [Deletar Store](#Deletar-Store)

12. [Erros](#Erros)

    

## Sobre o projeto

A API é capaz de realizar dotas as operações de CRUD para a entidade <span style="color:green">Stores</span>. Além disso é capaz de receber um CEP e indicar todas as Lojas cadastradas no banco de dados que estão em um raio de até 100km de distância do CEP informado pelo usuário. 

Projeto desenvolvido em Typescript.



## Dependências do projeto

* Node.jS v22.14.0

* axios - para consumo da API do [Via Cep](https://viacep.com.br/) e [Nominatim](https://nominatim.org/release-docs/develop/api/Overview/)

* dotenv - Para configuração das variáveis de ambiente.

* express - para lidar com as requisições Http;

* mongoose - Para conexão com o MongoDB

* winston - Para logger

## Config

* Clone o repositório do Github

  ```shell
  git clone git@github.com:Juliocoi/storeAPI.git
  cd storeAPI
  ```

* Baixe as dependências do projeto

  ```shell
  npm ci // requires package-lock.json
  npm install //caso o package-lock.json por algum motivo não estiver disponível
  ```

## Configure o banco de dados

Você precisará de uma conta no [MongoDB - Atlas](https://www.mongodb.com/atlas) e um cluster ativo para conectar ao banco de dados. Depois so cluster criado, em `connect>>drives`.

Crie um arquivo chamado **.env**, dentro da diretório`./src/config` e utilize seus dados  (senha do **cluster** + string de conexão) adquiridas no link acima, 

```shell
DATABASE_PASSWORD=<seu_password_aqui>

//substitua o <db_password> padrão pelo formato abaixo
DATABASE=mongodb+srv://<Nome_de_usuario>:<PASSWORD>@natours.imlx3.mongodb.net/?retryWrites=true&w=majority&appName=StoreAPI

```

## Rodando o projeto

Para rodar o projeto use o comando:

```shell
npm start
```

O projeto será executado em um servidor local na porta http://localhost:3000.



## Buscar lojas próximas por CEP

 Faça ima requisição do tipo <b><span style = "color:green">GET</span></b> na rota `/api/stores/:cep`

O endereço completo:

`http://localhost:3000/api/stores/52210-240`

Em caso de haver lojas próximo ao CEP indicado, você receberá um **HTTP status code 200** e um json com os dados conforme abaixo:

```json
{
    "status": "sucess",
    "result": 3, // indica a quantidade de documentos retornados
    "data": {
        "stores": [
            {
                "_id": "67ce88751e1952882047ca9d",
                "name": "Home Center Ferreira Costa Tamarineira",
                "address": "Rua Cônego Barata, 275",
                "bairro": "Tamarineira",
                "city": "Recife",
                "uf": "PE",
                "cep": "52051-020",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        -34.90284, // longitude
                        -8.03107 // latitude
                    ]
                },
                "distance": 1.2750905764254155 // distância exibida em Km
            },
            {
                "_id": "67ce88751e1952882047ca9e",
                "name": "Nova fábrica 4.2",
                "address": "Avenida Mal. Mascarenhas de Morais, 2967",
                "bairro": "Imbiribeira",
                "city": "Recife",
                "uf": "PE",
                "cep": "51150-905",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        -34.91093,
                        -8.11199
                    ]
                },
                "distance": 10.053416375209707
            },
            {
                "_id": "67ce88751e1952882047ca9c",
                "name": "Home Center Ferreira Costa João Pessoa",
                "address": "Rua Edgar Sáles Miranda Henriques, 345",
                "bairro": "Cabedelo",
                "city": "João Pessoa",
                "uf": "PB",
                "cep": "58310-000",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        -34.8305,
                        -7.16219
                    ]
                },
                "distance": 96.07455157202453
            }
        ]
    }
}
```



Caso não tenha nenhuma loja próximo:

**HTTP status code  200** e um json com a mensagem abaixo

```json
{
    "status": "sucess",
    "messagem": "Não há lojas em sua região"
}
```



Caso o CEP seja informado em um formato diferente do esperado (52210240 ou 52210-240):

**HTTP status code 404**:

```json
{
    "status": "fail",
    "message": "The format of postal code is invalid"
}
```



Caso o CEP tenha um formato válido, mas não exista no Brasil:

```json
{
    "status": "fail",
    "message": "CEP 55590-000 doen't exist"
}
```



## Gravando uma <span style="color:green">Store</span> no banco de dados

Todas as rotas da api podem ser encontradas em `./src/routes`

Para criar uma <span style="color:green">store</span>  utilize a rota **/api/store**:

`http://localhost:3000/api/store`

A requisição será do tipo <b><span style = "color:yellow">POST</span></b>. O payload da requisição seguirá o padrão **JSON** no seguinte formato:

```json
{
    "name": "Era uma casa muito engraçada",
    "address": "Rua dos Bobos, 0",
    "bairro": "BairroName",
    "city": "CidadeName",
    "uf": "PB",
    "cep": "58058-640",
    "longitude": -34.82144, 
    "latitude": -7.16379
}
```

Um ID será adicionado automatiamente pelo MongoDB.

Se o registro for efetuado com sucesso, você receberá o **HTTP status code 201**, com o retorno dos dados gravados. Formato **json** no modelo abaixo:

```json
{
    "name": "Era uma casa muito engraçada",
    "address": "Rua dos Bobos, 0",
    "bairro": "BairroName",
    "city": "CidadeName",
    "uf": "PB",
    "cep": "58058-640",
    "location": {
        "type": "Point",
        "coordinates": [
            -34.82144,
            -7.16379
        ]
    },
    "_id": "67cec16032b8c7a5ec61eed1",
    "createdAt": "2025-03-10T10:39:28.572Z",
    "updatedAt": "2025-03-10T10:39:28.572Z",
    "__v": 0
}
```



Caso algum item tenha sido omitido você receberá um **HTTP status code 500** e uma messagem de erro:

```json
{
    "error": "Store validation failed: name: Name required."
}
```



## Listar todas as <span style="color:green">Stores</span>

Para listar todas as cidades existentes no banco utilize uma requisição do tipo <b><span style = "color:green">GET</span></b> na rota **/api/stores**:

`http://localhost:3000/api/stores`

O retorno será um HTTP status code 200 e json:

```json
[
	"status": "sucess",
    "result": 1, // indica a quantidade de documentos retornados
    "data": {
        "listStores": [
            {
                "location": {
                    "type": "Point",
                    "coordinates": [
                        --34.82144,
                        -7.16379
                    ]
                },
								"_id": "67cec16032b8c7a5ec61eed1"
                "name": "Era uma casa muito engraçada",
                "address": "Rua dos Bobos, 0",
                "bairro": "BairroName",
                "city": "CidadeName",
                "uf": "PB",
                "cep": "58058-640",
                "createdAt": "2025-03-10T10:39:28.572Z",
                "updatedAt": "2025-03-10T10:39:28.572Z",
                "__v": 0
            },
				]
]
```

## Pesquisar ID

Requisição do tipo <b><span style = "color:green">**GET**</span></b>, na rota **/api/store/:id'**, 

`http://localhost:3000/api/store/67cec16032b8c7a5ec61eed1`

Se a requisição retornar um sucesso será retornado um HTTP status code 200 json.

```json
{
    "status": "sucess",
    "data": {
        "searchById": {
            "location": {
                "type": "Point",
                "coordinates": [
                        --34.82144,
                        -7.16379
                ]
            },
            "_id": "67cec16032b8c7a5ec61eed1"
            "name": "Era uma casa muito engraçada",
            "address": "Rua dos Bobos, 0",
            "bairro": "BairroName",
            "city": "CidadeName",
            "uf": "PB",
            "cep": "58058-640",
            "createdAt": "2025-03-10T10:39:28.572Z",
            "updatedAt": "2025-03-10T10:39:28.572Z",
            "__v": 0
        }
    }
}
```

Se o registro não existir no banco vc receberá um HTTP status code 404.

## Atualizar <span style="color:green">Store</span>

Para atualizar uma Store, enviar uma requisição do tipo <b><span style = "color:BLUE">**PUT**</span></b> no endereço **/api/store/:id**.

O payload deverá ser enviado em pelo body da requisição utilizando o formato.JSON com a informação que deseja atualizar.

```json
{
"name": "Nova fábrica 4.2"
}
```

Sucesso: **HTTP status code 200** e um json no mesmo formado do get com a informação atualizada.

## Deletar <span style="color:green">Store</span>

Para deletar uma cidade, enviar uma requisição do tipo <b><span style = "color:pink">**DEL**</span></b> no endereço **/api/store/:id**.

Sucess: HTTP status code 204. Apenas

Se nenhum ID for informado, será retornado um HTTP status code 405,

Se o ID informado não existir no banco será retornado um HTTP status code 404.

## Erros

Caso o id não seja informado, ou se infomado não existir no banco, você receberá um HTTP status error 400 no formato abaixo:

```json
{
    "status": "fail",
    "message": "Invalid ID"
}
```



