<script context="module">
  export async function preload() {
    const cognito_request = this.fetch("/cognito/cognito");
    const google_request = this.fetch("/cognito/google-fetch");

    const cognito = await cognito_request;
    const google = await google_request;

    const cognito_users = await cognito.json();
    const google_users = await google.json();

    const users = [];

    if (
      cognito_users.length &&
      google_users.length &&
      google_users.length < cognito_users.length
    ) {
      let diff = cognito_users.filter(
        user => !google_users.includes(user.email.toLowerCase())
      );
      let data = diff.map(userdata => Object.values(userdata));
      await this.fetch("/cognito/google-post", {
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      return { users: diff };
    }

    return { users };
  }
</script>

<script>
  import { onMount } from "svelte";

  let loading = true;
  export let users;

  onMount(() => {
    if (users) loading = false;
  });
</script>

<style>
  h2 {
    text-align: center;
  }

  h2 {
    font-size: 1.75em;
    text-transform: uppercase;
    font-weight: 500;
    margin: 0 0 0.5em 0;
  }

  h3 {
    font-size: 1.25em;
    text-transform: uppercase;
    font-weight: 500;
    padding: 1.5em 0;
  }

  @media (min-width: 480px) {
    h2 {
      font-size: 2.5em;
    }
  }

  div.button,
  div.emails {
    margin: 0 auto;
    padding: 1rem 0;
    width: 100%;
    text-align: center;
  }

  div.emails {
    min-height: 200px;
    padding-block-start: 20%;
  }

  ol {
    max-width: 80%;
    text-align: left;
    margin: 0 auto;
  }

  li {
    margin-block-end: 1rem;
  }

  blockquote {
    background: #eee;
  }

  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }

  div.spinner {
    position: relative;
  }

  .spinner:before {
    content: "";
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: calc(50% - 15px);
    width: 50px;
    height: 50px;
    margin-top: -10px;
    margin-left: -10px;
    border-radius: 50%;
    border: 2px solid #ccc;
    border-top-color: #000;
    animation: spinner 0.6s linear infinite;
  }
</style>

<svelte:head>
  <title>Users</title>
</svelte:head>

<div class="emails">
  {#if loading}
    <div class="spinner" />
  {:else if users.length}
    <h2>There are new users:</h2>
    <ol class="list-decimal">
      {#each users as cat}
        <li>
          <blockquote>
            name: {cat.name}
            <br />
            created: {cat.created}
            <br />
            email verified: {cat.email_verified}
          </blockquote>
        </li>
      {/each}
    </ol>
    {#if users.length}
      <h3>We have put them in the Google table</h3>
    {/if}
  {:else}
    <h2>There are no new users...</h2>
  {/if}
</div>

<div class="button">
  <a
    href="/"
    class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4
    border border-gray-400 rounded shadow outline-none focus:outline-none">
    Done!
  </a>
</div>
