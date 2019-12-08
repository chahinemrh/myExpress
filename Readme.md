<p align="center">
  <img src="./assets/myExpress.png" />
</p>

## <a name='TOC'>🐼 Summary</a>

- [Rules](#rules)
- [Overview](#overview)
- [Story](#story)
- [Credits](#credits)

## <a name='overview'>🦊 Rules</a>

Hi, here are some rules to carry out this story oav;

- You **MUST** create a git repository named `myExpress`
- You **MUST** create a file called `.author.json` with your username followed by a newline:

```sh
~/codeflix/onecode/myExpress ❯❯❯ cat -e .author.json
{
  "username": "majdi"
}$
```

> Of course, you can talk about the subject with other developers, peer-learning is
> the key to be a better developer. Don't hesitate to ask questions or help people in
> the channel **izi-learning-network**

> Don't forget, there is no useless question :-)

## <a name='overview'>🐱 Overview</a>

The purpose of this challenge is to (re)create a HTTP client server.
You **HAVE TO** use Javascript and the **http** node package

## <a name='story'>🐨 Story</a>

#### From express to myExpress

The `express()` function is a top-level function exported by the express module.

```js
const express = require('./my-express')
const app = express()
```

You **HAVE TO** browse the real [express API](https://expressjs.com)

##### Basics

You **HAVE TO** and handle the following properties:

- `app.get()`
- `app.post()`
- `app.put()`
- `app.delete()`
- `app.all()`
- `app.listen()`

#### Rendering

You **HAVE TO** add a render method that follow express rules:

```js
app.render('home', (err, html) => {
  // ...
})

app.render('home', { name: 'Ch0pper' }, (err, html) => {
  // ...
})
```

The first parameters **HAVE TO** found an `html.mustache` file on a directory called pages.

What is **mustache** ? Well, it's your new handmade template engine, #braaaaaah :-)
When the second parameter is an object, you **MUST** replace all mustache template keys by their values ;

Exemple :

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Hello Bulma!</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css">
    <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>
  </head>
  <body>
  <section class="section">
    <div class="container">
      <h1 class="title">
        Hello World
      </h1>
      <p class="subtitle">
        <h1>Hello {{name}}</h1>
      </p>
    </div>
  </section>
  </body>
</html>
```

Well, you will replace **name** by **Chopper**.

## <a name='bonus'>🦄 Bonus</a>

#### Really cool

A sexy template thing is to add through a pipe (|) what we called a **modifier**.
You have to handle the following modifier:

- `upper`
- `lower`
- `fixed:n`x1

For the fixed example, you **HAVE TO** handle args separate by **:**.

Exemple:

```js
app.render('home', { name: 'Ch0pper', weight: 33.1337 }, (err, html) => {
  // ...
})
```

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Efrei</title>
    <meta
      name="description"
      content="This is an example of a meta description."
    />
    <link rel="stylesheet" type="text/css" href="main.css" />
  </head>
  <body>
    <h1>Hello {{name}}, my weight is {{weight | fixed:2 }}</h1>
  </body>
</html>
```

> Weight displayed will be **33.13**

#### Advanced

Now you can andle the `app.use` method for middleware.
This method take a callback with the following signature:

```js
function (req, res, next) {
  console.log('Time: %d', Date.now())
  next()
}
```

> What is next ? ;)

Other things, in bulk:

- Add mustache features like if/else, for-loop, etc.x1x
- Add more express to myExpress features

## <a name='credits'>🐵 Credits</a>

Craft by **Majdi** with :heart: in **Paris**.
