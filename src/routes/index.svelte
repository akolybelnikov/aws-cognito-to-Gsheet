<script>
  import { onMount } from "svelte";
  import { user } from "../store/index.js";
  import { goto } from "@sapper/app";
  const netlifyIdentity = require("netlify-identity-widget");

  export let loggedIn = false;

  onMount(() => {
    if (typeof window !== "undefined") {
      const { netlifyIdentity } = window;
      netlifyIdentity.on("error", err => console.error("Error", err));
      user.subscribe(() => {
        loggedIn = !!netlifyIdentity.currentUser();
        netlifyIdentity.close();
      });
    }
  });

  function handleUserAction(action) {
    const { netlifyIdentity } = window;
    if (action == "login" || action == "signup") {
      netlifyIdentity.open(action);
      netlifyIdentity.on("login", u => {
        user.login(u);
        user.subscribe(() => {
          loggedIn = !!netlifyIdentity.currentUser();
          netlifyIdentity.close();
        });
      });
    } else if (action == "logout") {
      user.logout();
      netlifyIdentity.logout();
      loggedIn = false;
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

<h1>Great success!</h1>

<figure>
  <img alt="Borat" src="great-success.png" />
  <figcaption>HIGH FIVE!</figcaption>
</figure>

{#if loggedIn}
  <div class="holder flex flex-col">
    <a
      href="users"
      class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4
      border border-gray-400 rounded shadow outline-none focus:outline-none">
      Check users
    </a>
    <button
      class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4
      border border-gray-400 rounded shadow outline-none focus:outline-none"
      on:click={() => handleUserAction('logout')}>
      Log out
    </button>
  </div>
{:else}
  <div class="holder">
    <p>You are not logged in.</p>
    <div>
      <button
        class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4
        border border-gray-400 rounded shadow outline-none focus:outline-none"
        on:click={() => handleUserAction('login')}>
        Log In
      </button>
    </div>
  </div>
{/if}
