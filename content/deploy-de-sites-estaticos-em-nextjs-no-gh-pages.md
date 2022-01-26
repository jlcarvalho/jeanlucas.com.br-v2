---
title: "Deploy de sites estáticos em Next.js no GH Pages"
date: 2022-01-22T21:12:52-03:00
draft: false
slug: "deploy-de-sites-estaticos-em-nextjs-no-gh-pages"
---

Nessa semana precisei realizar o deploy da nova versão do [meu guia front end em português](https://jlcarvalho.github.io/guia-frontend/) no Github Pages usando as Github Actions e, meu amigo, passei um certo sufoco pois o guia foi escrito em Next.js e tem alguns segredos para conseguirmos deixar tudo rodando da forma esperada. Por isso estou escrevendo esse post para a posteridade. Espero que as gerações futuras usufruam das descobertas dessa minha pequena conquista. 😄

Atualmente o guia é composto de uma página estática com diversos links, ou seja, é bem simples. Então o fluxo que imaginei foi:

![Fluxo de deploy esperado](https://user-images.githubusercontent.com/1238663/150659544-61884b7f-adf5-48fc-8c44-a35614e642c6.png)

Então escrevi um workflow para uma action de deploy e ele ficou assim:

<script src="https://gist.github.com/jlcarvalho/407edac3428ecc53747304cad93b791b.js?file=deploy.yml"></script>

Note que na minha Action acabei chamando apenas o comando `yarn build` pois no [meu package.json](https://github.com/jlcarvalho/guia-frontend/blob/master/package.json) o script de `build` está configurado para realizar tanto o `build` quanto o `export` do Next.js.

## Simples, né?

![Achou errado otário!](https://user-images.githubusercontent.com/1238663/150659537-fd6062dd-2c6a-4cb9-97ab-f12690edc673.gif)

Como no Github Pages os sites não ficam na raiz do domínio, o Next.js precisa de algumas configurações para conseguir gerar os arquivos com as referências corretas e, além disso, o Github Actions foi feito para trabalhar com projetos Jekyll por padrão e o Jekyll ignora arquivos e diretórios que iniciam com `_` como a pasta `/_next`, que é onde ficam todos os arquivos gerados pela build do Next.js.

![Screenshot da aplicação sem conseguir carregar arquivos estáticos](https://user-images.githubusercontent.com/1238663/150659547-9d1a502c-dbfb-451b-bbfb-980c7e4f2203.png)

## Ok, mas como resolver?

O primeiro passo é adicionar uma configuração para o Github saber que o deploy não é de uma aplicação Jekyll, para isso nós iremos adicionar um arquivo chamado `.nojekyll` no diretório `/public`. Dessa forma, quando o Next.js realizar o build de nossa aplicação ele adicionará esse arquivo na raiz do output da build.

Além disso, ao realizar o deploy de uma aplicação Next.js em um diretório que é diferente da raiz, é necessário configurar o [`basePath`](https://nextjs.org/docs/api-reference/next.config.js/basepath) do projeto. Então, no meu caso precisei adicionar o valor `guia-frontend` a ele, que é o nome do meu repositório no Github.

Porém, o `basePath` não altera o caminho para os assets (arquivos css, js e imagens no nosso caso) da sua aplicação e é aí que entra o [`assetPrefix`](https://nextjs.org/docs/api-reference/next.config.js/cdn-support-with-asset-prefix). Com ele nós conseguimos especificar um diretório ou domínio onde nossos assets estarão presentes. 

No caso do Github Pages, ambos os valores serão o nome do seu repositório precedido de `/`.

<script src="https://gist.github.com/jlcarvalho/407edac3428ecc53747304cad93b791b.js?file=next.config.js"></script>

Para finalizar, também adicionei uma condição para garantir que esses parâmetros só seriam aplicados a configuração do Next.js em produção. Assim, em ambiente de desenvolvimento os arquivos do projeto seriam servidos a partir da raiz, como normalmente acontece em projetos que utilizam o Next.js.

## Voilá

![Sreenshot do guia front end funcionando](https://user-images.githubusercontent.com/1238663/150659561-c08d0e29-0012-4fe2-b334-700d2f915d20.png)

E agora tudo funciona como o esperado. Tanto em produção quanto no ambiente de desenvolvimento local. Espero que esse artigo tenha ajudado alguém e qualquer dúvida ou sugestão estou a disposição em [@444jeans](https://twitter.com/444jeans).

Ps.: Vale ressaltar que tive problemas com arquivos referenciados pelos meus estilos css ao usar a função `url()`. O Next.js não estava adicionando o `assetPrefix` no caminho para esses arquivos devido a [um bug ainda não resolvido](https://github.com/vercel/next.js/issues/24952), então tive que [mudar a implementação](https://github.com/jlcarvalho/guia-frontend/commit/b3b9245625eb9acf511a3c960ded0b17c12624f0).

## Referências

- [https://dev.to/jameswallis/deploying-a-next-js-app-to-github-pages-24pn](https://dev.to/jameswallis/deploying-a-next-js-app-to-github-pages-24pn)
- [https://medium.com/front-end-weekly/ci-cd-with-github-actions-to-deploy-on-github-pages-73e225f8f131](https://medium.com/front-end-weekly/ci-cd-with-github-actions-to-deploy-on-github-pages-73e225f8f131)

