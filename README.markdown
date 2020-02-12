<!-- -*- tab-width: 4; indent-tabs-mode: nil; -*- -->
# MenheraComponents

A simple next-gen Web frontend framework by Menhera.org

## Use (Git)

Please add this repository as a Git submodule at `/_menhera` on the top directory of your app.

    docroot$ # In your app's root directory
    docroot$ git submodule add https://github.com/menhera-org/MenheraComponents.git _menhera

Then make a symbolic link to our `_menhera_sw.js` at `/_menhera_sw.js`. This will be our ServiceWorker. (Find out [why](https://developers.google.com/web/ilt/pwa/introduction-to-service-worker#registration_and_scope).)

    docroot$ ln -s _menhera/_menhera_sw.js ./


