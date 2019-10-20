import { writable } from "svelte/store";

function createUser() {
  if (typeof window !== "undefined") {
    const localUser = JSON.parse(localStorage.getItem("gotrue.user"));
    console.log('local user on init', localUser)
    let u = null;
    if (localUser) {
      u = {
        username: localUser.user_metadata.full_name,
        email: localUser.email,
        access_token: localUser.token.access_token,
        expires_at: localUser.token.expires_at,
        refresh_token: localUser.token.refresh_token,
        token_type: localUser.token.token_type
      };
    }
    const { subscribe, set } = writable(u);

    return {
      subscribe,
      login(user) {
        const currentUser = {
          username: user.user_metadata.full_name,
          email: user.email,
          access_token: user.token.access_token,
          expires_at: user.token.expires_at,
          refresh_token: user.token.refresh_token,
          token_type: user.token.token_type
        };
        console.log('local user on login', localUser)
        set(currentUser);
      },
      logout() {
        console.log('logging out ...')
        set(null);
      }
    };
  } else {
    console.log('no window object')
  }
}

// function createRedirectURL() {
//   const { subscribe, set } = writable("");
//   return {
//     subscribe,
//     setRedirectURL(url) {
//       set(url);
//     },
//     clearRedirectURL() {
//       set("");
//     }
//   };
// }

export const user = createUser();
// export const redirectURL = createRedirectURL();
