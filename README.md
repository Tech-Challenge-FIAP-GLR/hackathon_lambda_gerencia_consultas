# Documentação da API Health&Med

Esta documentação fornece uma visão geral dos endpoints da API Health&Med e seu uso.

## URL Base

```
https://pikwe9lct4.execute-api.us-east-1.amazonaws.com/prod
```

## Autenticação

Para acessar os endpoints da API, você precisa incluir um token de portador no cabeçalho `Authorization` das suas requisições. O token pode ser obtido fazendo uma requisição GET para o endpoint de autenticação apropriado:

- Para médicos: `/token/medico`
- Para pacientes: `/token/paciente`

## Endpoints

### Consultas

#### Criar uma consulta pendente (Paciente)

- Método: `POST`
- Endpoint: `/consultas`
- Autenticação: Token de portador do paciente
- Corpo da requisição:
  ```json
  {
    "paciente_id": "111",
    "medico_id": "543",
    "data_hora_id": "1"
  }
  ```

#### Obter todas as consultas de um paciente

- Método: `GET`
- Endpoint: `/consultas/paciente`
- Autenticação: Token de portador do paciente

#### Obter consultas de um paciente por ID

- Método: `GET`
- Endpoint: `/consultas/paciente?paciente_id={paciente_id}`
- Autenticação: Token de portador do paciente

#### Cancelar uma consulta (Paciente)

- Método: `DELETE`
- Endpoint: `/consultas/{consulta_id}`
- Autenticação: Token de portador do paciente

#### Obter todas as consultas de um médico

- Método: `GET`
- Endpoint: `/consultas/medico`
- Autenticação: Token de portador do médico

#### Obter consultas de um médico por ID

- Método: `GET`
- Endpoint: `/consultas/medico/{medico_id}`
- Autenticação: Token de portador do médico

#### Aceitar uma consulta (Médico)

- Método: `POST`
- Endpoint: `/consultas/aceitar`
- Autenticação: Token de portador do médico
- Corpo da requisição:
  ```json
  {
    "consulta_id": "1721871568731",
    "medico_id": "789"
  }
  ```

#### Cancelar uma consulta (Médico)

- Método: `POST`
- Endpoint: `/consultas/cancelar`
- Autenticação: Token de portador do médico
- Corpo da requisição:
  ```json
  {
    "consulta_id": "1721950956772"
  }
  ```

Espero que esta documentação seja útil para entender e utilizar a API Health&Med. Se você tiver alguma dúvida adicional, não hesite em perguntar.
