<script>
	import { onMount } from 'svelte';

	// let emails = [];

	onMount(async () => {
    let emails = await fetch(`/.netlify/functions/users`);
    console.log(emails)
	});
</script>

<style>
  h1,
  figure,
  p {
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
    margin: 0 0 1em 0;
  }

  p {
    margin: 1em auto;
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
  <title>Users</title>
</svelte:head>

<div class="emails">

</div>

<div class="button">
  <a
    href="/"
    class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4
    border border-gray-400 rounded shadow outline-none focus:outline-none">
    Check again
  </a>
</div>
