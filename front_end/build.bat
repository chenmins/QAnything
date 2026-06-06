pnpm i

echo module.exports = require('./v3/index.js') > node_modules\@vue-office\docx\lib\index.js
echo module.exports = require('./v3/index.js') > node_modules\@vue-office\excel\lib\index.js
echo module.exports = require('./v3/index.js') > node_modules\@vue-office\pdf\lib\index.js

echo @import './v3/index.css'; > node_modules\@vue-office\docx\lib\index.css
echo @import './v3/index.css'; > node_modules\@vue-office\excel\lib\index.css

pnpm run build
pnpm build:bots