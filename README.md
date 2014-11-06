# jsontodir

> convert json to directory

## DESCRIPTION

jsontodir is a tool for converting json object(or json file) to directory. You can pass a json object or a json file name to convert to directory.

## NODE

```js
var jsontodir = require('jsontodir');
jsontodir({
    'js': {
        'type': 'directory',
        'children': {
            'index.js': {
                'type': 'file',
                'content': 'http://g-assets.daily.taobao.net/alinw-utils/config-sample/demo/module-index.js'
            },
            'home.js': {
                'type': 'file',
                'content': 'test content'
            }
        }
    },
    'css': {
        'type': 'directory'
    }
});
```