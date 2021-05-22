<p>This plugin adds the ability to encrypt your tiddlers individually. This have several advantages:</p><ul><li>You can specify a different password for each tiddler if you want.</li><li>You don&#39;t have to encrypt your whole wiky.</li><li>If you forget your password, you only lose a tiddler.</li><li>It&#39;s possible to edit the tiddler content , tags and fields <strong>except the encrypt field</strong> after encryption. Decrypting your tiddler will restore it to its original state when you encrypted it. This way you can hide the encrypted tiddlers as a &quot;different&quot; thing.</li><li>You can even encrypt images.</li><li>You can have sensible data in a day to day wiky.</li><li>I didn&#39;t try this, but theoretically you can apply double encryption by encrypting your wiki too.</li></ul>


# Develop
Use `yarn` to install dependencies.

This uses gulp with gulp-tw plugin for easier TW development.

To build just run: `yarn build`

To start development with hot reloading run `yarn watch`

Edit the files under `src` NOT `plugins/*`