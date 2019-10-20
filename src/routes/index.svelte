<script>

  export let user;
  let identity;

  import { onMount } from "svelte";
  onMount(() => {
    if (window.netlifyIdentity) {
      identity = window.netlifyIdentity;
      identity.on("init", user => {
        if (!user) {
          identity.on("login", () => (user = identity.currentUser()));
        }
      });
    }
  });

  function handleUserAction(action) {
    if (action == "login" || action == "signup") {
      identity.open(action);
      identity.on("login", user => {
        identity.close();
      });
    } else if (action == "logout") {
      identity.logout();
    }
  }
</script>

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

  div.holder {
    margin: 0 auto;
    padding: 1rem 0;
    width: 100%;
    text-align: center;
  }

  a,
  p {
    margin-block-end: 1rem;
  }
</style>

<svelte:head>
  <title>Great success!</title>
</svelte:head>

<div data-netlify-identity-menu></div>

<h1>Great success!</h1>

<figure>
  <img alt="Borat" src="great-success.png" />
  <figcaption>HIGH FIVE!</figcaption>
</figure>

{#if user}
  <div class="holder">
    <a
      href="users"
      class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4
      border border-gray-400 rounded shadow outline-none focus:outline-none">
      Check users
    </a>
  </div>
{:else}
  <div class="holder">
    <p>You are not logged in.</p>
    <div>
    <div data-netlify-identity-button>Login with Netlify Identity</div>
      <!-- <button
        class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4
        border border-gray-400 rounded shadow outline-none focus:outline-none"
        on:click={() => handleUserAction('login')}>
        Log In
      </button>
      <button
        class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4
        border border-gray-400 rounded shadow outline-none focus:outline-none"
        on:click={() => handleUserAction('signup')}>
        Sign Up
      </button> -->
    </div>
  </div>
{/if}
