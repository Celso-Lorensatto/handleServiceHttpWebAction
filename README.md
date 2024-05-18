# Service Http Web Actions

biblioteca simples para lidar com requisições para soluções web pensadas para browser.

a finalidade desta lib é para integrar serviços SAAS (Software as a Serviçes) com api's ou para fazer integrações com multiplos serviços.

## Como usar ?

Abaixo é o padrão da estrutura do objeto que deve ser seguida para que a lib possa exercer a sua função .

```json
{
  "[nome_do_serviço]": {
    "headers": {},
    "actions": {
      "[noma_da_acao]": {
        "url": "",
        "headers": {},
        "body": {},
        "fieldsMap": {
          "body": {
            "[nome_do_campo]": ["referencia1", "referencia2"]
          },
          "headers": {}
        }
      }
    }
  }
}
```

> imaginamos que o objeto assim esteja atribuido a uma variável **data**

```typescript
const shwa = new SHWA(data);
```

> Após isso, é só ultilizar a função principal da lib que é **handleServiceHttpWebAction()**

---

## Exemplo

> Imaginamos o seguinte Cenário:

```json
{
  "Serviço": {
    "headers": {
      "header1";"valor Padrão para a plataforma inteira"
    },
    "actions": {
      "criar": {
        "url": "https://servico.com/criar",
        "method":"post",
        "headers": {
          "header2:":"header específico daquela action"
        },
        "body": {
          "codigo":"837129837"
        },
        "fieldsMap": {
          "body": {
            "nome": ["name", "tag[name]"],
            "id":["id"]
          },
          "headers": {}
        }
      }
    }
  }
}
```

> agora vamor executar esta ação pelo código:

```typescript
await shwa.handleServiceHttpWebAction("Serviço", "criar", {
  body: {
    nome: "usuario",
    id: "44",
  },
});
```

> a requisição ficara assim :

```json
{
  "url": "https://servico.com/criar",
  "method":"post",
  "headers":{
    "header1";"valor Padrão para a plataforma inteira",
     "header2:":"header específico daquela action"
  },
  "body"{
    "codigo":"837129837",
    "name":"usuario",
    "tag[name]":"usuario",
    "id":"44"
  }
}
```
