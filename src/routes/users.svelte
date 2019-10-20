<script>
  import { goto } from "@sapper/app";
  import { onMount } from "svelte";
  import { user } from "../store/index.js";

  let loading = true;
  let users = [];

  onMount(async () => {
    if (typeof window !== "undefined") {
      const { netlifyIdentity } = window;
      user.subscribe(async () => {
        if (netlifyIdentity.currentUser()) {
          console.log(netlifyIdentity.currentUser());
          let res = await fetch(`/.netlify/functions/users`);
          let resJson = await res.json();
          const { body, msg } = resJson;

          if (body && msg === "success") {
            users = [...users, ...Object.values(body)];
          }
          loading = false;
        } else {
          goto("/");
        }
      });
    }
  });
</script>

<style>
  h2,
  h3 {
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
            date: {cat.created}
            <br />
            name: {cat.name}
            <br />
            verified: {cat.verified}
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
