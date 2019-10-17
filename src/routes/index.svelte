<style>
  h1,
  figure {
    text-align: center;
    margin: 0 auto;
  }

  h1 {
    font-size: 2.8em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  figure {
    margin: 0 0 1em 0;
  }

  img {
    width: 100%;
    max-width: 400px;
    margin: 1rem auto;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }

  div.button {
    margin: 0 auto;
    padding: 1rem 0;
    width: 100%;
    text-align: center;
  }
</style>

<svelte:head>
  <title>Great success!</title>
</svelte:head>

<h1>Great success!</h1>

<figure>
  <img alt="Borat" src="great-success.png" />
  <figcaption>HIGH FIVE!</figcaption>
</figure>

<div class="button">
  <a
    href="users"
    class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4
    border border-gray-400 rounded shadow outline-none focus:outline-none">
    Check users
  </a>
</div>
