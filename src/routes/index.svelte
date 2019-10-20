<script>
  let identity;
  if (window) {
    const { netlifyIdentity } = window;
    identity = netlifyIdentity;
  }

  function handleUserAction(action) {
    if (action == "login" || action == "signup") {
      netlifyIdentity.open(action);
      netlifyIdentity.on("login", user => {
        netlifyIdentity.close();
      });
    } else if (action == "logout") {
      netlifyIdentity.logout();
    }
  }
  export let user = identity.currentUser();
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

  a {
    margin-block-end: 1rem;
  }
</style>

<svelte:head>
  <title>Great success!</title>
  <script src="https://identity.netlify.com/v1/netlify-identity-widget.js">

  </script>
</svelte:head>
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
    <div>
      <button
        class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4
        border border-gray-400 rounded shadow outline-none focus:outline-none"
        on:click={() => handleUserAction('logout')}>
        Log Out
      </button>
    </div>
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
      <button
        class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4
        border border-gray-400 rounded shadow outline-none focus:outline-none"
        on:click={() => handleUserAction('signup')}>
        Sign Up
      </button>
    </div>
  </div>
{/if}
